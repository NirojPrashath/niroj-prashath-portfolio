/* ==========================================================================
   NP / main.js
   Boots the page: content render, the Drive scroll motion (one fixed canvas,
   top of page → bottom), the readout HUD, reveals, filters, drawers, rail.
   ========================================================================== */

(function () {
  "use strict";

  const NP = window.NP;
  const R = NP.render;
  const S = NP.seq;
  const reduced = S.prefersReduced();
  const page = document.body.dataset.page || "index";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  let sequenceRef = null;          /* set once the frame stream boots */

  /* ============================================================== 0. loader
     The reference portfolio's preloader, re-skinned to this theme: a full
     cover of the same black + bloom, the name ghosted then lit in the accent
     gradient, and a hairline meter fed by the real frame stream — not a fake
     timer. It never gates the motion: the page unlocks as soon as there are
     enough frames to scrub smoothly (or the cap is reached). */
  function bootLoader() {
    const el = $("#loader");
    const body = document.body;
    if (!el) { body.classList.remove("is-loading"); return; }

    const total = (NP.sequence && NP.sequence.count) || 300;
    const countEl = $(".loader__count b", el);
    const totalEl = $(".loader__count i", el);

    const MIN = reduced ? 240 : 1150;         /* stay on screen at least */
    const CAP = 7000;                         /* never hold the page longer */
    const ENOUGH = Math.min(24, total);       /* frames needed to scrub */
    const started = performance.now();
    let done = false;

    el.style.setProperty("--load-p", "0");
    if (totalEl) totalEl.textContent = String(total).padStart(3, "0");

    function finish() {
      if (done) return;
      done = true;
      el.classList.add("is-done");
      body.classList.remove("is-loading");
      body.classList.add("is-loaded");
      window.dispatchEvent(new Event("scroll"));    /* re-sync the frame */
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
    }

    function tick() {
      if (done) return;
      const loaded = sequenceRef ? sequenceRef.loadedCount() : 0;
      const ratio = total ? Math.min(1, loaded / total) : 1;

      el.style.setProperty("--load-p", ratio.toFixed(4));
      if (countEl) countEl.textContent = String(Math.min(loaded, total)).padStart(3, "0");

      const elapsed = performance.now() - started;
      const ready = loaded >= ENOUGH || body.classList.contains("no-seq");
      if ((elapsed >= MIN && ready) || elapsed >= CAP) finish();
      else setTimeout(tick, 90);
    }

    /* a keyboard visitor skipping ahead must not be held behind the cover */
    document.addEventListener("focusin", function (e) {
      const t = e.target;
      if (t && t.classList && t.classList.contains("skip-link")) finish();
    });

    tick();
  }

  /* ============================================================ 1. content */
  function renderIndex() {
    R.capabilities("#capability-slot");
    R.ticker("#ticker-slot");
    R.about("#about-slot");
    R.credentials("#credentials-slot");
    R.workPreview("#work-slot");
    R.skills("#skills-slot");
    R.workflow("#workflow-slot");
    R.contact("#contact-slot");
    R.footer("#footer-slot");
  }

  function renderProjects() {
    R.filters("#filter-slot");
    R.jump("#jump-slot");
    R.cases("#cases-slot");
    R.supporting("#cast-slot");
    R.footer("#footer-slot");
  }

  /* ============================================================== 2. header */
  function bootHeader() {
    const head = $(".site-head");
    if (!head) return;
    let last = window.scrollY;
    let ticking = false;

    function update() {
      ticking = false;
      const y = window.scrollY;
      head.classList.toggle("is-stuck", y > 12);
      const sheet = $(".sheet");
      const sheetOpen = sheet && sheet.classList.contains("is-open");
      if (!sheetOpen && y > 420 && y > last + 6) head.classList.add("is-hidden");
      else if (y < last - 6 || y < 420) head.classList.remove("is-hidden");
      last = y;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function bootSheet() {
    const burger = $(".burger");
    const sheet = $(".sheet");
    if (!burger || !sheet) return;

    function set(open) {
      burger.setAttribute("aria-expanded", String(open));
      sheet.classList.toggle("is-open", open);
      sheet.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("is-locked", open);
      if (open) {
        const first = $(".sheet__link", sheet);
        if (first) first.focus({ preventScroll: true });
      }
    }

    burger.addEventListener("click", function () {
      set(burger.getAttribute("aria-expanded") !== "true");
    });

    $$("a", sheet).forEach((a) => a.addEventListener("click", () => set(false)));

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sheet.classList.contains("is-open")) {
        set(false);
        burger.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960 && sheet.classList.contains("is-open")) set(false);
    });
  }

  /* ================================================== 3. scroll rail + zone */
  function bootScroll() {
    const root = document.documentElement;
    const zones = $$("[data-zone]");
    let ticking = false;

    function update() {
      ticking = false;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      const p = Math.max(0, Math.min(1, window.scrollY / max));
      root.style.setProperty("--progress", p.toFixed(4));

      if (zones.length) {
        const mark = window.innerHeight * 0.42;
        let active = zones[0];
        zones.forEach(function (z) {
          if (z.getBoundingClientRect().top <= mark) active = z;
        });
        if (document.body.dataset.zone !== active.dataset.zone) {
          document.body.dataset.zone = active.dataset.zone;
        }
      }

      const navLinks = $$(".nav__link[data-target], .sheet__link[data-target]");
      if (navLinks.length) {
        const targets = {};
        navLinks.forEach(function (a) { targets[a.dataset.target] = 1; });
        let best = null;
        let bestDist = Infinity;
        zones.forEach(function (z) {
          if (!targets[z.dataset.zone]) return;
          const r = z.getBoundingClientRect();
          const d = Math.abs(r.top - 120);
          if (r.bottom > 140 && d < bestDist) { bestDist = d; best = z.dataset.zone; }
        });
        navLinks.forEach(function (a) {
          if (best && a.dataset.target === best) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      }
    }

    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ============================================================= 4. reveals */
  function bootReveals() {
    const items = $$("[data-reveal]");
    if (!items.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.1 });

    items.forEach((el) => io.observe(el));
  }

  /* ============================================================ 5. counters */
  function bootCounters() {
    const nums = $$("[data-count]");
    if (!nums.length) return;

    function run(el) {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const pad = parseInt(el.dataset.pad || "0", 10);
      const dur = reduced ? 0 : 1100;
      const t0 = performance.now();

      function step(t) {
        const k = dur === 0 ? 1 : Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        const v = Math.round(target * eased);
        el.textContent = String(v).padStart(Math.max(pad, String(v).length), "0") + suffix;
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    nums.forEach((el) => io.observe(el));
  }

  /* ====================================================== 6. pointer light */
  function bootCursor() {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const light = $(".cursor-light");
    if (!light) return;

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let cx = x, cy = y, raf = 0;

    function loop() {
      cx += (x - cx) * 0.1;
      cy += (y - cy) * 0.1;
      light.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", function (e) {
      x = e.clientX; y = e.clientY;
      light.classList.add("is-on");
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });

    document.addEventListener("mouseleave", () => light.classList.remove("is-on"));
  }

  /* ================================================ 7. the scroll motion */
  /**
   * One fixed canvas, scrubbed by page scroll — the Drive starter's behaviour.
   * No other animated artwork on the page: this is the single moving portrait.
   */
  function bootSequence() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;

    const seqCfg = NP.sequence;
    const sequence = S.createSequence({
      count: seqCfg.count,
      path: seqCfg.path,
      ext: seqCfg.ext,
      pad: seqCfg.pad,
      stride: reduced ? 8 : S.deviceStride(),
      concurrency: 6
    });

    sequenceRef = sequence;

    /* readout + progress HUD ------------------------------------------- */
    const hudFrame = $("[data-hud-frame]");
    const hudFill = $("[data-hud-fill]");
    const hudPct = $("[data-hud-pct]");
    const total = String(seqCfg.count).padStart(3, "0");

    function setHud(frame, fraction) {
      if (hudFrame) {
        hudFrame.textContent = String(Math.max(1, frame)).padStart(3, "0") + " / " + total;
      }
      if (hudFill) hudFill.style.transform = "scaleX(" + fraction.toFixed(4) + ")";
      if (hudPct) hudPct.textContent = Math.round(fraction * 100) + "%";
    }

    /* canvas ------------------------------------------------------------ */
    const hero = S.createHeroCanvas({
      canvas: canvas,
      sequence: sequence,
      frameCount: seqCfg.count,
      nativeWidth: seqCfg.nativeWidth,
      nativeHeight: seqCfg.nativeHeight,
      onProgress: function (fraction, frame) {
        setHud(frame, fraction);
        // Scrim: strongest at the top where the headline sits, easing back as the
        // page deepens so the portrait is at its most present mid-page.
        const scrim = 1 - 0.2 * Math.min(1, fraction * 1.6);
        // Bloom: the magenta→red atmosphere opens up through the middle and
        // returns for the closing sections, mirroring the reference's balance.
        const k = Math.abs(fraction - 0.5) * 2;                 // 1 → 0 → 1
        const bloom = (0.52 + 0.48 * (1 - k)).toFixed(3);
        const root = document.documentElement;
        root.style.setProperty("--scrim-o", scrim.toFixed(3));
        root.style.setProperty("--bloom-o", bloom);
      },
      onFrame: function (frame) { setHud(frame, Math.min(1, (frame - 1) / (seqCfg.count - 1))); }
    });

    /* first paint as soon as frame 1 decodes (images[0].onload = render) --- */
    let primed = false;
    const primeWatch = setInterval(function () {
      if (sequence.loadedCount() > 0) {
        if (!primed) {
          primed = true;
          hero.prime();
          document.body.classList.add("seq-ready");
        }
      }
      if (primed && sequence.loadedCount() > 12) clearInterval(primeWatch);
    }, 90);

    /* reduced motion: hold the final frame, no scroll animation ---------- */
    if (reduced) {
      const still = setInterval(function () {
        if (sequence.isLoaded(seqCfg.count - 1)) {
          hero.state.frame = seqCfg.count;
          hero.render();
          setHud(seqCfg.count, 1);
          document.body.classList.add("seq-ready");
          clearInterval(still);
        }
      }, 150);
      setTimeout(function () { clearInterval(still); }, 20000);
      // still allow a manual repaint on resize
      window.addEventListener("resize", hero.refresh);
      sequence.start();
      return;
    }

    hero.init();
    sequence.start();

    /* repaint after a breakpoint change (canvas raster is fixed-size) ---- */
    let rz = 0;
    window.addEventListener("resize", function () {
      clearTimeout(rz);
      rz = setTimeout(hero.refresh, 140);
    });

    /* if nothing at all could load, drop back to the flat page ---------- */
    setTimeout(function () {
      if (!sequence.loadedCount()) document.body.classList.add("no-seq");
    }, 4000);

    window.addEventListener("pageshow", function () { hero.refresh(); });
  }

  /* ============================================== 8. projects: filters etc */
  function bootProjects() {
    const cases = $$(".case");
    const filters = $$(".filter");
    const countEl = $("[data-count-visible]");
    const empty = $(".case-empty");

    function apply(cat) {
      let shown = 0;
      cases.forEach(function (c) {
        const cats = (c.dataset.cat || "").split(/\s+/);
        const on = cat === "all" || cats.indexOf(cat) > -1;
        c.classList.toggle("is-hidden", !on);
        if (on) {
          shown++;
          if (!reduced) {
            c.classList.remove("is-in");
            requestAnimationFrame(function () { c.classList.add("is-in"); });
          }
        }
      });
      filters.forEach((f) => f.setAttribute("aria-pressed", String(f.dataset.filter === cat)));
      if (countEl) countEl.textContent = shown + (shown === 1 ? " case study" : " case studies");
      if (empty) empty.classList.toggle("is-on", shown === 0);
      history.replaceState(null, "", cat === "all" ? location.pathname : "#" + cat);
    }

    filters.forEach(function (f) {
      f.addEventListener("click", () => apply(f.dataset.filter));
    });

    const hash = location.hash.replace("#", "");
    if (filters.some((f) => f.dataset.filter === hash)) apply(hash);

    /* drawers */
    $$(".case__toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
      });
    });

    /* jump nav scroll-spy */
    const jumps = $$("[data-jump]");
    if (jumps.length && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          jumps.forEach(function (j) {
            if (j.dataset.jump === e.target.id) j.setAttribute("aria-current", "true");
            else j.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      $$(".case").forEach((c) => io.observe(c));
    }
  }

  /* ==================================================== 9. workflow rail */
  function bootFlow() {
    const steps = $$("[data-flow-step]");
    const jumps = $$("[data-flow-jump]");
    if (!steps.length || !jumps.length) return;
    if (!("IntersectionObserver" in window)) return;

    function setActive(id) {
      jumps.forEach(function (j) {
        j.setAttribute("aria-current", String(j.dataset.flowJump === id));
      });
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -50% 0px" });

    steps.forEach((s) => io.observe(s));
    jumps.forEach(function (j) {
      j.addEventListener("click", function () { setActive(j.dataset.flowJump); });
    });
  }

  /* ======================================================= 10. boot it all */
  function boot() {
    bootLoader();

    if (page === "projects") renderProjects();
    else renderIndex();

    bootHeader();
    bootSheet();
    bootScroll();
    bootReveals();
    bootCounters();
    bootCursor();
    bootSequence();

    if (page === "projects") bootProjects();
    else bootFlow();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
