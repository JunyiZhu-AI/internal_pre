# Presentation workspace

Two things live here, both pure static files (no build step at deploy time,
no server backend, no CDN dependency — all libraries vendored):

1. **`deck/` — the presentation itself** (see below)
2. An animation capability test suite (the original probe of what the
   hosting platform supports)

## The deck

Click-stepped presentation pages, one HTML file per slide, listed in
presentation order in `deck/shared/manifest.js`. Entry point:
**`deck/01-pricing.html`** (or follow the card on `index.html`).

Controls:

| Input | Action |
|---|---|
| click / Space / `→` / PageDown | next motion step (after the last step: next page) |
| `←` / PageUp | back one step (instant) |
| on-screen `❮` `❯` icons | previous / next page |
| ↺ icon | restart current page |
| ⟳ icon | auto-play all steps, looping (rehearsal mode) |
| `F` | fullscreen |

Slide 02 is interactive: after the toolkit reveal, drag technique cards onto
the hardware — correct drops dock a chip, raise the score, and speed up the
decode simulator; wrong drops bounce back. Dragging never advances the slide.

The spoken script lives in **`deck/narrative.md`**, one numbered beat per
click. Slide sources for new pages follow `deck/templates/qkt-matmul.html`
(the engine template — not part of the talk); the engine contract is
documented at the top of `deck/shared/deck.js`.

**To deploy the deck**: copy `deck/`, `vendor/`, and `favicon.ico` keeping
the directory layout (deck pages reference `../vendor/`). All paths are
relative, so any subdirectory works. Nothing else is required; the test
suite below is optional.

## Animation capability test suite

Static test pages that probe which animation technologies the hosting
platform supports — this is how the deck's technology choices were validated.

## What's tested

| Page | Technology | Expected on a static host |
|---|---|---|
| `css-animations.html` | CSS @keyframes, transitions, staggered delays | works |
| `gsap.html` | GSAP 3 (vendored UMD) | works |
| `anime.html` | Anime.js 4 (bundled locally with esbuild) | works |
| `motion-one.html` | Motion / Motion One (vendored UMD, WAAPI) | works |
| `framer-motion.html` | Framer Motion + React 19, pre-built to `dist/framer-demo.js` | works |
| `lottie.html` | lottie-web playing JSON (inline **and** fetched by path) | works |
| `video.html` | `<video>` with static `.webm`/`.mp4` (autoplay-muted + controls) | works |
| `boundaries.html` | Web Workers (file + blob), `fetch()` local/external, EventSource | workers & streaming should FAIL |

Every demo self-reports a **PASS / FAIL badge**, uncaught errors surface in a
red banner, and demos that never report are marked **NO SIGNAL** after 5s —
so on a locked-down host you can tell *what* broke, not just that something did.

## Preview locally

Any static file server works. From the repo root:

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

(Opening `index.html` via `file://` mostly works, but the Lottie path-based
test and the worker-from-file test need HTTP.)

## Deploy

Copy these files/directories to the host — they are the entire site:

```
index.html  css-animations.html  gsap.html  anime.html  motion-one.html
framer-motion.html  lottie.html  video.html  boundaries.html
shared/  vendor/  dist/  assets/
```

Do **not** deploy `node_modules/` or `src/` — they are only needed to rebuild
the bundles. All page links are relative, so the suite works from a
subdirectory too.

## Automated check (optional)

With the local server running, `node scripts/verify.mjs` opens every page in
headless Chrome, prints all badges, and saves per-page screenshots (pass an
output directory as the first argument). Requires `npm install` and Google
Chrome at the default macOS path.

## Rebuilding the bundles (optional)

Only needed if you change `src/framer-demo.jsx` or want newer library versions:

```sh
npm install
npx esbuild src/framer-demo.jsx --bundle --minify --format=iife \
  --define:process.env.NODE_ENV='"production"' --outfile=dist/framer-demo.js
npx esbuild src/anime-entry.js --bundle --minify --format=iife \
  --global-name=anime --outfile=vendor/anime.iife.min.js
```
