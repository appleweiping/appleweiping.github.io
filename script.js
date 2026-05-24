/**
 * script.js — Weiping Yan academic site
 * Features:
 *   - Pretext-inspired kinetic hero name (letter-by-letter with hover)
 *   - i18n (EN / 中文 / 日本語)
 *   - Theme toggle (light / dark)
 *   - Scroll reveal
 *   - Character engine: walk, idle, jump, drag, proximity, bubble messages
 */

// ── i18n ─────────────────────────────────────────────────────────────────────

const STRINGS = {
  en: {
    eyebrow: 'Profile',
    role: 'AI4X Undergraduate Researcher',
    sub: 'TU Delft × Eindhoven University of Technology',
    body: 'Working across computer science, electrical engineering, and applied physics. Primary interest in AI for Science, foundation models, and AI-driven analog circuit design.',
    btnResume: 'Resume',
    btnPdf: 'PDF',
    email: 'Email',
    cardProgram: 'Program',
    cardProgramVal: 'TU Delft × TU/e Joint',
    cardField: 'Field',
    cardFieldVal: 'CS · EE · Applied Physics',
    cardFocus: 'Focus',
    cardFocusVal: 'AI4Science · Foundation Models · Analog EDA',
    aboutTitle: 'About',
    aboutLead: 'Undergraduate in the joint program between Delft University of Technology and Eindhoven University of Technology.',
    aboutP1: 'My training spans computer science, electrical engineering, and applied physics — which shapes how I approach research: not as isolated software tasks, but as questions about representation, system behavior, and design under constraints.',
    aboutP2: 'I am moving toward research that connects modern machine learning with scientific understanding and engineering automation, especially in domains where physical structure still has to remain legible.',
    researchTitle: 'Research directions',
    researchLead: 'Problems that sit where model capability meets scientific or engineering structure.',
    dir1Title: 'AI for Science',
    dir1Body: 'Applying learning systems to scientific and technical problems where domain constraints, structure, and usefulness matter more than generic benchmark performance.',
    dir2Title: 'Foundation models',
    dir2Body: 'Foundation models as reasoning tools for technical workflows, structured knowledge, and complex design tasks rather than only conversational interfaces.',
    dir3Title: 'Analog circuit design',
    dir3Body: 'AI-driven methods for analog circuit modeling, optimization, and design automation in physically constrained environments.',
    expTitle: 'Selected experience',
    expLead: 'Recent work across machine learning research, semiconductor workflows, and data-driven scientific analysis.',
    exp1Date: 'Mar 2026 – Present',
    exp1Title: 'Research Assistant Intern, AI Research Group',
    exp1Body: 'Working on LLM for Recommendation (LLM4Rec).',
    exp2Date: 'Jul 2025 – Sep 2025',
    exp2Title: 'Research Assistant, Zhangjiang Laboratory',
    exp2Body: 'Semiconductor IC design workflows and EDA toolchains — schematic design, pre-layout simulation, layout verification, DRC/LVS, and MPW-oriented tape-out preparation.',
    exp3Date: 'Sep 2023 – Feb 2024',
    exp3Title: 'Student Researcher, Carnegie Mellon University',
    exp3Body: 'Environmental data research on PM2.5 air pollution and respiratory disease incidence using Python for exploratory analysis, statistical inference, and visualization.',
    contactTitle: 'Contact',
    contactLead: 'Open to research conversations, academic collaborations, and future opportunities.',
    contactResume: 'Resume page',
    ftrNote: 'Academic site · GitHub Pages',
  },
  zh: {
    eyebrow: '个人简介',
    role: 'AI4X 本科研究员',
    sub: '代尔夫特理工大学 × 埃因霍温理工大学',
    body: '研究方向横跨计算机科学、电气工程与应用物理，主要关注 AI for Science、基础模型以及 AI 驱动的模拟电路设计与优化。',
    btnResume: '简历页面',
    btnPdf: 'PDF',
    email: '邮件',
    cardProgram: '项目',
    cardProgramVal: 'TU Delft × TU/e 联合项目',
    cardField: '领域',
    cardFieldVal: '计算机科学 · 电气工程 · 应用物理',
    cardFocus: '方向',
    cardFocusVal: 'AI4Science · 基础模型 · 模拟 EDA',
    aboutTitle: '关于我',
    aboutLead: '就读于代尔夫特理工大学与埃因霍温理工大学联合项目。',
    aboutP1: '我的训练横跨计算机科学、电气工程与应用物理，这塑造了我看待研究问题的方式：不是孤立的软件任务，而是关于表示、系统行为和约束下设计的问题。',
    aboutP2: '我正在向将现代机器学习与科学理解和工程自动化相结合的研究方向迈进，尤其是在物理结构仍需保持可读性的领域。',
    researchTitle: '研究方向',
    researchLead: '我关注的问题处于模型能力与科学或工程结构的交汇处。',
    dir1Title: 'AI for Science',
    dir1Body: '将学习系统应用于科学和技术问题，在这些问题中，领域约束、结构和实用性比通用基准性能更重要。',
    dir2Title: '基础模型',
    dir2Body: '将基础模型作为技术工作流、结构化知识和复杂设计任务的推理工具，而不仅仅是对话界面。',
    dir3Title: '模拟电路设计',
    dir3Body: '探索 AI 驱动的模拟电路建模、优化和设计自动化方法，适用于物理约束环境。',
    expTitle: '精选经历',
    expLead: '近期工作涵盖机器学习研究、半导体工作流和数据驱动的科学分析。',
    exp1Date: '2026年3月 – 至今',
    exp1Title: 'AI 研究组，研究助理实习生',
    exp1Body: '从事 LLM for Recommendation (LLM4Rec) 研究。',
    exp2Date: '2025年7月 – 2025年9月',
    exp2Title: '张江实验室，研究助理',
    exp2Body: '研究半导体 IC 设计工作流和 EDA 工具链，包括原理图设计、预布局仿真、版图验证、DRC/LVS 和 MPW 流片准备。',
    exp3Date: '2023年9月 – 2024年2月',
    exp3Title: '卡内基梅隆大学，学生研究员',
    exp3Body: '使用 Python 对 PM2.5 空气污染与呼吸道疾病发病率之间的关系进行环境数据研究，包括探索性分析、统计推断和可视化。',
    contactTitle: '联系方式',
    contactLead: '欢迎学术交流、科研合作及未来机会。',
    contactResume: '简历页面',
    ftrNote: '学术个人网站 · GitHub Pages',
  },
  ja: {
    eyebrow: 'プロフィール',
    role: 'AI4X 学部研究員',
    sub: 'デルフト工科大学 × アイントホーフェン工科大学',
    body: 'コンピュータサイエンス、電気工学、応用物理学にまたがる研究。AI for Science、基盤モデル、AIによるアナログ回路設計に主な関心。',
    btnResume: '履歴書',
    btnPdf: 'PDF',
    email: 'メール',
    cardProgram: 'プログラム',
    cardProgramVal: 'TU Delft × TU/e 共同プログラム',
    cardField: '分野',
    cardFieldVal: 'CS · EE · 応用物理',
    cardFocus: '研究方向',
    cardFocusVal: 'AI4Science · 基盤モデル · アナログEDA',
    aboutTitle: '自己紹介',
    aboutLead: 'デルフト工科大学とアイントホーフェン工科大学の共同プログラムの学部生。',
    aboutP1: 'コンピュータサイエンス、電気工学、応用物理学にまたがるトレーニングを受けており、研究問題へのアプローチを形成しています。',
    aboutP2: '現代の機械学習と科学的理解・工学的自動化を結びつける研究に向かっています。',
    researchTitle: '研究方向',
    researchLead: 'モデルの能力と科学・工学的構造が交わる問題に取り組んでいます。',
    dir1Title: 'AI for Science',
    dir1Body: '領域制約、構造、有用性が汎用ベンチマーク性能より重要な科学・技術問題への学習システムの応用。',
    dir2Title: '基盤モデル',
    dir2Body: '会話インターフェースだけでなく、技術ワークフロー、構造化知識、複雑な設計タスクのための推論ツールとしての基盤モデル。',
    dir3Title: 'アナログ回路設計',
    dir3Body: '物理的制約環境でのアナログ回路モデリング、最適化、設計自動化のためのAI駆動手法。',
    expTitle: '主な経験',
    expLead: '機械学習研究、半導体ワークフロー、データ駆動科学分析にまたがる最近の研究。',
    exp1Date: '2026年3月 – 現在',
    exp1Title: 'AI研究グループ、研究アシスタントインターン',
    exp1Body: 'LLM for Recommendation (LLM4Rec) に取り組んでいます。',
    exp2Date: '2025年7月 – 2025年9月',
    exp2Title: '張江実験室、研究アシスタント',
    exp2Body: '半導体IC設計ワークフローとEDAツールチェーンを研究。',
    exp3Date: '2023年9月 – 2024年2月',
    exp3Title: 'カーネギーメロン大学、学生研究員',
    exp3Body: 'PM2.5大気汚染と呼吸器疾患発生率の関係についての環境データ研究。',
    contactTitle: '連絡先',
    contactLead: '研究会話、学術コラボレーション、将来の機会に開かれています。',
    contactResume: '履歴書ページ',
    ftrNote: '学術サイト · GitHub Pages',
  },
};

