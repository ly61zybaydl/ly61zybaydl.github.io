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

## Visitor analytics (off by default)

`assets/home/analytics.js` is wired into the page but **disabled**: with the IDs empty it
returns immediately and loads no third-party code, so nothing about your visitors leaves
the page. Fill in an ID to turn it on.

GitHub Pages is plain static hosting, so it keeps no access log and the repository's own
Traffic tab counts repository page views only (never the deployed site). Visit data comes
from a third-party service, which means registering an account and pasting two values.

| Question | Service | What you get |
| --- | --- | --- |
| "who was that, which network?" | **Statcounter** (recommended) | per-visit log: time, city/country, ISP or organization (e.g. a university), IP, referrer, visit length |
| "how many, from where?" | GoatCounter | pageviews by page, referrer, country; no IP stored |
| "what did they actually do?" | Microsoft Clarity | session replays and heatmaps; country-level location only |

**Statcounter setup** — the free plan covers 5,000 sessions/month with 14-day retention and a
500-entry visitor log, and the counter can be invisible:

1. Register at <https://statcounter.com/> and add a project for `ly61zybaydl.github.io`.
2. The install page shows a snippet with two values, e.g. `var sc_project=12345678;` and
   `var sc_security="a1b2c3d4";`.
3. Paste them into `assets/home/analytics.js` under `statcounter`, set `enabled: true`, and
   bump the `?v=` on the `analytics.js` script tag in `index.html`.
4. Open the site from your phone on mobile data, then check *Recent Visitor Activity* — if
   your own visit appears, the beacon works.

**Keeping your own visits out** — local preview is ignored automatically (`trackLocal: false`).
To exclude a deployed visit, add `?notrack=1` to the URL, or install the service's blocking
cookie (Statcounter offers one; it is the reliable way to keep your own browsing out of the
numbers on any device you use).

**What this cannot do**: it never reveals a name. A visitor's identity is not available to any
of these services, and a page cannot read it. The closest signal is the network a visit came
from, which is often enough on an academic page (a university network is visible as such).
Visits made through a VPN or a mobile carrier show the VPN or carrier instead.

Personal data note: Statcounter logs IP addresses, so visitors in the EU/UK may be covered by
GDPR. If that matters to you, add one line to the footer saying the site uses Statcounter —
`data-i18n` for the Chinese version lives in the `ZH` dictionary in `home.js`.

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000/
```
