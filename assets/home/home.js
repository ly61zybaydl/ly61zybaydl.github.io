/* Yi Liu · homepage interactions
   theme · i18n · scroll (progress / nav / timeline) · reveal + counters ·
   typewriter · router demo · publication filters · card tilt · background network */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  $('#year').textContent = new Date().getFullYear();

  /* ---------------- theme ---------------- */
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function setTheme(next) {
    root.setAttribute('data-theme', next);
    store('theme', next);
    document.dispatchEvent(new CustomEvent('themechange'));
  }
  $('#theme-toggle').addEventListener('click', function () { setTheme(isDark() ? 'light' : 'dark'); });

  /* ---------------- language (EN / 中文) ---------------- */
  var ZH = {
    'nav.about': '关于', 'nav.exp': '经历', 'nav.pub': '论文', 'nav.hon': '荣誉', 'nav.con': '联系', 'nav.cv': '简历',

    'hero.callout': '<strong>2027 年秋将在华中科技大学攻读硕士。</strong>欢迎交流与合作，随时联系我！',
    'hero.tag': '我希望大语言模型能',
    'hero.sub': '华中科技大学人工智能专业本科生，<strong>One Lab</strong>（万瑶教授）成员，目前在<strong>马里兰大学</strong> Furong Huang 教授课题组远程科研实习。',
    'hero.cta1': '看看我的工作', 'hero.cta2': '下载简历',

    'rt.complexity': '复杂度',
    'rt.p1': '直接作答', 'rt.p1m': '不检索',
    'rt.p2': '单跳检索', 'rt.p2m': '查一次',
    'rt.p3': '多跳检索', 'rt.p3m': '串联证据',
    'rt.p4': '长上下文推理', 'rt.p4m': '通读全文',
    'rt.p5': '迭代精炼', 'rt.p5m': '验证并重试',
    'rt.cap': '示意演示 · ActionRAG 按复杂度把每个问题路由到五种策略之一',

    'about.h': '关于我', 'about.loc': '📍 中国 · 武汉',
    'about.lead': '你好！我是刘亿，华中科技大学人工智能专业大四本科生。我关心大语言模型如何<em>高效地推理</em>：只在必要时检索、从自身反馈中改进，并通过工具在真实世界中行动。',
    'about.p2': '我是华中科技大学 <strong>One Lab</strong>（导师：万瑶教授）机器学习 · NLP · 多模态组的高年级成员，也在马里兰大学 <strong>Furong Huang 教授课题组</strong>远程科研实习。2027 年秋，我将进入华中科技大学计算机科学与技术学院，在<a href="https://wanyao.me/">万瑶教授</a>指导下攻读硕士学位。',
    'about.p3': '研究之外，我想成为一个一直在寻找乐趣的人——虽然现在还在路上。',
    'chip.c1': '大语言模型', 'chip.c2': '检索增强生成', 'chip.c3': '推理效率', 'chip.c4': '强化学习',
    'chip.c5': '自我进化', 'chip.c6': '扩散语言模型', 'chip.c7': '智能体与工具使用', 'chip.c8': '多模态',
    'stat.s1': '篇论文 · 含 1 篇在审', 'stat.s2': '篇一作投稿', 'stat.s3': '个研究团队', 'stat.s4': '年华科时光',

    'exp.h': '研究经历',
    'exp.d0': '2027 年秋起', 'exp.g0': '即将开始', 'exp.t0': '计算机科学与技术 · 硕士',
    'exp.o0': '华中科技大学 · 导师：<a href="https://wanyao.me/">万瑶教授</a>',
    'exp.b01': '将进入华中科技大学计算机科学与技术学院，在万瑶教授指导下攻读硕士学位。',
    'exp.d1': '2026 年 7 月 — 至今', 'exp.now': '● 进行中', 'exp.t1': '远程科研实习生',
    'exp.o1': 'Furong\'s Lab · Furong Huang 教授 · 马里兰大学',
    'exp.b11': '在 Furong Huang 教授指导下进行远程科研实习。',
    'exp.d2': '2024 年 5 月 — 至今', 'exp.t2': '高年级成员 · 机器学习 / NLP / 多模态组',
    'exp.o2': 'One Lab · 万瑶教授 · 华中科技大学',
    'exp.b21': '在组内作 LLM 自我评估方法与扩散语言模型最新进展的技术报告。',
    'exp.b22': '主导 <strong>ActionRAG</strong>：面向检索增强生成的任务感知路由框架（一作，AAAI 2027 在审）。',
    'exp.b23': '参与 <strong>LaTCoder</strong>：以 Layout-as-Thought 将网页设计稿转换为代码（KDD 2025）。',
    'exp.d3': '2024 年 7 月 — 9 月', 'exp.t3': '远程实习生',
    'exp.o3': 'LAIR Lab · Lichao Sun 教授 · 理海大学',
    'exp.b31': '在组会上分享并讨论论文。',
    'exp.d4': '2023 年 9 月 — 2027 年 6 月（预计）', 'exp.g4': '教育经历', 'exp.t4': '人工智能 · 本科',
    'exp.o4': '华中科技大学 · 中国武汉',

    'pub.h': '论文与项目', 'pub.fa': '全部', 'pub.ff': '一作', 'pub.fl': 'LLM 与 RAG', 'pub.fc': '代码生成', 'pub.fo': '开源',
    'pub.v3': '开源项目',
    'pub.s3': '面向 QA / 测试人员的工具：把结构化的 Word 需求文档自动转换为 XMind 测试用例思维导图。默认通过 <strong>Ollama</strong> 运行本地模型，实现 100% 本地化、保护隐私的工作流，也可选用 OrcaRouter 托管模型。已受 OrcaRouter 网关邀请收录，并受邀在 Human-Agent Society 的 <strong>Reef</strong> 上发布与迭代测试。',
    'pub.role3': '作者与维护者',
    'pub.v1': 'AAAI 2027 · 在审',
    'pub.s1': '<strong>ActionRAG</strong> 用一个路由器根据问题复杂度，在五种 RAG 执行策略中自适应选择：减少简单问题上的无谓检索开销，同时为复杂的长上下文推理保留更强的知识增强能力。',
    'pub.role1': '第一作者', 'pub.soon': '预印本即将发布',
    'pub.s2': '基于大型多模态模型设计自动布局分割方案，搭建 Layout-to-Code 基线与评测流程，并通过上下文学习与思维链优化提示策略，使生成的 HTML/CSS 更鲁棒、结构更一致。',
    'pub.role2': '合作作者',

    'hon.h': '荣誉与技能', 'hon.t1': '自强奋进奖学金', 'hon.o1': '华中科技大学',
    'sk.h1': '编程语言', 'sk.h2': '工具与框架', 'sk.h3': '研究兴趣',
    'sk.i1': '大语言模型', 'sk.i2': '强化学习', 'sk.i3': '推理效率', 'sk.i4': '自我进化', 'sk.i5': '扩散语言模型', 'sk.i6': '智能体工具控制',

    'con.e': '<span class="dot"></span> 欢迎合作 · 2027 年秋起在华科攻读硕士',
    'con.t': '让大模型想得<br><span class="grad">更聪明，而不只是更久。</span>',
    'foot.hint': '小提示：按 <kbd>t</kbd> 切换深浅色，<kbd>l</kbd> 切换 English，<kbd>m</kbd> 播放音乐',
    'foot.music': '♪ 背景音乐：右上角胶囊可播放/暂停，点它的小箭头打开歌单',
    'pl.h': '歌单', 'pl.sub': '点一首切换 · 列表循环播放'
  };

  var lang = root.getAttribute('lang') === 'zh-CN' ? 'zh' : 'en';
  function isZh() { return lang === 'zh'; }

  function applyLang() {
    $$('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML);
      var zh = ZH[key];
      el.innerHTML = isZh() && zh ? zh : el.getAttribute('data-en');
    });
    root.setAttribute('lang', isZh() ? 'zh-CN' : 'en');
    document.title = isZh() ? '刘亿 · Yi Liu' : 'Yi Liu · 刘亿';
    var btn = $('#lang-toggle');
    btn.textContent = isZh() ? 'EN' : '中';
    btn.setAttribute('aria-label', isZh() ? 'Switch to English / 切换到英文' : '切换到中文 / Switch language');
    document.dispatchEvent(new CustomEvent('langchange'));
  }
  function toggleLang() {
    lang = isZh() ? 'en' : 'zh';
    store('lang', lang);
    applyLang();
  }
  $('#lang-toggle').addEventListener('click', toggleLang);
  if (isZh()) applyLang();

  /* keyboard shortcuts: t = theme, l = language */
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable)) return;
    if (e.key === 't' || e.key === 'T') setTheme(isDark() ? 'light' : 'dark');
    if (e.key === 'l' || e.key === 'L') toggleLang();
    if (e.key === 'm' || e.key === 'M') { var b = $('#bgm'); if (b) b.click(); }
  });

  /* ---------------- background music: playlist drawer (top left) + status pill (top right) ---------------- */
  (function () {
    var btn = $('#bgm'), drawer = $('#playlist-drawer'), openBtn = $('#playlist-open');
    if (!btn || !drawer || !openBtn) return;
    var group = $('#bgm-group') || openBtn;
    var stateEl = $('.bgm__state', btn), titleEl = $('.bgm__title', btn);
    var rows = $$('#playlist .track');
    var tracks = rows.map(function (li) {
      return { src: li.getAttribute('data-src'), title: $('.track__title', li).textContent, artist: $('.track__artist', li).textContent, el: li };
    });
    if (!tracks.length) return;
    var audio = null, wantOn = false, fading = 0, status = 'idle', cur = 0, loaded = -1;
    try { var saved = parseInt(localStorage.getItem('bgmTrack'), 10); if (saved >= 0 && saved < tracks.length) cur = saved; } catch (e) {}

    var T = {
      en: { idle: 'tap to play', loading: 'loading…', playing: 'now playing', paused: 'paused', error: 'unavailable' },
      zh: { idle: '点击播放', loading: '加载中…', playing: '正在播放', paused: '已暂停', error: '暂不可用' }
    };
    var playBtn = $('#pl-play'), prevBtn = $('#pl-prev'), nextBtn = $('#pl-next'), closeBtn = $('#pl-close');

    function render() {
      var t = tracks[cur], playing = status === 'playing';
      titleEl.textContent = t.title + ' · ' + t.artist;
      stateEl.textContent = T[isZh() ? 'zh' : 'en'][status];
      btn.classList.toggle('is-playing', playing);
      btn.classList.toggle('is-loading', status === 'loading');
      btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      btn.setAttribute('aria-label', (playing ? 'Pause' : 'Play') + ' background music');
      openBtn.classList.toggle('is-playing', playing);
      if (playBtn) playBtn.classList.toggle('is-playing', playing);
      rows.forEach(function (li, i) {
        li.classList.toggle('is-current', i === cur);
        li.classList.toggle('is-playing', i === cur && playing);
      });
    }
    function fadeTo(target, done) {
      cancelAnimationFrame(fading);
      var from = audio.volume, start = performance.now(), dur = 1200;
      (function step(now) {
        var t = clamp((now - start) / dur, 0, 1);
        try { audio.volume = from + (target - from) * t; } catch (e) { t = 1; }
        if (t < 1) fading = requestAnimationFrame(step);
        else if (done) done();
      })(start);
    }
    function ensure() {
      if (audio) return audio;
      audio = new Audio();
      audio.preload = 'auto';
      audio.addEventListener('playing', function () { if (wantOn) { status = 'playing'; render(); fadeTo(0.45); } });
      audio.addEventListener('waiting', function () { if (wantOn) { status = 'loading'; render(); } });
      audio.addEventListener('error', function () { status = 'error'; wantOn = false; render(); });
      audio.addEventListener('ended', function () { if (wantOn) jump(cur + 1); });
      return audio;
    }
    function load(i) {
      var a = ensure();
      if (loaded !== i) {
        loaded = i; cur = i;
        a.src = tracks[i].src;
        try { a.volume = 0; } catch (e) {}
        store('bgmTrack', String(i));
      }
      return a;
    }
    /* Each play() request gets a number so a rejection from an interrupted, older request (e.g. the
       visitor pressed "next" before the previous track had started) cannot clobber the new state. */
    var gen = 0;
    function play() {
      wantOn = true; store('bgm', 'on');
      var a = load(cur);
      cancelAnimationFrame(fading);
      if (!a.paused) { status = 'playing'; render(); fadeTo(0.45); return; }
      status = 'loading'; render();
      var my = ++gen;
      var p = a.play();
      if (p && p.catch) p.catch(function () { if (my === gen && wantOn) { wantOn = false; status = 'paused'; render(); } });
    }
    function pause() {
      wantOn = false; store('bgm', 'off');
      status = 'paused'; render();
      if (!audio) return;
      if (audio.paused || audio.volume === 0) { audio.pause(); return; }
      fadeTo(0, function () { audio.pause(); });
    }
    /* switch to track i (wrapping) and play it */
    function jump(i) {
      i = (i + tracks.length) % tracks.length;
      if (audio) { cancelAnimationFrame(fading); audio.pause(); }
      cur = i; loaded = -1;
      play();
    }
    /* row click: toggle the track that is already loaded, otherwise switch to it */
    function select(i) {
      if (audio && loaded === i) { wantOn ? pause() : play(); } else jump(i);
    }

    btn.addEventListener('click', function () { wantOn ? pause() : play(); });
    rows.forEach(function (li, i) { $('.track__btn', li).addEventListener('click', function () { select(i); }); });
    if (playBtn) playBtn.addEventListener('click', function () { wantOn ? pause() : play(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { jump(cur - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { jump(cur + 1); });
    document.addEventListener('langchange', render);

    /* ---- playlist drawer ---- */
    function openDrawer() {
      drawer.hidden = false;
      void drawer.offsetWidth; /* let the browser see the un-hidden state before the transition starts */
      drawer.classList.add('is-open');
      openBtn.setAttribute('aria-expanded', 'true');
    }
    function closeDrawer() {
      drawer.classList.remove('is-open');
      openBtn.setAttribute('aria-expanded', 'false');
      setTimeout(function () { if (!drawer.classList.contains('is-open')) drawer.hidden = true; }, 300);
    }
    openBtn.addEventListener('click', function () { drawer.hidden ? openDrawer() : closeDrawer(); });
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    document.addEventListener('pointerdown', function (e) {
      if (!drawer.hidden && !drawer.contains(e.target) && !group.contains(e.target)) closeDrawer();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); });

    /* Start on the visitor's first gesture anywhere on the page (used when autoplay was blocked). */
    function armKick() {
      var off = function () { window.removeEventListener('pointerdown', kick); window.removeEventListener('keydown', kick); };
      var kick = function (e) {
        off();
        if (!group.contains(e.target) && !drawer.contains(e.target) && !wantOn) play();
      };
      window.addEventListener('pointerdown', kick);
      window.addEventListener('keydown', kick);
    }
    /* Visitors who chose music before: try to resume at once (allowed once the browser trusts the site),
       otherwise the first gesture on the page starts it. */
    var pref = null;
    try { pref = localStorage.getItem('bgm'); } catch (e) {}
    if (pref === 'on') {
      wantOn = true;
      var a0 = load(cur), my0 = ++gen;
      var p0 = a0.play();
      if (p0 && p0.then) p0.catch(function () { if (my0 !== gen) return; wantOn = false; status = 'idle'; render(); armKick(); });
    }
    render();
  })();

  /* ---------------- scroll: progress, nav state, timeline fill ---------------- */
  var nav = $('#nav');
  var bar = $('#progress-bar');
  var fill = $('#timeline-fill');
  var timeline = $('#timeline');
  var navLinks = $$('.nav__links a');
  var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); });
  var navH = nav.offsetHeight;
  var ticking = false;

  function onScroll() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? clamp(y / max, 0, 1) * 100 : 0) + '%';
    nav.classList.toggle('is-scrolled', y > 8);

    if (timeline && fill) {
      var r = timeline.getBoundingClientRect();
      var p = clamp((window.innerHeight * 0.62 - r.top) / r.height, 0, 1);
      fill.style.height = Math.max(0, p * (r.height - 16)) + 'px';
    }

    var current = -1;
    sections.forEach(function (s, i) {
      if (s && s.getBoundingClientRect().top <= navH + 120) current = i;
    });
    if (max > 0 && y >= max - 4) current = sections.length - 1;
    navLinks.forEach(function (a, i) { a.classList.toggle('is-active', i === current); });
  }
  function requestScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);
  onScroll();

  /* ---------------- reveal + counters ---------------- */
  function countUp(el) {
    var target = +el.getAttribute('data-count');
    if (reduceMotion || !target) { el.textContent = target; return; }
    var start = performance.now(), dur = 1100;
    (function frame(now) {
      var t = clamp((now - start) / dur, 0, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  }
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var siblings = $$('.reveal', el.parentNode);
        var delay = (Math.max(0, siblings.indexOf(el)) % 4) * 90;
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('is-in');
        $$('[data-count]', el).forEach(countUp);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    $$('[data-count]').forEach(countUp);
  }

  /* ---------------- hero typewriter ---------------- */
  (function () {
    var el = $('#typer');
    if (!el) return;
    var wordsEn = JSON.parse(el.getAttribute('data-words'));
    var wordsZh = JSON.parse(el.getAttribute('data-words-zh'));
    function words() { return isZh() ? wordsZh : wordsEn; }
    if (reduceMotion) { el.textContent = words()[0]; document.addEventListener('langchange', function () { el.textContent = words()[0]; }); return; }
    var i = 0;
    (async function loop() {
      el.textContent = '';
      await sleep(600);
      while (true) {
        var list = words();
        var w = list[i % list.length];
        var perChar = isZh() ? 110 : 45;
        for (var k = 1; k <= w.length; k++) { el.textContent = w.slice(0, k); await sleep(perChar); }
        await sleep(2000);
        while (el.textContent.length) { el.textContent = el.textContent.slice(0, -1); await sleep(isZh() ? 45 : 22); }
        await sleep(300);
        i++;
      }
    })();
  })();

  /* ---------------- router demo (illustrative ActionRAG loop) ---------------- */
  (function () {
    var box = $('#router');
    if (!box) return;
    var qEl = $('#rt-query'), meter = $('#rt-meter'), score = $('#rt-score'), log = $('#rt-log');
    var paths = $$('#rt-paths li');

    var EXAMPLES = [
      { en: 'What is the capital of France?', zh: '法国的首都是哪里？', score: 0.12, path: 'direct',
        log: { en: ['→ route: direct answer', '✓ answered from parametric memory · 0 retrievals'],
               zh: ['→ 路由：直接作答', '✓ 由模型自身知识作答 · 0 次检索'] } },
      { en: 'Who won the 2025 Nobel Prize in Physics?', zh: '2025 年诺贝尔物理学奖得主是谁？', score: 0.46, path: 'single',
        log: { en: ['→ route: single-hop retrieval', '✓ 1 lookup · answer grounded in fresh facts'],
               zh: ['→ 路由：单跳检索', '✓ 检索 1 次 · 用最新事实作答'] } },
      { en: 'Compare how BERT and GPT are pre-trained, citing the original papers.', zh: '对比 BERT 与 GPT 的预训练方式，并引用原始论文。', score: 0.78, path: 'multi',
        log: { en: ['→ route: multi-hop retrieval', '✓ 3 lookups chained · evidence merged'],
               zh: ['→ 路由：多跳检索', '✓ 串联 3 次检索 · 合并证据'] } },
      { en: 'Summarize the methodology across this 80-page technical report.', zh: '总结这份 80 页技术报告中的方法部分。', score: 0.90, path: 'long',
        log: { en: ['→ route: long-context reasoning', '✓ 128k context read in full · 0 retrievals'],
               zh: ['→ 路由：长上下文推理', '✓ 通读 128k 上下文 · 0 次检索'] } },
      { en: 'Plan a three-step fix for a flaky CI pipeline and verify each step.', zh: '为不稳定的 CI 流水线制定三步修复方案，并逐步验证。', score: 0.84, path: 'iter',
        log: { en: ['→ route: iterative refinement', '✓ 2 rounds · self-verified before answering'],
               zh: ['→ 路由：迭代精炼', '✓ 2 轮迭代 · 回答前自我验证'] } }
    ];

    function reset() {
      qEl.textContent = '';
      meter.style.width = '0%';
      score.textContent = '0.00';
      log.innerHTML = '';
      paths.forEach(function (p) { p.classList.remove('is-on', 'is-dim'); });
    }
    function line(cls, text) {
      var d = document.createElement('div');
      if (cls) d.className = cls;
      d.textContent = text;
      log.appendChild(d);
    }
    function choose(name) {
      paths.forEach(function (p) {
        var on = p.getAttribute('data-path') === name;
        p.classList.toggle('is-on', on);
        p.classList.toggle('is-dim', !on);
      });
    }
    function tickScore(target, dur) {
      var start = performance.now();
      (function frame(now) {
        var t = clamp((now - start) / dur, 0, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        score.textContent = (target * eased).toFixed(2);
        if (t < 1) requestAnimationFrame(frame);
      })(start);
    }
    function show(ex) {
      reset();
      qEl.textContent = isZh() ? ex.zh : ex.en;
      meter.style.width = (ex.score * 100) + '%';
      score.textContent = ex.score.toFixed(2);
      choose(ex.path);
      var L = isZh() ? ex.log.zh : ex.log.en;
      line('hi', L[0]); line('ok', L[1]);
    }

    if (reduceMotion) {
      show(EXAMPLES[1]);
      document.addEventListener('langchange', function () { show(EXAMPLES[1]); });
      return;
    }

    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }, { threshold: 0.15 }).observe(box);
    }
    function active() { return visible && document.visibilityState === 'visible'; }
    async function waitActive() { while (!active()) await sleep(400); }

    (async function loop() {
      var i = 0;
      await sleep(900);
      while (true) {
        await waitActive();
        var ex = EXAMPLES[i % EXAMPLES.length];
        var text = isZh() ? ex.zh : ex.en;
        var L = isZh() ? ex.log.zh : ex.log.en;
        reset();
        var per = clamp(Math.round(1100 / text.length), 24, 90);
        for (var k = 1; k <= text.length; k++) { qEl.textContent = text.slice(0, k); await sleep(per); }
        await sleep(350);
        meter.style.width = (ex.score * 100) + '%';
        tickScore(ex.score, 850);
        await sleep(950);
        choose(ex.path);
        await sleep(450);
        line('hi', L[0]);
        await sleep(650);
        line('ok', L[1]);
        await sleep(3000);
        i++;
      }
    })();
  })();

  /* ---------------- publication filters ---------------- */
  var pubs = $$('.pub');
  $$('.filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.filter').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      var f = btn.getAttribute('data-filter');
      pubs.forEach(function (p) {
        var show = f === 'all' || p.getAttribute('data-tags').split(' ').indexOf(f) >= 0;
        p.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------------- card tilt ---------------- */
  if (finePointer && !reduceMotion) {
    pubs.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg) translateY(-2px)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------------- background: fireflies (default) · flow field · network · aurora ----------------
     Pick with <body data-bg="fireflies|flow|net|aurora|none">, or preview with ?bg=... in the URL. */
  (function () {
    var canvas = $('#bg'), aurora = $('#aurora');
    var param = '';
    try { param = new URLSearchParams(location.search).get('bg') || ''; } catch (e) {}
    var mode = (param || document.body.getAttribute('data-bg') || 'fireflies').toLowerCase();
    if (!canvas || !aurora) return;

    if (mode === 'none') { canvas.hidden = true; aurora.hidden = true; return; }

    if (mode === 'aurora') {
      canvas.hidden = true; aurora.hidden = false;
      if (!reduceMotion && finePointer) {
        window.addEventListener('pointermove', function (e) {
          var x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
          aurora.style.setProperty('--px', (x * 36).toFixed(1) + 'px');
          aurora.style.setProperty('--py', (y * 36).toFixed(1) + 'px');
        }, { passive: true });
      }
      return;
    }

    aurora.hidden = true;
    if (reduceMotion) { canvas.hidden = true; return; }

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = 0, H = 0, mouse = { x: -1e4, y: -1e4 }, running = true, raf = 0, last = 0, cols = ['37, 99, 235'];

    function recolor() {
      var cs = getComputedStyle(root);
      var c = ['--net', '--net-2', '--net-3'].map(function (v) { return cs.getPropertyValue(v).trim(); }).filter(Boolean);
      if (c.length) cols = c;
      if (impl && impl.recolor) impl.recolor();
    }

    /* --- fireflies: soft glowing dots that wander, breathe and scatter from the cursor --- */
    function fireflies() {
      var P = [], sprites = [];
      function sprite(rgb) {
        var c = document.createElement('canvas'); c.width = c.height = 64;
        var g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, 'rgba(' + rgb + ',0.95)');
        gr.addColorStop(0.18, 'rgba(' + rgb + ',0.45)');
        gr.addColorStop(0.5, 'rgba(' + rgb + ',0.12)');
        gr.addColorStop(1, 'rgba(' + rgb + ',0)');
        g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
        return c;
      }
      function palette() { sprites = cols.concat(['245, 158, 11']).map(sprite); }
      function spawn(p) {
        p.x = Math.random() * W; p.y = Math.random() * H;
        p.z = 0.35 + Math.random() * 0.65;                 /* depth: size, speed, brightness */
        p.r = 1.6 + Math.random() * 2.6;
        p.a = Math.random() * Math.PI * 2; p.va = 0;       /* wandering heading */
        p.ph = Math.random() * Math.PI * 2; p.pr = 0.0009 + Math.random() * 0.0016; /* breathing */
        p.c = (Math.random() * sprites.length) | 0;
        p.sp = 0.12 + Math.random() * 0.3;
        return p;
      }
      return {
        resize: function () {
          palette();
          var n = Math.round(clamp(W * H / 10500, 48, 140));
          P = [];
          for (var i = 0; i < n; i++) P.push(spawn({}));
        },
        recolor: palette,
        frame: function (k, now) {
          ctx.clearRect(0, 0, W, H);
          var dim = isDark() ? 1 : 0.85;
          for (var i = 0; i < P.length; i++) {
            var p = P[i];
            p.va += (Math.random() - 0.5) * 0.06 * k; p.va *= 0.95; p.a += p.va * k;
            var vx = Math.cos(p.a) * p.sp * p.z * k, vy = Math.sin(p.a) * p.sp * p.z * k - 0.04 * p.z * k;
            var dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
            if (d < 150 && d > 0.5) { var f = (1 - d / 150) * 1.1 * k; vx += dx / d * f; vy += dy / d * f; }
            p.x += vx; p.y += vy;
            if (p.x < -24) p.x = W + 24; else if (p.x > W + 24) p.x = -24;
            if (p.y < -24) p.y = H + 24; else if (p.y > H + 24) p.y = -24;
            var pulse = 0.5 + 0.5 * Math.sin(now * p.pr + p.ph);
            pulse = 0.12 + 0.88 * pulse * pulse;
            var s = p.r * 14 * p.z;
            ctx.globalAlpha = pulse * (0.5 + 0.5 * p.z) * dim;
            ctx.drawImage(sprites[p.c % sprites.length], p.x - s / 2, p.y - s / 2, s, s);
          }
          ctx.globalAlpha = 1;
        }
      };
    }

    /* --- flow field: particles drift along a slowly changing noise field and leave fading trails --- */
    function flow() {
      var P = [], perm = new Uint8Array(512), i, j, t;
      for (i = 0; i < 256; i++) perm[i] = i;
      for (i = 255; i > 0; i--) { j = (Math.random() * (i + 1)) | 0; t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
      for (i = 0; i < 256; i++) perm[i + 256] = perm[i];
      var seed = Math.random() * 512;
      function fade(x) { return x * x * (3 - 2 * x); }
      function lerp(a, b, x) { return a + (b - a) * x; }
      function hash(x, y, z) { return perm[(perm[(perm[x & 255] + y) & 255] + z) & 255] / 255; }
      function noise(x, y, z) {
        var xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
        var u = fade(x - xi), v = fade(y - yi), w = fade(z - zi);
        var a = lerp(lerp(hash(xi, yi, zi), hash(xi + 1, yi, zi), u), lerp(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), u), v);
        var b = lerp(lerp(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), u), lerp(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), u), v);
        return lerp(a, b, w);
      }
      function spawn(p) {
        p.x = Math.random() * W; p.y = Math.random() * H;
        p.life = 90 + Math.random() * 220;
        p.c = (Math.random() * cols.length) | 0;
        p.w = 0.7 + Math.random() * 1.1;
        p.sp = 0.55 + Math.random() * 0.85;
        return p;
      }
      return {
        resize: function () {
          var n = Math.round(clamp(W * H / 6500, 120, 420));
          P = [];
          for (var k = 0; k < n; k++) { var p = spawn({}); p.life *= Math.random(); P.push(p); }
          ctx.clearRect(0, 0, W, H);
        },
        frame: function (k, now) {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = 'rgba(0,0,0,0.035)';
          ctx.fillRect(0, 0, W, H);
          ctx.globalCompositeOperation = 'source-over';
          ctx.lineCap = 'round';
          var s = 0.0017, z = now * 0.00007 + seed;
          for (var i = 0; i < P.length; i++) {
            var p = P[i];
            var a = noise(p.x * s, p.y * s, z) * Math.PI * 4;
            var vx = Math.cos(a) * p.sp * k, vy = Math.sin(a) * p.sp * k;
            var dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
            if (d < 180 && d > 1) { vx += dx / d * 0.16 * k; vy += dy / d * 0.16 * k; }
            var px = p.x, py = p.y;
            p.x += vx; p.y += vy; p.life -= k;
            if (p.life <= 0 || p.x < -4 || p.x > W + 4 || p.y < -4 || p.y > H + 4) { spawn(p); continue; }
            ctx.strokeStyle = 'rgba(' + cols[p.c % cols.length] + ',0.26)';
            ctx.lineWidth = p.w;
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p.x, p.y); ctx.stroke();
          }
        }
      };
    }

    /* --- network: drifting nodes linked by distance, reacting to the cursor --- */
    function net() {
      var nodes = [];
      return {
        resize: function () {
          var n = Math.round(clamp(W * H / 22000, 28, 72));
          nodes = [];
          for (var i = 0; i < n; i++) {
            nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: 1.2 + Math.random() * 1.6 });
          }
        },
        frame: function (k) {
          var rgb = cols[0];
          for (var i = 0; i < nodes.length; i++) {
            var p = nodes[i];
            var dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
            if (d < 220 && d > 0.001) { p.vx += dx / d * 0.012 * k; p.vy += dy / d * 0.012 * k; }
            p.vx = clamp(p.vx * 0.995, -0.7, 0.7); p.vy = clamp(p.vy * 0.995, -0.7, 0.7);
            p.x += p.vx * k; p.y += p.vy * k;
            if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
            if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
          }
          ctx.clearRect(0, 0, W, H);
          var link = Math.min(160, W / 7);
          ctx.lineWidth = 1;
          for (i = 0; i < nodes.length; i++) {
            var a = nodes[i];
            for (var j = i + 1; j < nodes.length; j++) {
              var b = nodes[j], ex = a.x - b.x, ey = a.y - b.y, dd = Math.sqrt(ex * ex + ey * ey);
              if (dd < link) {
                ctx.strokeStyle = 'rgba(' + rgb + ',' + ((1 - dd / link) * 0.32).toFixed(3) + ')';
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
              }
            }
            var md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
            if (md < link * 1.3) {
              ctx.strokeStyle = 'rgba(' + rgb + ',' + ((1 - md / (link * 1.3)) * 0.5).toFixed(3) + ')';
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
            }
          }
          ctx.fillStyle = 'rgba(' + rgb + ',0.55)';
          for (i = 0; i < nodes.length; i++) { ctx.beginPath(); ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2); ctx.fill(); }
        }
      };
    }

    var impl = mode === 'net' ? net() : mode === 'flow' ? flow() : fireflies();

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      impl.resize();
    }
    function tick(now) {
      if (!running) return;
      var k = last ? clamp((now - last) / 16.67, 0.25, 2.5) : 1;
      last = now;
      impl.frame(k, now);
      raf = requestAnimationFrame(tick);
    }
    function start() { if (!running) { running = true; last = 0; raf = requestAnimationFrame(tick); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    var resizeTimer;
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
    window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('pointerleave', function () { mouse.x = -1e4; mouse.y = -1e4; });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    document.addEventListener('themechange', recolor);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', recolor);

    recolor(); resize(); raf = requestAnimationFrame(tick);
  })();
})();