let currentLang = localStorage.getItem('lang') || 'en';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  const s = STRINGS[lang] || STRINGS.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (s[key] !== undefined) el.textContent = s[key];
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });
  document.documentElement.lang = lang === 'zh' ? 'zh-TW' : lang === 'ja' ? 'ja' : 'en';
  buildHeroName();
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// ── Theme ─────────────────────────────────────────────────────────────────────

const themeBtn = document.getElementById('themeBtn');
let isDark = localStorage.getItem('theme') === 'dark' ||
  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

function applyTheme(dark) {
  isDark = dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}
applyTheme(isDark);
themeBtn.addEventListener('click', () => applyTheme(!isDark));

// ── Scroll reveal ─────────────────────────────────────────────────────────────

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

// ── Kinetic hero name (pretext-inspired) ──────────────────────────────────────
// We implement the core idea: measure each character, animate on hover,
// and use requestAnimationFrame for smooth entrance.

function buildHeroName() {
  const el = document.getElementById('heroName');
  if (!el) return;
  const name = 'Weiping Yan';
  el.innerHTML = '';
  el.setAttribute('aria-label', name);

  // Build spans per character
  [...name].forEach((ch, i) => {
    if (ch === ' ') {
      const sp = document.createElement('span');
      sp.className = 'char-space';
      sp.setAttribute('aria-hidden', 'true');
      el.appendChild(sp);
    } else {
      const span = document.createElement('span');
      span.className = 'char-letter';
      span.textContent = ch;
      span.setAttribute('aria-hidden', 'true');
      span.style.opacity = '0';
      span.style.transform = 'translateY(30px)';
      span.style.transition = `opacity .5s ease ${i * 55}ms, transform .5s cubic-bezier(.22,.68,0,1.2) ${i * 55}ms`;
      el.appendChild(span);
    }
  });

  // Trigger entrance after a frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.querySelectorAll('.char-letter').forEach(span => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      });
    });
  });

  // Magnetic hover: letters repel from cursor
  el.addEventListener('mousemove', (e) => {
    const letters = el.querySelectorAll('.char-letter');
    letters.forEach(letter => {
      const rect = letter.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 80;
      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * 14;
        const angle = Math.atan2(dy, dx);
        const tx = -Math.cos(angle) * force;
        const ty = -Math.sin(angle) * force;
        const rot = tx * 1.5;
        letter.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
        letter.style.color = `var(--accent)`;
      } else {
        letter.style.transform = '';
        letter.style.color = '';
      }
    });
  });

  el.addEventListener('mouseleave', () => {
    el.querySelectorAll('.char-letter').forEach(l => {
      l.style.transform = '';
      l.style.color = '';
    });
  });
}

