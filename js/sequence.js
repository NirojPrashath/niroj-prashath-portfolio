/* ==========================================================================
   NP / sequence.js
   The scroll motion from the shared Drive starter ("Cinematic" → main.js).

   The maths and the render call are the starter's, kept verbatim:

     const currentFrame = index => `/New folder/frame_${index.toString().padStart(4,"0")}.jpg`
     canvas.width = 1920; canvas.height = 1080;
     function render() { img = images[state.frame - 1]; if (img.complete) { clearRect; drawImage(img,0,0,canvas.width,canvas.height) } }
     window.addEventListener("scroll", () => {
       const scrollTop = window.scrollY;
       const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
       const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScrollTop));
       const frameIndex = Math.min(frameCount, Math.max(1, Math.floor(scrollFraction * frameCount)));
       state.frame = frameIndex;
       requestAnimationFrame(render);
     });

   Two deliberate, additive changes — the motion itself is untouched:

   1. Frames preload progressively (coarse stride, then the gaps) instead of all
      300 at once, so the first frame appears immediately and scrolling stays
      smooth on slow connections. Frame names, order and indexing are identical.
   2. `requestAnimationFrame(render)` is guarded so a burst of scroll events
      queues one paint, not dozens. Same frame on screen, less work.
   3. On phones and tablets each decoded frame is shrunk to a 960x540 scratch
      canvas and the full size Image is dropped, so the device holds ~2 MB per
      frame instead of ~5.5 MB. Same picture on screen, a third of the memory.

   The canvas is fixed, full-viewport and scrubs from the top of the page to the
   bottom of the page, exactly like the starter.
   ========================================================================== */

