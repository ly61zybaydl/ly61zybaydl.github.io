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

    'pub.h': '论文', 'pub.fa': '全部', 'pub.ff': '一作', 'pub.fl': 'LLM 与 RAG', 'pub.fc': '代码生成',
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
    'foot.hint': '小提示：按 <kbd>t</kbd> 切换深浅色，<kbd>l</kbd> 切换 English'
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
  });

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

  /* ---------------- background network ---------------- */
  (function () {
    var canvas = $('#net');
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, nodes = [], mouse = { x: -1e4, y: -1e4 }, rgb = '37, 99, 235', running = true, raf = 0;

    function recolor() {
      var v = getComputedStyle(root).getPropertyValue('--net').trim();
      if (v) rgb = v;
    }
    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(clamp(W * H / 22000, 28, 72));
      nodes = [];
      for (var i = 0; i < n; i++) {
        nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: 1.2 + Math.random() * 1.6 });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var link = Math.min(160, W / 7);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < link) {
            ctx.strokeStyle = 'rgba(' + rgb + ',' + ((1 - d / link) * 0.32).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        var md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < link * 1.3) {
          ctx.strokeStyle = 'rgba(' + rgb + ',' + ((1 - md / (link * 1.3)) * 0.5).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var p = nodes[k];
        ctx.fillStyle = 'rgba(' + rgb + ',0.55)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    function tick() {
      if (!running) return;
      for (var i = 0; i < nodes.length; i++) {
        var p = nodes[i];
        var dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 220 && d > 0.001) { p.vx += dx / d * 0.012; p.vy += dy / d * 0.012; }
        p.vx = clamp(p.vx * 0.995, -0.7, 0.7); p.vy = clamp(p.vy * 0.995, -0.7, 0.7);
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
      }
      draw();
      raf = requestAnimationFrame(tick);
    }
    function start() { if (!running) { running = true; tick(); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    var resizeTimer;
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
    window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('pointerleave', function () { mouse.x = -1e4; mouse.y = -1e4; });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    document.addEventListener('themechange', recolor);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', recolor);

    recolor(); resize(); tick();
  })();
})();
