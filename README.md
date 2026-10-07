# Portfolio — Yogeswaran Niroj Prashath

**Software Engineer & UI/UX Designer · Sri Lanka**
*Design for people. Engineer with intent.*

A two-page static portfolio. One fixed canvas plays the shared **Cinematic**
frame sequence, scrubbed by page scroll from the very top of the page to the
bottom — and the details sit on glass panels above it. No frameworks, no build
step, no external requests.

---

## Quick start

```bash
# option A — just open it
open index.html            # macOS (or double-click the file)

# option B — serve it (recommended while editing)
python3 -m http.server 8000
# → http://localhost:8000
```

Works over `file://` too: no `fetch()`, no bundler, no runtime dependencies.

---

## Running it in VS Code

No `npm install`, no build step — the folder is the site. Open the **`portfolio`**
folder (`File → Open Folder…`) and pick one of these:

**1. Live Server (best while designing)**
1. Extensions (`Ctrl/Cmd+Shift+X`) → install **Live Server** (Ritwick Dey). It is
   already listed in `.vscode/extensions.json`, so VS Code will offer it under
   "Recommended".
2. Right-click `index.html` → **Open with Live Server** (`Alt+L`, then `Alt+O`).
3. It opens `http://127.0.0.1:8000` and reloads the page on every save — handy
   when you are tuning type or the glass. Port and root are preset in
   `.vscode/settings.json`.

**2. Integrated terminal (no extensions)**
```bash
python3 -m http.server 8000     # → http://localhost:8000
```
Or press `Ctrl/Cmd+Shift+B` → **Serve portfolio** — the same command is wired as
a VS Code task in `.vscode/tasks.json`. `Ctrl+C` in the terminal stops it.

**3. Just opening the file**
Double-click `index.html` (or right-click → *Reveal in Finder/Explorer*). It runs
from `file://` too, because nothing here calls `fetch()`.

**Notes**
- Keep the tab on `http://…`, not `file://`, if you use Live Server for editing —
  the frames stream better over HTTP.
- The 300 frames in `frames/` are excluded from VS Code search
  (`search.exclude`) so `Ctrl+P`/`Ctrl+Shift+F` stay fast. They still show in the
  Explorer.
- To check the mobile layout, open the Command Palette → **Developer: Toggle
  Device Emulation**, then pick a device and reload.

---

## The scroll motion

This is the motion from the shared Drive starter (`Cinematic → main.js`), kept
as-is. The maths, the frame path and the render call are the starter's:

```js
const currentFrame = index => `frames/frame_${index.toString().padStart(4,"0")}.jpg`;
canvas.width = 1920; canvas.height = 1080;

function render() {
  const img = images[state.frame - 1];
  if (img && img.complete) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScrollTop));
  const frameIndex = Math.min(frameCount, Math.max(1, Math.floor(scrollFraction * frameCount)));
  state.frame = frameIndex;
  requestAnimationFrame(render);
});
```