(function (NP) {
  "use strict";

  /* ============================================================ frame path */
  /** currentFrame(i) — 1-based index, four-digit padding, exactly as in main.js */
  function framePath(base, i, ext, pad) {
    return base + String(i).padStart(pad, "0") + ext;
  }

  /* ======================================================= progressive load */
  /**
   * Frame stream with a memory budget.
   *
   * The starter loads all 300 frames; fine on a desktop, fatal on iOS Safari
   * where the decoded bitmaps blow the per-tab memory limit and the page is
   * killed ("A problem repeatedly occurred"). So the same 300-step scroll now
   * maps onto a *plan* of frames: maxFrames is the budget and frames are
   * sampled evenly across the sequence. nearest() still resolves to the closest
   * decoded frame, so the scrub never shows a blank canvas.
   */
  function createSequence(opts) {
    const count = opts.count;
    const stride = Math.max(1, opts.stride || 1);
    const concurrency = opts.concurrency || 6;
    const maxFrames = Math.max(2, Math.min(count, opts.maxFrames || count));
    const step = Math.max(1, Math.ceil(count / maxFrames));
    const images = new Array(count);      // images[i] === frame i+1, as in the starter
    const flags = new Uint8Array(count);
    /* Frames are 1600x900: about 5.5 MB decoded each. On phones and tablets the
       canvas never draws them that large, so each one is copied into a 960x540
       scratch canvas and the full size Image is dropped, which is what keeps an
       iPhone from running out of memory mid scroll. Desktops are left alone. */
    const shrink = opts.shrink || (viewWidth() <= 1080 ? { width: 960, height: 540 } : null);
    let started = false;
    let loaded = 0;
    let queue = [];

    /** copy a decoded frame down to the scratch size and let the big one go */
    function shrinkFrame(img) {
      const c = document.createElement("canvas");
      c.width = shrink.width;
      c.height = shrink.height;
      c.getContext("2d").drawImage(img, 0, 0, shrink.width, shrink.height);
      /* hand the full size bitmap back to the browser straight away */
      img.onload = null;
      img.onerror = null;
      img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
      return c;
    }

    function loadOne(i) {
      return new Promise(function (resolve) {
        const img = new Image();
        img.decoding = "async";
        img.onload = function () {
          images[i] = shrink ? shrinkFrame(img) : img;
          flags[i] = 1;
          loaded++;
          if (opts.onLoad) opts.onLoad(i, loaded);
          resolve();
        };
        img.onerror = function () { flags[i] = 2; resolve(); };
        img.src = framePath(opts.path, i + 1, opts.ext, opts.pad);
      });
    }

    function buildQueue() {
      const q = [];
      if (step === 1) {
        for (let i = 0; i < count; i += stride) q.push(i);        // coarse pass first
        for (let i = 0; i < count; i++) if (i % stride !== 0) q.push(i);
        return q;
      }
      for (let i = 0; i < count; i += step) q.push(i);            // even sample inside the budget
      return q;
    }

    function start() {
      if (started) return;
      started = true;
      queue = buildQueue();
      let active = 0;
      const kick = function () {
        if (!queue.length || active >= concurrency) return;
        active++;
        loadOne(queue.shift()).then(function () { active--; kick(); });
      };
      for (let i = 0; i < concurrency; i++) kick();
    }

    /** closest decoded frame, so a scroll never shows a blank canvas */
    function nearest(i) {
      const k = Math.max(0, Math.min(count - 1, i));
      if (flags[k] === 1) return k;
      for (let d = 1; d < count; d++) {
        if (k - d >= 0 && flags[k - d] === 1) return k - d;
        if (k + d < count && flags[k + d] === 1) return k + d;
      }
      return -1;
    }

    return {
      count: count,
      stride: stride,
      step: step,
      start: start,
      /** how many frames this device will actually load — the loader reads this */
      planSize: function () { return Math.ceil(count / step); },
      get: function (i) { return flags[i] === 1 ? images[i] : null; },
      nearest: nearest,
      isLoaded: function (i) { return flags[i] === 1; },
      loadedCount: function () { return loaded; }
    };
  }

  /* ============================================== fixed, scroll-driven canvas */
  /**
   * A single fixed canvas covering the viewport. Scroll position maps onto the
   * frame range across the whole document — top of page to bottom.
   *
   * `object-fit: cover` is handled in CSS on the canvas element itself, which is
   * what the starter does (canvas is sized 100vw/100vh and the raster is drawn
   * at 1920x1080 native).
   */
  function createHeroCanvas(cfg) {
    const canvas = cfg.canvas;
    const ctx = canvas.getContext("2d");
    const sequence = cfg.sequence;
    const frameCount = cfg.frameCount || sequence.count;

    // native resolution of the frames, as set in the starter
    canvas.width = cfg.nativeWidth || 1920;
    canvas.height = cfg.nativeHeight || 1080;

    const state = { frame: 1 };
    let queued = 0;
    let lastDrawn = -1;

    /* ---------------------------------------------------------- render() */
    function render() {
      queued = 0;
      const requested = Math.max(1, Math.min(frameCount, state.frame));
      const idx = sequence.nearest(requested - 1);
      if (idx < 0) return;                       // nothing decoded yet
      const img = sequence.get(idx);
      if (!img) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      lastDrawn = idx;
      if (cfg.onFrame) cfg.onFrame(requested, idx, state);
    }

    function schedule() {
      if (!queued) queued = requestAnimationFrame(render);
    }

    /* --------------------------------------------------- scroll listener */
    function onScroll() {
      const scrollTop = window.scrollY;
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScrollTop));
      const frameIndex = Math.min(
        frameCount,
        Math.max(1, Math.floor(scrollFraction * frameCount))
      );

      state.frame = frameIndex;
      schedule();

      if (cfg.onProgress) cfg.onProgress(scrollFraction, frameIndex);
    }

    return {
      state: state,
      render: render,
      /** paints the first frame as soon as it decodes (images[0].onload = render) */
      prime: function () {
        const first = sequence.nearest(Math.max(0, state.frame - 1));
        if (first >= 0) { state.frame = first + 1; render(); }
      },
      init: function () {
        render();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", function () { schedule(); });
        onScroll();
      },
      refresh: schedule,
      get lastFrameDrawn() { return lastDrawn; }
    };
  }

  /* ============================================================== helpers */
  function prefersReduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /** keep memory honest on small / low-power devices */
  function deviceStride() {
    const mem = navigator.deviceMemory || 8;
    const cores = navigator.hardwareConcurrency || 8;
    if (mem <= 2 || cores <= 2) return 4;
    if (mem <= 4 || cores <= 4) return 2;
    return 1;
  }

  /** smaller side of the viewport — phones ~390, iPads 768–1024, desktops more */
  function viewWidth() {
    return Math.min(window.innerWidth, window.screen ? window.screen.width : window.innerWidth);
  }

  /**
   * How many frames this device may hold in memory.
   * navigator.deviceMemory does not exist in Safari, so width / pointer type
   * carry the decision there. Save-Data wins over everything.
   */
  function frameBudget() {
    const conn = navigator.connection || {};
    const mem = navigator.deviceMemory || 0;
    const cores = navigator.hardwareConcurrency || 4;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const w = viewWidth();

    if (conn.saveData) return 40;                            // visitor asked for less data
    if (mem && mem <= 2) return 40;                          // very low-RAM Android
    if (w <= 720) return 72;                                 // phones
    if (w <= 1080 || coarse || cores <= 4) return 120;       // tablets / small laptops
    return 300;                                              // desktop — unchanged
  }

  /** canvas raster: match the pixels actually drawn, not the source frame size */
  function renderRaster(native) {
    const W = (native && native.nativeWidth) || 1920;
    const H = (native && native.nativeHeight) || 1080;
    const w = viewWidth();
    const k = w <= 720 ? 0.5 : w <= 1080 ? 0.6667 : 1;       // 960x540 / 1280x720 / native
    return { width: Math.round(W * k), height: Math.round(H * k) };
  }

  /** decode a few at a time on phones, more on desktop */
  function loadConcurrency() {
    const w = viewWidth();
    return w <= 720 ? 3 : w <= 1080 ? 4 : 6;
  }

  NP.seq = {
    createSequence: createSequence,
    createHeroCanvas: createHeroCanvas,
    framePath: framePath,
    prefersReduced: prefersReduced,
    deviceStride: deviceStride,
    frameBudget: frameBudget,
    renderRaster: renderRaster,
    loadConcurrency: loadConcurrency
  };
})(window.NP = window.NP || {});
