/* Yi Liu · homepage analytics (optional, off by default)
   ------------------------------------------------------------------
   Nothing is loaded until you fill in an ID below and set enabled: true.
   While the IDs are empty this file makes no network request at all, so the
   page behaves exactly as before and no third party sees your visitors.

   Which service you need depends on the question:
     "how many people came, and from where?"  -> any of these will do
     "was that a university network?"        -> Statcounter (shows ISP/org)

   Statcounter  free: 5,000 sessions/month, 14-day retention,
                      500-entry per-project visitor log, counter can be invisible
   GoatCounter  free: no IP stored, so city/page/referrer only (privacy-friendliest)
   Clarity      free: session recordings + heatmaps, but country-level location only
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var CONFIG = {
    enabled: false,          // <- flip to true together with a filled-in ID below

    // "statcounter" | "goatcounter" | "clarity"
    provider: 'statcounter',

    statcounter: {
      // statcounter.com -> Add Project -> the snippet shows both of these
      project: '',           // e.g. '12345678'
      security: ''           // e.g. 'a1b2c3d4'
    },
    goatcounter: {
      code: ''               // e.g. 'yiliu'  -> https://yiliu.goatcounter.com
    },
    clarity: {
      project: ''            // e.g. 'abcdefghij'
    },

    // Local preview traffic is never counted, so your own testing stays out of
    // the numbers. Set true only when you want to verify the beacon locally.
    trackLocal: false
  };

  var host = location.hostname;
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1' || location.protocol === 'file:';
  if (!CONFIG.enabled) return;
  if (isLocal && !CONFIG.trackLocal) return;
  if (/[?&]notrack=1\b/.test(location.search)) return;   // ?notrack=1 skips one page load

  var provider = CONFIG.provider;
  var id = provider === 'statcounter' ? CONFIG.statcounter.project
         : provider === 'goatcounter' ? CONFIG.goatcounter.code
         : CONFIG.clarity.project;
  if (!id) {
    if (window.console) console.warn('[analytics] enabled but no ' + provider + ' ID is set — nothing was loaded.');
    return;
  }

  function inject(src) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
    return s;
  }

  if (provider === 'statcounter') {
    var sc = CONFIG.statcounter;
    if (!sc.security) {
      if (window.console) console.warn('[analytics] statcounter needs both project and security.');
      return;
    }
    window.sc_cfg = { id: sc.project, security: sc.security, text: '' };
    var noscript = document.createElement('noscript');
    var img = document.createElement('img');
    img.src = 'https://c.statcounter.com/' + sc.project + '/' + sc.security + '/0/';
    img.alt = 'Web Analytics';
    img.referrerPolicy = 'no-referrer-when-downgrade';
    noscript.appendChild(img);
    document.body.appendChild(noscript);
    inject('https://c.statcounter.com/' + sc.project + '/script.js');

  } else if (provider === 'goatcounter') {
    var g = document.createElement('script');
    g.async = true;
    g.setAttribute('data-goatcounter', 'https://' + CONFIG.goatcounter.code + '.goatcounter.com/count');
    g.src = 'https://gc.zgo.at/count.js';
    document.head.appendChild(g);

  } else if (provider === 'clarity') {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CONFIG.clarity.project);
  }

  /* ---------------- events ----------------
     "Which page did they read" is automatic. These extras answer questions a
     plain pageview cannot, e.g. whether a visitor actually opened the CV. */

  function report(evt, props) {
    props = props || {};
    if (window.clarity) { window.clarity('event', evt); return; }
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: evt, title: props.title || evt, event: true });
      return;
    }
    if (window.sc_project && window._statcounter) {
      // Statcounter's free plan has no custom-event API; the CV link is a PDF,
      // so it still shows up in its automatic Downloads report.
      if (window.console) console.debug('[analytics] event (no-op for statcounter):', evt, props);
    }
  }
  window.__track = report;

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('assets/files/') === 0) report('cv-download', { title: a.textContent.trim() });
  }, true);
})();
