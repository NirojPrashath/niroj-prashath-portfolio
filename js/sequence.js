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
  function createSequence(opts) {
    const count = opts.count;
    const stride = Math.max(1, opts.stride || 1);
    const concurrency = opts.concurrency || 6;
    const images = new Array(count);      // images[i] === frame i+1, as in the starter
    const flags = new Uint8Array(count);
    let started = false;
    let loaded = 0;
    let queue = [];

    function loadOne(i) {
      return new Promise(function (resolve) {
        const img = new Image();
        img.decoding = "async";
        img.onload = function () {
          images[i] = img;
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
      for (let i = 0; i < count; i += stride) q.push(i);          // coarse pass first
      for (let i = 0; i < count; i++) if (i % stride !== 0) q.push(i);
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
      start: start,
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

  NP.seq = {
    createSequence: createSequence,
    createHeroCanvas: createHeroCanvas,
    framePath: framePath,
    prefersReduced: prefersReduced,
    deviceStride: deviceStride
  };
})(window.NP = window.NP || {});