CSS matches the starter's canvas rule (`position: fixed; top: 0; left: 0;
width: 100vw; height: 100vh; object-fit: cover`). The canvas raster is still
1920×1080; `object-fit: cover` does the responsive cropping, exactly as in the
original page.

Two additive-only changes (the motion is untouched):

1. **Progressive preload.** The starter loads all 300 frames at once. Here they
   stream in coarse-stride first, then fill the gaps with a 6-request window, so
   frame 1 appears almost immediately and scrolling stays smooth. Names, order
   and 1-based indexing are identical. Low-power devices keep a wider stride.
2. **One paint per burst.** `requestAnimationFrame(render)` is guarded so a
   flurry of scroll events queues a single repaint. Same frame on screen.

The HUD in the bottom-left reads the frame you are currently seeing (`037 / 300`)
and how far through the page you are — handy when you are tuning the crop.

**Reduced motion** (`prefers-reduced-motion: reduce`) paints the final frame and
holds it: no scroll animation, no reveals.

---

## Boot loader

The preloader from the shared reference portfolio, re-skinned to this theme:
a full cover of the same black + bloom field, the name with **line one ghosted**
and **line two in the accent gradient**, and a 2px hairline meter underneath.
Two differences from the reference:

- The meter is fed by the **real frame stream** (`sequence.loadedCount()/count`)
  rather than a fixed 1.4s timer, so it reports what is actually happening.
  The `000 / 300` readout uses the same mono voice as the frame HUD.
- The shell unlocks on **either** "enough frames to scrub smoothly" (24) **or**
  the 7s cap, whichever comes first — so the cover can never trap the page. If
  the frame stream fails it releases on the `no-seq` fallback too.

On hand-off the cover fades (720ms) and the hero title's two lines rise in
(`hero-line`, staggered 120ms) — the reference's `playTitle()` gesture. The
loader markup is `aria-hidden` (decorative), `prefers-reduced-motion` removes
the type animation, and focusing the skip link dismisses the cover immediately.
Without JS, a `<noscript>` rule hides the cover and unlocks the page.

Tuning lives in `bootLoader()` in `js/main.js` — `MIN`, `CAP`, `ENOUGH`.

---

## Design language

The whole system is a reinterpretation of one reference image (a studio
portfolio hero: black→magenta bloom, rim-lit portrait, white geometric display
type, one warm orange accent). It is the same language on every section — not a
recolour of a couple of cards.

| Element | Decision |
| --- | --- |
| Layering | Canvas (0) → bloom (1) → scrim (2) → `<main>` (3) → fixed shell (45–60) → loader (900). `<main>` must stay a positioned layer, or the atmosphere pass paints over the content instead of under it. |
| Atmosphere | Black base + magenta/red/amber bloom. The bloom is a real layer (`.bloom`) over the canvas; its opacity is driven per scroll tick (`0.52 + 0.48·(1−k)`) so the image breathes instead of sitting flat. |
| Display type | Heavy geometric sans (`--font-display`, Poppins first), tight tracking, two stacked lines; hero second line is an outlined ghost line. |
| Accent | Exactly one warm orange, `--accent: #FF5C1A`. It marks numerals, eyebrows, primary orbs and the scroll rail — nowhere else. |
| Numbering | One numbering voice: `.label <b>0N</b>` section labels, `#01…` work/case indexes, `#1…` supporting cast. Menu rows carry an arrow, never a number. |
| Primary CTA | Light pill (`#F7F2EF`) + 30px orange gradient circle with an arrow (`.btn--primary` + `.btn__orb`); secondary = hairline ghost pill. |
| Section labels | index: `01 About · 02 Experience & education · 03 Selected work · 04 Toolkit · 05 Workflow · 06 Contact`; projects: `01 Selected work · 02 Supporting cast · 03 Next`. |
| Capability strip | Four numbered rows (`.cap` → `#capability-slot`) under the hero, generated from `NP.capabilities`. |
| About section | One wide glass panel, no portrait: a `.about__copy` column (66ch measure) beside an `.about__rail` of role chips and availability, separated by a hairline that becomes a top border on tablet. |
| Rules | Hairline rules (`--line`, `--line-2`) divide blocks instead of boxes-in-boxes; full-bleed bands separate sections rather than heavy borders. |

## Glass surfaces

The portrait runs behind the whole page, so detail panels are glass — semi-
opaque tint + capped blur + hairline edge + one soft top highlight, rather than
`backdrop-filter` everywhere:

| Token | Value | Use |
| --- | --- | --- |
| `--glass-0` | `rgba(13,10,14,.42)` | chips, small fills |
| `--glass-1` | `rgba(14,11,15,.56)` | cards, panels |
| `--glass-2` | `rgba(16,12,17,.68)` | large sheets, sticky bars |
| `--glass-blur` | `14px` | capped blur (never on small repeating elements) |
| `--glass-line` / `--glass-hi` | `rgba(255,255,255,.10)` | hairline edge / inner top highlight |

- A `.scrim` layer sits over the canvas: full strength at the top where the
  headline needs calm, easing to **80% deeper in** via `--scrim-o`, so the
  portrait is at its most present through the middle sections.
- Motion is subtle and physical: sheen travel across card media, a card that
  lifts on hover, reveals that fade/clip in once, and the light pill's orb
  sliding on press — no infinite ambient loops.
- Fallbacks: `@supports not (backdrop-filter)` → near-opaque panels;
  `prefers-reduced-transparency: reduce` → no blur; `prefers-reduced-motion:
  reduce` → no transforms or clip reveals.
- Copy never sits directly on the photograph — every text block is on a panel,
  which is why body copy keeps roughly 9:1 contrast against its backdrop.

## Pages

| File | Contents |
| --- | --- |
| `index.html` | Hero (glass panel over the scrubbing sequence), capability ticker, About, Experience & Education, three-card work preview, Skills, Workflow, Contact, footer. |
| `projects.html` | Projects masthead, filters, timeline navigation, all six case studies with screenshots, six supporting builds, contact CTA, footer. |

