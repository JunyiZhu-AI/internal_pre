# Animation capability test suite

Static test pages to probe which animation technologies a static hosting
platform supports, before building real slide decks on it. Everything is
self-contained: all libraries are vendored into the repo, there is no build
step at deploy time, no server backend, and no CDN dependency.

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
