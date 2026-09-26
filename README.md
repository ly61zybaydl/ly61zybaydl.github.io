# ly61zybaydl.github.io

Personal homepage of **Yi Liu (刘亿)** — https://ly61zybaydl.github.io/

A single hand-written static page (no Jekyll, no build step). GitHub Pages serves the
repository as-is because of the `.nojekyll` file.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | The whole page: hero, About, Research Journey, Publications, Honors & Skills, Contact |
| `assets/home/home.css` | Styles, light/dark themes, responsive layout |
| `assets/home/home.js` | Interactions: theme + language toggles, scroll progress, reveal animations, typewriter, router demo, background network, Chinese text dictionary |
| `assets/files/Yi_Liu_CV.pdf` | CV linked from the nav and the Contact section |
| `images/` | Portrait, paper figures, favicons |

## Editing content

- **English text** lives directly in `index.html`.
- **Chinese text** lives in the `ZH` dictionary at the top of `assets/home/home.js`. Every element
  with a `data-i18n="key"` attribute in `index.html` has a matching `key` in that dictionary.
- To add a publication, copy one `<article class="pub">` block in `index.html`, set its
  `data-tags` (used by the filter buttons: `first`, `llm`, `code`) and add Chinese summary keys if needed.
- To add an experience, copy one `<li class="tl">` block inside the timeline.
- After changing `home.css` or `home.js`, bump the `?v=` query string on their `<link>`/`<script>`
  tags in `index.html` so browsers pick up the new files.

## Features

- Light / dark theme (follows the system, toggle in the nav or press `t`)
- English / 中文 switch (toggle in the nav, press `l`, or open `/?lang=zh`)
- Scroll progress bar, active-section nav, timeline that fills as you scroll
- Reveal-on-scroll animations, count-up stats, publication filters, card tilt
- Typewriter tagline and an illustrative "ActionRAG router" demo in the hero
- Animated background network (disabled when the OS asks for reduced motion)

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000/
```
