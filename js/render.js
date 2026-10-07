/* ==========================================================================
   NP / render.js
   Builds section markup from NP data. Content is authored in data.js only —
   nothing here is user-supplied, so template strings are safe.
   ========================================================================== */

(function (NP) {
  "use strict";

  const ICONS = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M12 5.5 18.5 12 12 18.5"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.4 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.7.1-.7.1-.7 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.2 3 .9.1-.7.4-1.2.7-1.5-2.2-.3-4.6-1.2-4.6-5.1 0-1.1.4-2 1-2.8-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9 9 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.8 1 1.7 1 2.8 0 3.9-2.3 4.8-4.6 5.1.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.7.5A10.3 10.3 0 0 0 22 12.3C22 6.6 17.5 2 12 2Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4V9Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.05" fill="currentColor" stroke="none"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.4-.2-3 .8.8-2.9-.2-.4A8.2 8.2 0 0 1 12 3.8Zm-3.2 4c-.2 0-.5.1-.7.4-.3.3-.9 1-.9 2s.7 2 1 2.4c.4.5 1.6 2.5 4 3.4 2 .8 2.4.6 2.9.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2 0-.1-.2-.2-.5-.3l-1.5-.7c-.2-.1-.4-.1-.5.1l-.6.8c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.2-.7-.6-1.1-1.3-1.2-1.5-.1-.2 0-.3.1-.4l.4-.5c.1-.2.1-.3 0-.5l-.6-1.5c-.2-.4-.4-.4-.5-.4h-.4Z"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12h18"/></svg>',
    cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z"/><path d="M6.5 11.5V16c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-4.5M20 10.2v4.6"/></svg>'
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /** an ambulance corridor, drawn — stands in where no screenshot exists */
  const ROUTE_MOTIF = '' +
    '<svg viewBox="0 0 640 400" fill="none" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="rm1" x1="0" y1="0" x2="640" y2="400" gradientUnits="userSpaceOnUse">' +
          '<stop stop-color="#FF6944"/><stop offset=".45" stop-color="#FF374D"/><stop offset="1" stop-color="#FF1767"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M20 330C120 330 150 250 250 232s150 40 250-30 120-90 120-90" stroke="url(#rm1)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="14 12"/>' +
      '<path d="M20 356C140 356 180 276 280 258s170 42 270-26 90-80 90-80" stroke="rgba(245,240,242,.24)" stroke-width="1.6" stroke-linecap="round"/>' +
      '<circle cx="250" cy="232" r="10" fill="#FF374D"/>' +
      '<circle cx="250" cy="232" r="21" stroke="rgba(255,55,77,.4)" stroke-width="1.4"/>' +
      '<circle cx="250" cy="232" r="34" stroke="rgba(255,55,77,.18)" stroke-width="1.2"/>' +
      '<circle cx="120" cy="300" r="7" fill="#F5F0F2" opacity=".65"/>' +
      '<circle cx="392" cy="204" r="7" fill="#F5F0F2" opacity=".4"/>' +
      '<circle cx="520" cy="150" r="7" fill="#F5F0F2" opacity=".28"/>' +
      '<path d="M120 300h44l14-20h40l16 20h60" stroke="rgba(245,240,242,.3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  /** tiny markdown: **bold** only */
  const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  const link = (key) => NP.links[key] || '#';

  function setInto(sel, html) {
    const node = document.querySelector(sel);
    if (node) node.innerHTML = html;
    return node;
  }

  /* ============================================================== fragments */
  function tickerHTML() {
    const items = NP.ticker.map((t) => '<span class="ticker__item">' + esc(t) + '</span>').join('');
    return '<div class="ticker__track" data-ticker-track>' + items + items + '</div><div class="ticker__fade"></div>';
  }

  function capabilitiesHTML() {
    return NP.capabilities.map((c, i) =>
      '<div class="cap" data-reveal style="--reveal-delay:' + (i * 60) + 'ms">' +
        '<span class="cap__n">' + esc(c.n) + '</span>' +
        '<span class="cap__label">' + esc(c.label) + '</span>' +
      '</div>'
    ).join('');
  }

  function aboutHTML() {
    const a = NP.about;
    /* no portrait here: the section is one wide glass panel with a readable
       measure and a foot strip (tags + availability) under a hairline */
    return '' +
      '<div class="about__body glass glass--edge">' +
        '<div class="about__copy">' +
          a.paragraphs.map((p, i) => '<p' + (i === 0 ? ' data-reveal' : ' data-reveal style="--reveal-delay:80ms"') + '>' + md(p) + '</p>').join('') +
          '<p class="muted" data-reveal style="--reveal-delay:120ms">' + esc(a.focus) + '</p>' +
        '</div>' +
        '<aside class="about__rail">' +
          '<div class="about__tags" data-reveal style="--reveal-delay:160ms">' + a.tags.map((t) => '<span class="chip">' + esc(t) + '</span>').join('') + '</div>' +
          '<div class="about__status" data-reveal style="--reveal-delay:200ms"><i></i><span>' + esc(a.status) + '</span></div>' +
        '</aside>' +
      '</div>';
  }

  function credentialsHTML() {
    return NP.credentials.map((c, i) =>
      '<article class="cred glass" data-reveal style="--reveal-delay:' + (i * 90) + 'ms">' +
        '<div class="cred__top">' +
          '<span class="cred__badge">' + (ICONS[c.icon] || ICONS.briefcase) + '</span>' +
          '<div>' +
            '<span class="cred__kicker">' + esc(c.kicker) + '</span>' +
            '<h3 class="cred__title">' + esc(c.title) + '</h3>' +
          '</div>' +
        '</div>' +
        '<p class="cred__org">' + esc(c.org) + '</p>' +
        '<p class="cred__desc">' + esc(c.desc) + '</p>' +
        '<div class="cred__list">' + c.tags.map((t) => '<span class="chip chip--mono">' + esc(t) + '</span>').join('') + '</div>' +
      '</article>'
    ).join('');
  }

  function mediaHTML(p, size) {
    if (!p.image) {
      return '<div class="work-card__media work-card__media--motif">' +
          ROUTE_MOTIF +
          '<span class="work-card__fallback">Concept visual · no screenshots</span>' +
        '</div>';
    }
    const wide = p.image;
    const card = p.imageCard || p.image;
    return '<div class="work-card__media">' +
        '<img src="' + card + '" srcset="' + card + ' 900w, ' + wide + ' 1500w"' +
        ' sizes="(max-width: 700px) 92vw, (max-width: 1000px) 46vw, 30vw"' +
        ' alt="' + esc(p.imageAlt || p.title + ' screenshot') + '"' +
        ' loading="lazy" decoding="async" width="1500" height="1000">' +
        '<span class="chip chip--mono work-card__tag">Screenshot</span>' +
      '</div>';
  }

  function workPreviewHTML() {
    const list = NP.projects.slice(0, 3);
    return list.map((p, i) =>
      '<a class="work-card glass glass--edge glass--travel" href="projects.html#' + p.id + '" data-reveal style="--reveal-delay:' + (i * 90) + 'ms">' +
        '<span class="work-card__sheen" aria-hidden="true"></span>' +
        mediaHTML(p) +
        '<div class="work-card__head">' +
          '<span class="work-card__idx">#' + p.idx + '</span>' +
          '<span class="work-card__cat">' + esc(p.category.split('·')[0].trim()) + '</span>' +
        '</div>' +
        '<div class="work-card__meta">' +
          '<h3 class="work-card__title">' + esc(p.title) + '</h3>' +
          '<p class="work-card__desc">' + esc(p.summary) + '</p>' +
          '<div class="work-card__stats">' + p.metrics.slice(0, 3).map((m) => '<span class="chip chip--mono">' + esc(m.v) + ' · ' + esc(m.l) + '</span>').join('') + '</div>' +
        '</div>' +
        '<div class="work-card__foot">' +
          '<span class="muted" style="font-size:var(--step--1)">' + esc(p.context) + '</span>' +
          '<span class="work-card__go">Case study ' + ICONS.arrow + '</span>' +
        '</div>' +
      '</a>'
    ).join('');
  }

  function skillsHTML() {
    return NP.skills.map((s, i) =>
      '<div class="skill-row" data-reveal style="--reveal-delay:' + (i * 70) + 'ms">' +
        '<div class="skill-row__label"><span>' + esc(s.label) + '</span><h3>' + esc(s.title) + '</h3></div>' +
        '<div class="skill-row__items">' + s.items.map((it) => '<span class="chip">' + esc(it) + '</span>').join('') + '</div>' +
      '</div>'
    ).join('');
  }

  function workflowHTML() {
    const w = NP.workflow;
    const rail = w.steps.map((s, i) =>
      '<a class="flow__jump" href="#' + s.id + '" data-flow-jump="' + s.id + '"' + (i === 0 ? ' aria-current="true"' : '') + '>' +
        '<b>' + s.num + '</b><span>' + esc(s.title) + '</span>' +
      '</a>'
    ).join('');

    const steps = w.steps.map((s, i) =>
      '<article class="step glass" id="' + s.id + '" data-flow-step data-reveal style="--reveal-delay:' + (i * 60) + 'ms">' +
        '<span class="step__cover" aria-hidden="true"></span>' +
        '<div class="step__head"><span class="step__num">' + s.num + '</span><h3 class="step__title">' + esc(s.title) + '</h3></div>' +
        '<p class="step__lede">' + esc(s.lede) + '</p>' +
        '<div class="step__cols">' +
          s.cols.map((c) =>
            '<div class="step__col"><h4>' + esc(c.h) + '</h4><ul>' + c.items.map((it) => '<li>' + esc(it) + '</li>').join('') + '</ul></div>'
          ).join('') +
        '</div>' +
      '</article>'
    ).join('');

    const principles = w.principles.map((p) =>
      '<div class="principle glass glass--soft" data-reveal><b>' + esc(p.k) + '</b><h4>' + esc(p.t) + '</h4><p>' + esc(p.d) + '</p></div>'
    ).join('');

    const kpis = w.kpis.map((k) => '<div><b>' + esc(k.v) + '</b><small>' + esc(k.l) + '</small></div>').join('');

    return '' +
      '<div class="flow">' +
        '<div class="flow__rail glass">' +
          '<span class="flow__rail-title">The five passes</span>' + rail +
          '<p class="muted" style="font-size:var(--step--1);margin-top:0.6rem">' + esc(w.intro) + '</p>' +
        '</div>' +
        '<div class="flow__steps">' + steps + '</div>' +
      '</div>' +
      '<div class="kpi" style="margin-top:clamp(1.5rem,1rem + 2vw,2.5rem)" data-reveal>' + kpis + '</div>' +
      '<h3 style="margin-top:clamp(2.5rem,2rem + 3vw,4rem)" data-reveal>Principles this workflow keeps honest</h3>' +
      '<div class="principles" style="margin-top:1.25rem">' + principles + '</div>';
  }

  function contactHTML() {
    const c = NP.contact;
    const actions = c.actions.map((a) =>
      '<a class="btn ' + (a.kind === 'primary' ? 'btn--primary' : 'btn--ghost') + '" href="' + link(a.href) + '"' +
      (a.href === 'github' || a.href === 'linkedin' || a.href === 'whatsapp' || a.href === 'gmail' || a.href === 'instagram' ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
        esc(a.label) +
        (a.kind === 'primary'
          ? '<span class="btn__orb">' + ICONS.arrowRight + '</span>'
          : '<span class="btn__icon">' + (ICONS[a.icon] || ICONS.mail) + '</span>') +
      '</a>'
    ).join('');

    const channels = c.channels.map((ch) =>
      '<a class="contact__item" href="' + link(ch.href) + '"' +
      (ch.href === 'gmail' || ch.href === 'github' || ch.href === 'linkedin' || ch.href === 'whatsapp' || ch.href === 'instagram' ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
        (ICONS[ch.icon] || ICONS.mail) +
        '<span><small>' + esc(ch.label) + '</small><b>' + esc(ch.value).replace(/([@/])/g, '$1<wbr>') + '</b></span>' +
        '<em>' + ICONS.arrow + '</em>' +
      '</a>'
    ).join('');

    return '<div class="contact glass glass--deep glass--edge">' +
        '<div class="contact__body">' +
          '<span class="label"><b>06</b> Contact</span>' +
          '<h2 data-reveal>' + esc(c.heading) + '</h2>' +
          '<p class="lede" data-reveal style="--reveal-delay:70ms">' + esc(c.body) + '</p>' +
          '<div class="btn-row" data-reveal style="--reveal-delay:120ms">' + actions + '</div>' +
          '<p class="contact__note">' + esc(c.note) + '</p>' +
        '</div>' +
        '<div class="contact__list" data-reveal style="--reveal-delay:100ms">' + channels + '</div>' +
      '</div>';
  }

  function footerHTML() {
    const f = NP.footer;
    return '<div class="wrap wrap-wide site-foot__grid">' +
        '<div>' +
          '<a class="brand" href="index.html#top" aria-label="' + esc(NP.profile.name) + ' — back to top">' +
            '<span class="brand__mark" aria-hidden="true">' + NP.profile.initials + '</span>' +
            '<span class="brand__text"><span class="brand__name">' + esc(NP.profile.short) + '</span>' +
            '<span class="brand__role">' + esc(NP.profile.title) + '</span></span>' +
          '</a>' +
          '<p class="muted" style="margin-top:1rem;max-width:38ch;font-size:var(--step--1)">' + esc(NP.profile.positioning) + '</p>' +
        '</div>' +
        '<div>' +
          '<h4>Explore</h4>' +
          '<ul>' +
            '<li><a href="index.html#about">About</a></li>' +
            '<li><a href="projects.html">All projects</a></li>' +
            '<li><a href="index.html#workflow">Workflow</a></li>' +
            '<li><a href="index.html#contact">Contact</a></li>' +
          '</ul>' +
        '</div>' +
        '<div>' +
          '<h4>Elsewhere</h4>' +
          '<ul>' +
            '<li><a href="' + NP.links.gmail + '" target="_blank" rel="noopener noreferrer">Gmail</a></li>' +
            '<li><a href="' + NP.links.github + '" target="_blank" rel="noopener noreferrer">GitHub</a></li>' +
            '<li><a href="' + NP.links.linkedin + '" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>' +
            '<li><a href="' + NP.links.whatsapp + '" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="wrap wrap-wide site-foot__base">' +
        '<span>' + esc(f.note) + '</span>' +
        '<span>' + esc(f.sub) + '</span>' +
      '</div>';
  }

  /* ========================================================= projects page */
  function caseHTML(p) {
    const hi = p.lead ? '<span class="case__high">' + ICONS.arrow + esc(p.lead) + '</span>' : '';

    const metrics = '<div class="case__metrics">' + p.metrics.map((m) => '<div><b>' + esc(m.v) + '</b><small>' + esc(m.l) + '</small></div>').join('') + '</div>';

    const tech = '<div class="case__labels"><h4>Built with</h4><div class="case__chips">' +
      p.tech.map((t) => '<span class="chip chip--mono">' + esc(t) + '</span>').join('') + '</div></div>';

    const drawer = '' +
      '<div class="case__drawer-grid">' +
        '<div><h4>What is inside</h4><ul>' + p.inside.map((i) => '<li>' + esc(i) + '</li>').join('') + '</ul></div>' +
        '<div><h4>Decisions</h4><div class="decisions">' +
          p.decisions.map((d) => '<div class="decision"><b>' + esc(d.title) + '</b><span>' + esc(d.note) + '</span></div>').join('') +
        '</div></div>' +
      '</div>';

    const media = p.image
      ? '<figure class="case__media">' +
          '<img src="' + p.image + '" alt="' + esc(p.imageAlt || p.title + ' screenshot') + '"' +
          ' loading="lazy" decoding="async" width="1500" height="1000">' +
          '<figcaption><span class="chip chip--mono">Screenshot</span>' +
          '<span class="case__media-note">' + esc(p.context) + '</span></figcaption>' +
        '</figure>'
      : '<figure class="case__media case__media--motif">' +
          ROUTE_MOTIF +
          '<figcaption><span class="chip chip--mono">Concept visual</span>' +
          '<span class="case__media-note">No screenshots captured for this concept</span></figcaption>' +
        '</figure>';

    return '' +
      '<article class="case glass glass--edge" id="' + p.id + '" data-cat="' + p.filters.join(' ') + '" data-reveal>' +
        media +
        '<div class="case__aside">' +
          '<span class="case__idx" aria-hidden="true">#' + p.idx + '</span>' +
          '<div class="case__kicker"><span class="chip chip--accent">' + esc(p.category.split('·')[0].trim()) + '</span>' +
            '<span class="case__sub">' + esc(p.context) + '</span></div>' +
          '<h2 class="case__title">' + esc(p.title) + '</h2>' +
          '<p class="case__summary">' + esc(p.summary) + '</p>' +
          hi +
        '</div>' +
        '<div class="case__body">' +
          metrics +
          '<ul class="case__points">' + p.points.map((pt) => '<li><span>' + esc(pt) + '</span></li>').join('') + '</ul>' +
          tech +
          '<div class="case__more">' +
            '<button class="case__toggle" type="button" aria-expanded="false" aria-controls="' + p.id + '-drawer">' +
              ICONS.chev + '<span>Inside the build</span>' +
            '</button>' +
            '<div class="case__drawer" id="' + p.id + '-drawer" role="region" aria-label="' + esc(p.title) + ' build detail"><div>' + drawer + '</div></div>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function supportingHTML() {
    return NP.supporting.map((s, i) =>
      '<article class="cast-card glass" data-reveal style="--reveal-delay:' + (i * 60) + 'ms">' +
        '<div class="cast-card__top"><h3>' + esc(s.title) + '</h3><span class="cast-card__n">' + esc(s.n).replace('S', '#') + '</span></div>' +
        '<p>' + esc(s.desc) + '</p>' +
        '<div class="cast-card__chips">' + s.tags.map((t) => '<span class="chip chip--mono">' + esc(t) + '</span>').join('') + '</div>' +
      '</article>'
    ).join('');
  }

  function filtersHTML() {
    const cats = [
      { id: 'all', label: 'All projects' },
      { id: 'web', label: 'Web' },
      { id: 'commerce', label: 'Commerce' },
      { id: 'mobile', label: 'Mobile' },
      { id: 'healthcare', label: 'Healthcare' }
    ];
    return cats.map((c) => {
      const n = c.id === 'all' ? NP.projects.length : NP.projects.filter((p) => p.filters.includes(c.id)).length;
      return '<button class="filter" type="button" data-filter="' + c.id + '" aria-pressed="' + (c.id === 'all') + '">' +
        esc(c.label) + '<i>' + String(n).padStart(2, '0') + '</i></button>';
    }).join('');
  }

  function jumpHTML() {
    return NP.projects.map((p) =>
      '<a href="#' + p.id + '" data-jump="' + p.id + '" aria-label="Jump to project ' + p.idx + ': ' + esc(p.title) + '">' + p.idx + '</a>'
    ).join('');
  }

  /* ================================================================ exports */
  NP.render = {
    ICONS: ICONS,
    esc: esc,
    capabilities: (sel) => setInto(sel, capabilitiesHTML()),
    ticker: (sel) => setInto(sel, tickerHTML()),
    about: (sel) => setInto(sel, aboutHTML()),
    credentials: (sel) => setInto(sel, credentialsHTML()),
    workPreview: (sel) => setInto(sel, workPreviewHTML()),
    skills: (sel) => setInto(sel, skillsHTML()),
    workflow: (sel) => setInto(sel, workflowHTML()),
    contact: (sel) => setInto(sel, contactHTML()),
    footer: (sel) => setInto(sel, footerHTML()),
    cases: (sel) => setInto(sel, NP.projects.map(caseHTML).join('')),
    supporting: (sel) => setInto(sel, supportingHTML()),
    filters: (sel) => setInto(sel, filtersHTML()),
    jump: (sel) => setInto(sel, jumpHTML()),
    channels: () => NP.contact.channels
  };
})(window.NP = window.NP || {});
