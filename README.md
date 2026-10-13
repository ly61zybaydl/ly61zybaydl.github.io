# ly61zybaydl.github.io

Personal homepage of **Yi Liu (刘亿)** — https://ly61zybaydl.github.io/

A single hand-written static page (no Jekyll, no build step). GitHub Pages serves the
repository as-is because of the `.nojekyll` file.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | The whole page: hero, About, Research Journey, Publications & Projects, Honors & Skills, Contact |
| `assets/home/home.css` | Styles, light/dark themes, responsive layout |
| `assets/home/home.js` | Interactions: theme + language toggles, scroll progress, reveal animations, typewriter, router demo, background music, background network, Chinese text dictionary |
| `assets/audio/*.mp3` | Background music tracks listed in the playlist drawer (《去年夏天》夏雨菲, 《寂寞烟火》蓝心羽, Ferrari · Bebe Rexha) |
| `assets/files/Yi_Liu_CV.pdf` | CV linked from the nav and the Contact section |
| `images/` | Portrait, paper figures, favicons |

## Editing content

- **English text** lives directly in `index.html`.
- **Chinese text** lives in the `ZH` dictionary at the top of `assets/home/home.js`. Every element
  with a `data-i18n="key"` attribute in `index.html` has a matching `key` in that dictionary.
- To add a publication or project, copy one `<article class="pub">` block in `index.html`, set its
  `data-tags` (used by the filter buttons: `first`, `llm`, `code`, `oss`) and add Chinese summary keys if needed.
- To add an experience, copy one `<li class="tl">` block inside the timeline.
- **Hobbies** live in the `#hobbies` section. The cartoon card shows a feature image on the left and a
  scrollable sticker wall on the right (3 per row, two rows visible): to add a sticker, drop the file into
  `images/hobbies/cartoon/` and add one `<li><img …></li>` inside `<ul class="stickers">`, then update the
  count text (`hob.c1m` in `index.html` and the `ZH` dictionary). The game card shows the app icon on the
  left and a screenshot carousel on the right: add a screenshot as one more `<li>` in
  `<ul class="carousel__track">` plus one `<button class="carousel__dot">`.
- To add a **background music** track, drop the file into `assets/audio/` and copy one
  `<li class="track">` row inside the playlist drawer in `index.html` (set `data-src`, the title, the
  artist and the duration text). The order of the rows is the play order; the list loops.
- To change the **animated background**, edit `data-bg` on the `<body>` tag: `fireflies` (glowing
  dots that wander and breathe, the default), `flow` (particles drifting along a noise field), `net`
  (nodes linked by lines), `aurora` (soft drifting colour fields) or `none`. Append `?bg=flow`,
  `?bg=net` or `?bg=aurora` to the URL to preview one without editing.
- After changing `home.css` or `home.js`, bump the `?v=` query string on their `<link>`/`<script>`
  tags in `index.html` so browsers pick up the new files.

## Features

- Light / dark theme (follows the system, toggle in the nav or press `t`)
- English / 中文 switch (toggle in the nav, press `l`, or open `/?lang=zh`)
- Background music: one pill at the top right. Its main part plays / pauses (or press `m`); the arrow
  at its end opens the playlist drawer (pick a song, previous / next, loops through the list). Playback
  starts only after a click because browsers block autoplay; visitors who turned it on before get it
  back on their next click anywhere on the page.
- Scroll progress bar, active-section nav, timeline that fills as you scroll
- Reveal-on-scroll animations, count-up stats, publication filters, card tilt
- Typewriter tagline and an illustrative "ActionRAG router" demo in the hero
- Animated background with four styles: fireflies (default), flow field, network, aurora (disabled when the OS asks for reduced motion)

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000/
```