buildHeroName();


// ── Character Engine ──────────────────────────────────────────────────────────
// 10 frames: idle(2), walk(3), run(1), jump(2), wave(1), sit(1)
// All images 1254x1254 square — displayed at 90x90px

const CHAR = (() => {
  const SIZE = 90;
  const WALK_SPEED = 1.6, RUN_SPEED = 3.2;
  const GRAVITY = 0.55, JUMP_FORCE = -14;
  const PROX_DIST = 130;

  const ANIMS = {
    IDLE: { files: ['char-idle1.png','char-idle2.png'], fps: 1.5 },
    WALK: { files: ['char-walk1.png','char-walk2.png','char-walk3.png'], fps: 6 },
    RUN:  { files: ['char-run.png','char-walk1.png','char-run.png','char-walk3.png'], fps: 9 },
    JUMP: { files: ['char-jump1.png','char-jump2.png'], fps: 5 },
    FALL: { files: ['char-jump2.png'], fps: 5 },
    WAVE: { files: ['char-wave.png','char-idle1.png','char-wave.png','char-idle2.png'], fps: 4 },
    SIT:  { files: ['char-sit.png'], fps: 1 },
    DRAG: { files: ['char-jump1.png'], fps: 5 },
  };

  const imgs = {};
  const allFiles = [...new Set(Object.values(ANIMS).flatMap(a => a.files))];
  let loadedCount = 0;
  allFiles.forEach(name => {
    const img = new Image();
    img.onload  = () => { imgs[name] = img; loadedCount++; };
    img.onerror = () => { loadedCount++; };
    img.src = `assets/${name}`;
  });

  const charEl = document.getElementById('char');
  const canvas = document.getElementById('charCanvas');
  const ctx    = canvas.getContext('2d');
  const bubble = document.getElementById('charBubble');
  canvas.width = SIZE; canvas.height = SIZE;
  canvas.style.width = SIZE + 'px'; canvas.style.height = SIZE + 'px';

  let x = 120, y = 0, vx = 0, vy = 0;
  let facingRight = true, state = 'IDLE', frameIdx = 0, frameTimer = 0;
  let idleTimer = 200, walkTarget = -1, onGround = false;
  let isDragging = false, dragOffX = 0, dragOffY = 0;
  let lastMX = 0, lastMY = 0, throwVX = 0, throwVY = 0;
  let bubbleTimer = 0, rafId = 0, lastTime = 0;

  const floorY = () => window.innerHeight - SIZE;
  const clampX = v => Math.max(0, Math.min(window.innerWidth - SIZE, v));
  const setPos = (nx, ny) => { x = nx; y = ny; charEl.style.transform = `translate(${x}px,${y}px)`; };

  const MSGS = {
    en: ['Hello! 👋','Nice to meet you!','AI4Science~','(◕‿◕)','TU Delft!','Keep going!'],
    zh: ['你好！👋','很高兴认识你！','AI4Science！','(◕‿◕)','代尔夫特！','加油！'],
    ja: ['こんにちは！👋','よろしく！','AI4Science！','(◕‿◕)','デルフト！','頑張って！'],
  };
  function showBubble(msg) {
    const list = MSGS[currentLang] || MSGS.en;
    bubble.textContent = msg || list[Math.floor(Math.random()*list.length)];
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 2800);
  }

  function draw() {
    const anim = ANIMS[state] || ANIMS.IDLE;
    const file = anim.files[frameIdx % anim.files.length];
    const img  = imgs[file];
    ctx.clearRect(0, 0, SIZE, SIZE);
    if (!img) { drawFallback(); return; }
    ctx.save();
    if (!facingRight) { ctx.translate(SIZE, 0); ctx.scale(-1, 1); }
    ctx.drawImage(img, 0, 0, SIZE, SIZE);
    ctx.restore();
    const id = ctx.getImageData(0, 0, SIZE, SIZE);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] > 228 && d[i+1] > 228 && d[i+2] > 228) d[i+3] = 0;
    }
    ctx.putImageData(id, 0, 0);
  }

  function drawFallback() {
    const cx = SIZE/2, cy = SIZE*0.55;
    ctx.fillStyle = '#f5e6d8';
    ctx.beginPath(); ctx.ellipse(cx, cy-18, 14, 16, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#4a3728';
    ctx.beginPath(); ctx.ellipse(cx, cy-24, 15, 10, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#7eb8c9'; ctx.fillRect(cx-10, cy-4, 20, 14);
    ctx.fillStyle = '#5a7a8a'; ctx.fillRect(cx-8, cy+10, 7, 12); ctx.fillRect(cx+1, cy+10, 7, 12);
  }

  function pickIdle() {
    const r = Math.random();
    if      (r < 0.30) { state = 'WALK'; walkTarget = 60 + Math.random()*(window.innerWidth-SIZE-120); }
    else if (r < 0.45) { state = 'RUN';  walkTarget = 60 + Math.random()*(window.innerWidth-SIZE-120); }
    else if (r < 0.60) { state = 'WAVE'; showBubble(); }
    else if (r < 0.72) { state = 'SIT'; }
    else               { state = 'IDLE'; }
    frameIdx = 0;
    idleTimer = 150 + Math.random()*350;
  }

  function tick(ts) {
    rafId = requestAnimationFrame(tick);
    const dt = Math.min(ts - lastTime, 50);
    lastTime = ts;
    const fy = floorY();

    if (!isDragging) {
      if (y < fy) {
        vy += GRAVITY; y += vy;
        if (y >= fy) {
          y = fy; vy = 0; onGround = true;
          if (state === 'JUMP' || state === 'FALL') { state = 'IDLE'; frameIdx = 0; }
        } else { onGround = false; state = vy < 0 ? 'JUMP' : 'FALL'; }
      } else { y = fy; vy = 0; onGround = true; }

      if (Math.abs(vx) > 0.1) {
        x = clampX(x + vx); vx *= 0.88;
        if (Math.abs(vx) < 0.2) vx = 0;
        if (onGround) { facingRight = vx > 0; state = Math.abs(vx) > 0.5 ? 'WALK' : 'IDLE'; }
      }

      if (onGround && Math.abs(vx) < 0.2 && (state === 'WALK' || state === 'RUN') && walkTarget >= 0) {
        const speed = state === 'RUN' ? RUN_SPEED : WALK_SPEED;
        const dx = walkTarget - (x + SIZE/2);
        if (Math.abs(dx) < 4) { state = 'IDLE'; walkTarget = -1; idleTimer = 100 + Math.random()*200; }
        else { facingRight = dx > 0; x = clampX(x + (facingRight ? speed : -speed)); }
      }

      if (onGround && Math.abs(vx) < 0.2 && state !== 'WALK' && state !== 'RUN') {
        if (--idleTimer <= 0) pickIdle();
      }
    }

    const anim = ANIMS[state] || ANIMS.IDLE;
    frameTimer += dt / 1000;
    const interval = 1 / anim.fps;
    if (frameTimer >= interval) { frameTimer -= interval; frameIdx = (frameIdx + 1) % anim.files.length; }

    draw();
    setPos(x, y);
  }

  function startDrag(cx, cy) {
    isDragging = true; state = 'DRAG'; frameIdx = 0;
    dragOffX = cx - x; dragOffY = cy - y;
    lastMX = cx; lastMY = cy; vx = 0; vy = 0;
    charEl.classList.add('dragging');
    showBubble('Wheee~! 🌟');
  }
  function moveDrag(cx, cy) {
    if (!isDragging) return;
    throwVX = cx - lastMX; throwVY = cy - lastMY;
    lastMX = cx; lastMY = cy;
    x = cx - dragOffX; y = cy - dragOffY; setPos(x, y);
  }
  function endDrag() {
    if (!isDragging) return;
    isDragging = false; charEl.classList.remove('dragging');
    vx = throwVX * 0.55; vy = throwVY * 0.55;
    state = vy < 0 ? 'JUMP' : 'FALL'; frameIdx = 0;
  }

  canvas.addEventListener('mousedown',  e => { e.preventDefault(); startDrag(e.clientX, e.clientY); });
  canvas.addEventListener('touchstart', e => { e.preventDefault(); const t=e.touches[0]; startDrag(t.clientX, t.clientY); }, {passive:false});
  document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
  document.addEventListener('mouseup',   endDrag);
  document.addEventListener('touchmove', e => { const t=e.touches[0]; moveDrag(t.clientX, t.clientY); }, {passive:true});
  document.addEventListener('touchend',  endDrag);

  let proxCooldown = 0;
  document.addEventListener('mousemove', e => {
    if (isDragging || --proxCooldown > 0) return;
    const dx = e.clientX - (x + SIZE/2), dy = e.clientY - (y + SIZE/2);
    if (Math.sqrt(dx*dx+dy*dy) < PROX_DIST && onGround) {
      vy = JUMP_FORCE; vx = -dx*0.07;
      state = 'JUMP'; frameIdx = 0; onGround = false; proxCooldown = 80;
      if (Math.random() < 0.4) showBubble('Eek! 😳');
    }
  });

  canvas.addEventListener('click', () => {
    if (Math.abs(throwVX) > 1 || Math.abs(throwVY) > 1) return;
    state = 'WAVE'; frameIdx = 0; idleTimer = 120; showBubble();
  });

  function initChar() {
    x = 120; y = floorY(); setPos(x, y); idleTimer = 200;
    if (!rafId) requestAnimationFrame(tick);
  }
  if (document.readyState === 'complete') initChar();
  else window.addEventListener('load', initChar, {once:true});

  window.addEventListener('resize', () => {
    const fy = floorY();
    if (Math.abs(y - fy) > 5) { y = fy; setPos(x, y); }
    x = clampX(x);
  });

  return { showBubble };
})();

// ── Init ──────────────────────────────────────────────────────────────────────
document.documentElement.classList.add('js');
applyLang(currentLang);