Navigation: **Home · About · Projects · Workflow · Contact**.

`index.html` and `projects.html` are the only pages; everything else is
in-page.

---

## File map

```
portfolio/
├── index.html              landing page
├── projects.html           projects page
├── css/
│   ├── base.css            design tokens, glass set, type, buttons, chips
│   ├── layout.css          boot loader, canvas, bloom, scrim, header, sheet, hero, footer
│   ├── blocks.css          about, credentials, work cards, skills, workflow, contact
│   └── projects.css        masthead, filters, timeline, case studies, cast
├── js/
│   ├── data.js             ← ALL copy + image paths live here
│   ├── sequence.js         the Drive motion (loader, canvas, scrub maths)
│   ├── render.js           data → markup
│   └── main.js             boot, HUD, reveals, filters, drawers, rail
├── frames/                 300 sequence frames, 1600×900 (≈13 MB) — the sequence
├── assets/img/
│   ├── projects/           your five screenshots (1500px + 900px variants)
│   ├── avatar-portrait.jpg apple-touch icon + schema.org image
│   ├── og-card.jpg         social sharing card (1200×630)
│   └── favicon.svg         monogram
```

---

## Project imagery

The five screenshots from the shared **images** folder are wired in:

| Case | File |
| --- | --- |
| Iron Tide | `assets/img/projects/iron-tide-*.jpg` |
| Knuckles Roasters | `assets/img/projects/knuckles-roasters-*.jpg` |
| B-Ceylon | `assets/img/projects/b-ceylon-*.jpg` |
| Vet Lanka Animal Hospital | `assets/img/projects/vet-lanka-*.jpg` |
| Wayfarer | `assets/img/projects/wayfarer-*.jpg` |

Each case has a wide (1500px) version for the case study and a card (900px)
version for the preview grid, served with `srcset`/`sizes`.

**RAASTA has no screenshot in the folder**, so it shows a drawn ambulance-corridor
motif with a "Concept visual · no screenshots" label rather than a stand-in
image. Drop a capture into `assets/img/projects/` and add `image: "…"` to that
project in `js/data.js` to replace it.

---

## Editing content

Open `js/data.js`. Everything visible is there: profile, hero copy, at-a-glance
figures, ticker, About, credentials, skills, all six case studies, the six
supporting builds, the workflow, contact channels, footer, and the sequence
config.

- Contact rows live in `contact.channels`. The WhatsApp row never prints the
  number — it shows the word **WhatsApp** and links to
  `links.whatsapp` (`https://wa.me/<number>` click-to-chat, with a prefilled
  greeting). Instagram is the fifth row; all external rows open in a new tab.
- The footer line under the copyright comes from `footer.sub`
  (*"Designed and Built by Niroj Prashath"*).
- Case studies follow their order in the `projects` array; adding one adds it to
  `projects.html`, the timeline and the filters automatically.
- `filters: ["web", "commerce"]` decides which filter buttons include a case.
- The landing preview shows `projects.slice(0, 3)`.

### Swapping the frame sequence

1. Drop `frame_0001.jpg … frame_XXXX.jpg` into `frames/`.
2. Update `NP.sequence.count` (and `nativeWidth`/`nativeHeight` if the raster
   size changes) in `js/data.js`.

If you need the download smaller, re-encode `frames/` at a lower quality or
resolution — the loader only cares about file names and the count. Around 45 KB
per frame is the current setting (quality 72, progressive, 1600×900).

---

## Accessibility

- Skip link, semantic landmarks, one `<h1>` per page, labelled `<nav>`s.
- Visible 2 px focus ring on every interactive element; the closed mobile sheet
  is `visibility: hidden` so it stays out of the tab order.
- The canvas is `aria-hidden` (decorative); screenshots carry real `alt` text.
- Reduced motion and reduced transparency are both honoured.

## Deploying

Copy the folder to any static host.

- **GitHub Pages:** push, then *Settings → Pages → Deploy from branch → / (root)*.
- **Netlify / Vercel:** drag the folder in or connect the repo — no build step.
- **Your server:** upload and point the docroot at the folder.

## Credits

- Sequence: the shared **Cinematic** Drive folder (300 frames), re-encoded for
  the web. The scroll motion is that project's `main.js`.
- Screenshots: the shared **images** Drive folder.
