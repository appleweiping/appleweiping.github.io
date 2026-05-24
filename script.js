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
// A full desktop-pet style character with:
//   States: IDLE, WALK, JUMP, DRAG, FALL, WAVE, SIT
//   Behaviors: auto-walk, proximity jump, drag & throw, idle animations
//   Rendering: canvas sprite animation with fallback procedural art

const CHAR = (() => {
  // ── Config ──────────────────────────────────────────────────────────────────
  const SCALE = 2;           // render scale
  const FRAME_W = 48;        // sprite frame width (source)
  const FRAME_H = 64;        // sprite frame height (source)
  // When individual frame images are loaded, use larger display size
  const DISPLAY_W = 96;      // character display width px
  const DISPLAY_H = 120;     // character display height px
  const FLOOR_OFFSET = 0;    // px above bottom of viewport
  const WALK_SPEED = 1.4;    // px per frame
  const GRAVITY = 0.55;
  const JUMP_FORCE = -13;
  const PROXIMITY_DIST = 120;

  // ── State ───────────────────────────────────────────────────────────────────
  let x = 120, y = 0;
  let vx = 0, vy = 0;
  let facingRight = true;
  let state = 'IDLE';
  let frame = 0;
  let frameTimer = 0;
  let idleTimer = 0;
  let walkTarget = -1;
  let isDragging = false;
  let dragOffX = 0, dragOffY = 0;
  let lastMouseX = 0, lastMouseY = 0;
  let throwVX = 0, throwVY = 0;
  let bubbleTimer = 0;
  let onGround = false;
  let animFrame = 0;

  // Sprite sheet: 6 frames per row
  // Row 0: idle (frames 0-1), walk (frames 2-4), jump (frame 5)
  // Row 1: wave (frames 0-2), sit (frames 3-4), fall (frame 5)
  const ANIM = {
    IDLE:  { row: 0, frames: [0, 1],       fps: 2  },
    WALK:  { row: 0, frames: [2, 3, 4],    fps: 8  },
    JUMP:  { row: 0, frames: [5],           fps: 4  },
    FALL:  { row: 1, frames: [5],           fps: 4  },
    WAVE:  { row: 1, frames: [0, 1, 2, 1], fps: 6  },
    SIT:   { row: 1, frames: [3, 4, 4, 3], fps: 3  },
    DRAG:  { row: 0, frames: [5],           fps: 4  },
  };

  // ── DOM ─────────────────────────────────────────────────────────────────────
  const charEl = document.getElementById('char');
  const canvas = document.getElementById('charCanvas');
  const ctx = canvas.getContext('2d');
  const bubble = document.getElementById('charBubble');

  canvas.width = DISPLAY_W;
  canvas.height = DISPLAY_H;
  canvas.style.width = DISPLAY_W + 'px';
  canvas.style.height = DISPLAY_H + 'px';

  // ── Sprite loading — supports individual frame files ───────────────────────
  // If you provide char-idle.png, char-walk1.png, char-walk2.png, char-jump.png
  // in assets/, they will be used. Otherwise falls back to procedural art.
  const frameImages = {};
  const frameFiles = {
    idle:  'assets/char-idle.png',
    walk1: 'assets/char-walk1.png',
    walk2: 'assets/char-walk2.png',
    jump:  'assets/char-jump.png',
  };
  let framesLoaded = 0;
  let framesAttempted = 0;
  Object.entries(frameFiles).forEach(([key, src]) => {
    framesAttempted++;
    const img = new Image();
    img.onload = () => { frameImages[key] = img; framesLoaded++; };
    img.onerror = () => { framesLoaded++; }; // count failures too
    img.src = src;
  });
  function hasFrames() { return framesLoaded >= framesAttempted && Object.keys(frameImages).length > 0; }

  // Legacy sprite sheet fallback
  let spriteLoaded = false;
  const sprite = new Image();
  sprite.onload = () => { spriteLoaded = true; };
  sprite.onerror = () => { spriteLoaded = false; };
  sprite.src = 'assets/char-sprite.png';

  // ── Procedural fallback art ──────────────────────────────────────────────────
  // Draws a cute chibi character using canvas 2D primitives
  function drawProcedural(anim, frameIdx, flip) {
    ctx.clearRect(0, 0, DISPLAY_W, DISPLAY_H);
    ctx.save();
    if (flip) {
      ctx.translate(DISPLAY_W, 0);
      ctx.scale(-1, 1);
    }

    const cx = DISPLAY_W / 2;
    const t = frameIdx;

    // Body bounce
    const bounce = (anim === 'WALK') ? Math.sin(t * Math.PI) * 2 : 0;
    const jumpOff = (anim === 'JUMP' || anim === 'DRAG') ? -6 : 0;
    const sitOff = (anim === 'SIT') ? 8 : 0;
    const baseY = DISPLAY_H - 8 + bounce + jumpOff + sitOff;

    // Legs
    ctx.fillStyle = '#5a7a8a';
    if (anim === 'WALK') {
      const legSwing = Math.sin(t * Math.PI) * 6;
      ctx.fillRect(cx - 10, baseY - 22 + legSwing, 8, 14);
      ctx.fillRect(cx + 2, baseY - 22 - legSwing, 8, 14);
    } else if (anim === 'SIT') {
      ctx.fillRect(cx - 14, baseY - 10, 10, 8);
      ctx.fillRect(cx + 4, baseY - 10, 10, 8);
    } else {
      ctx.fillRect(cx - 10, baseY - 22, 8, 14);
      ctx.fillRect(cx + 2, baseY - 22, 8, 14);
    }

    // Shoes
    ctx.fillStyle = '#2d3a42';
    ctx.beginPath();
    ctx.ellipse(cx - 6, baseY - 8, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 6, baseY - 8, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Skirt / body
    ctx.fillStyle = '#7eb8c9';
    ctx.beginPath();
    ctx.moveTo(cx - 16, baseY - 22);
    ctx.lineTo(cx + 16, baseY - 22);
    ctx.lineTo(cx + 20, baseY - 38);
    ctx.lineTo(cx - 20, baseY - 38);
    ctx.closePath();
    ctx.fill();

    // Torso
    ctx.fillStyle = '#d4eaf0';
    ctx.beginPath();
    ctx.roundRect(cx - 13, baseY - 52, 26, 16, 4);
    ctx.fill();

    // Ribbon
    ctx.fillStyle = '#e8a0b0';
    ctx.beginPath();
    ctx.moveTo(cx - 6, baseY - 44);
    ctx.lineTo(cx - 12, baseY - 48);
    ctx.lineTo(cx - 6, baseY - 46);
    ctx.lineTo(cx, baseY - 50);
    ctx.lineTo(cx + 6, baseY - 46);
    ctx.lineTo(cx + 12, baseY - 48);
    ctx.lineTo(cx + 6, baseY - 44);
    ctx.closePath();
    ctx.fill();

    // Arms
    ctx.fillStyle = '#d4eaf0';
    const armSwing = (anim === 'WAVE') ? Math.sin(t * Math.PI * 0.8) * 12 - 8 : 0;
    ctx.beginPath();
    ctx.roundRect(cx - 20, baseY - 52 + armSwing, 8, 14, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx + 12, baseY - 52, 8, 14, 4);
    ctx.fill();

    // Head
    const headBob = (anim === 'IDLE') ? Math.sin(Date.now() * 0.002) * 1.5 : 0;
    const headY = baseY - 72 + headBob;
    ctx.fillStyle = '#f5e6d8';
    ctx.beginPath();
    ctx.ellipse(cx, headY, 18, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#4a3728';
    ctx.beginPath();
    ctx.ellipse(cx, headY - 8, 19, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // Side hair
    ctx.beginPath();
    ctx.ellipse(cx - 16, headY + 4, 6, 14, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 16, headY + 4, 6, 14, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Beret
    ctx.fillStyle = '#7eb8c9';
    ctx.beginPath();
    ctx.ellipse(cx + 4, headY - 16, 16, 8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 6, headY - 20, 8, 6, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    const eyeOpen = (anim === 'SIT') ? 0.4 : 1;
    ctx.fillStyle = '#2a1f1a';
    ctx.beginPath();
    ctx.ellipse(cx - 7, headY + 2, 4, 5 * eyeOpen, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 7, headY + 2, 4, 5 * eyeOpen, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye shine
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(cx - 5, headY, 1.5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 9, headY, 1.5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#c0826a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (anim === 'JUMP' || anim === 'DRAG') {
      ctx.arc(cx, headY + 9, 4, 0, Math.PI);
    } else {
      ctx.arc(cx, headY + 8, 3, 0.1, Math.PI - 0.1);
    }
    ctx.stroke();

    // Blush
    ctx.fillStyle = 'rgba(255,160,140,0.35)';
    ctx.beginPath();
    ctx.ellipse(cx - 12, headY + 6, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 12, headY + 6, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ── Sprite rendering ─────────────────────────────────────────────────────────
  function drawSprite(anim, frameIdx, flip) {
    // Try individual frame images first (highest quality)
    if (hasFrames()) {
      let frameKey = 'idle';
      if (anim === 'WALK') frameKey = frameIdx % 2 === 0 ? 'walk1' : 'walk2';
      else if (anim === 'JUMP' || anim === 'DRAG' || anim === 'FALL') frameKey = 'jump';
      const img = frameImages[frameKey] || frameImages['idle'];
      if (img) {
        ctx.clearRect(0, 0, DISPLAY_W, DISPLAY_H);
        ctx.save();
        if (flip) { ctx.translate(DISPLAY_W, 0); ctx.scale(-1, 1); }
        ctx.drawImage(img, 0, 0, DISPLAY_W, DISPLAY_H);
        ctx.restore();
        // Remove white background: set white/near-white pixels to transparent
        const imageData = ctx.getImageData(0, 0, DISPLAY_W, DISPLAY_H);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i+1], b = d[i+2];
          // If pixel is near-white (all channels > 230), make transparent
          if (r > 230 && g > 230 && b > 230) {
            d[i+3] = 0;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        return;
      }
    }
    // Try sprite sheet
    if (spriteLoaded) {
      const a = ANIM[anim] || ANIM.IDLE;
      const srcFrame = a.frames[frameIdx % a.frames.length];
      const srcX = srcFrame * FRAME_W;
      const srcY = a.row * FRAME_H;
      ctx.clearRect(0, 0, DISPLAY_W, DISPLAY_H);
      ctx.save();
      if (flip) { ctx.translate(DISPLAY_W, 0); ctx.scale(-1, 1); }
      ctx.drawImage(sprite, srcX, srcY, FRAME_W, FRAME_H, 0, 0, DISPLAY_W, DISPLAY_H);
      ctx.restore();
      return;
    }
    // Procedural fallback
    drawProcedural(anim, frameIdx, flip);
  }

  // ── Bubble messages ──────────────────────────────────────────────────────────
  const MESSAGES = {
    en: ['Hello! 👋', 'Nice to meet you!', 'I love research~', 'AI4Science!', 'Let\'s explore!', '(◕‿◕)', 'Analog circuits~', 'TU Delft!', 'Keep going!'],
    zh: ['你好！👋', '很高兴认识你！', '我喜欢研究~', 'AI4Science！', '一起探索吧！', '(◕‿◕)', '模拟电路~', '代尔夫特！', '加油！'],
    ja: ['こんにちは！👋', 'よろしく！', '研究が好き~', 'AI4Science！', '一緒に探索しよう！', '(◕‿◕)', 'アナログ回路~', 'デルフト！', '頑張って！'],
  };

  function showBubble(msg) {
    bubble.textContent = msg || MESSAGES[currentLang][Math.floor(Math.random() * MESSAGES[currentLang].length)];
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 2800);
  }

  // ── Position helpers ─────────────────────────────────────────────────────────
  function getFloorY() {
    return window.innerHeight - DISPLAY_H - FLOOR_OFFSET;
  }

  function clampX(val) {
    return Math.max(0, Math.min(window.innerWidth - DISPLAY_W, val));
  }

  function setPos(nx, ny) {
    x = nx; y = ny;
    charEl.style.transform = `translate(${x}px, ${y}px)`;
  }

  // ── Walk target ──────────────────────────────────────────────────────────────
  function pickNewTarget() {
    const margin = 60;
    walkTarget = margin + Math.random() * (window.innerWidth - DISPLAY_W - margin * 2);
  }

  // ── Idle behaviors ───────────────────────────────────────────────────────────
  const IDLE_BEHAVIORS = ['IDLE', 'WAVE', 'SIT', 'WALK'];
  let idleBehaviorTimer = 0;

  function pickIdleBehavior() {
    const r = Math.random();
    if (r < 0.35) {
      state = 'WALK';
      pickNewTarget();
    } else if (r < 0.55) {
      state = 'WAVE';
      showBubble();
    } else if (r < 0.7) {
      state = 'SIT';
    } else {
      state = 'IDLE';
    }
    frame = 0;
    idleBehaviorTimer = 180 + Math.random() * 300;
  }

  // ── Main loop ────────────────────────────────────────────────────────────────
  function tick() {
    animFrame = requestAnimationFrame(tick);
    const floorY = getFloorY();

    if (!isDragging) {
      // Gravity
      if (y < floorY) {
        vy += GRAVITY;
        y += vy;
        if (y >= floorY) {
          y = floorY;
          if (vy > 3) {
            // Landing
            state = 'IDLE';
            frame = 0;
          }
          vy = 0;
          onGround = true;
        } else {
          onGround = false;
          state = vy < 0 ? 'JUMP' : 'FALL';
        }
      } else {
        y = floorY;
        onGround = true;
        vy = 0;
      }

      // Horizontal throw momentum
      if (Math.abs(vx) > 0.1) {
        x = clampX(x + vx);
        vx *= 0.88;
        if (Math.abs(vx) < 0.2) vx = 0;
        if (onGround && state !== 'JUMP') {
          state = Math.abs(vx) > 0.5 ? 'WALK' : 'IDLE';
          facingRight = vx > 0;
        }
      }

      // State machine
      if (onGround && Math.abs(vx) < 0.2) {
        idleBehaviorTimer--;
        if (idleBehaviorTimer <= 0) pickIdleBehavior();

        if (state === 'WALK' && walkTarget >= 0) {
          const dx = walkTarget - (x + DISPLAY_W / 2);
          if (Math.abs(dx) < 3) {
            state = 'IDLE';
            walkTarget = -1;
            idleBehaviorTimer = 120 + Math.random() * 200;
          } else {
            facingRight = dx > 0;
            x = clampX(x + (facingRight ? WALK_SPEED : -WALK_SPEED));
          }
        }
      }
    }

    // Animate frames
    frameTimer++;
    const anim = ANIM[state] || ANIM.IDLE;
    const fpsInterval = Math.round(60 / anim.fps);
    if (frameTimer >= fpsInterval) {
      frameTimer = 0;
      frame = (frame + 1) % anim.frames.length;
    }

    // Render
    drawSprite(state, frame, !facingRight);
    setPos(x, y);
  }

  // ── Drag ─────────────────────────────────────────────────────────────────────
  canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    state = 'DRAG';
    frame = 0;
    dragOffX = e.clientX - x;
    dragOffY = e.clientY - y;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    vx = 0; vy = 0;
    charEl.classList.add('dragging');
    showBubble('Wheee~! 🌟');
  });

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    isDragging = true;
    state = 'DRAG';
    frame = 0;
    dragOffX = t.clientX - x;
    dragOffY = t.clientY - y;
    lastMouseX = t.clientX;
    lastMouseY = t.clientY;
    vx = 0; vy = 0;
    charEl.classList.add('dragging');
  }, { passive: false });

  function onMove(cx, cy) {
    if (!isDragging) return;
    throwVX = cx - lastMouseX;
    throwVY = cy - lastMouseY;
    lastMouseX = cx;
    lastMouseY = cy;
    x = cx - dragOffX;
    y = cy - dragOffY;
    setPos(x, y);
  }

  function onRelease() {
    if (!isDragging) return;
    isDragging = false;
    charEl.classList.remove('dragging');
    vx = throwVX * 0.6;
    vy = throwVY * 0.6;
    state = vy < 0 ? 'JUMP' : 'FALL';
    frame = 0;
  }

  document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
  document.addEventListener('mouseup', onRelease);
  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    onMove(t.clientX, t.clientY);
  }, { passive: true });
  document.addEventListener('touchend', onRelease);

  // ── Proximity jump ────────────────────────────────────────────────────────────
  let proximityJumpCooldown = 0;
  document.addEventListener('mousemove', (e) => {
    if (isDragging) return;
    proximityJumpCooldown--;
    if (proximityJumpCooldown > 0) return;

    const charCX = x + DISPLAY_W / 2;
    const charCY = y + DISPLAY_H / 2;
    const dx = e.clientX - charCX;
    const dy = e.clientY - charCY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < PROXIMITY_DIST && onGround) {
      vy = JUMP_FORCE;
      vx = -dx * 0.08;
      state = 'JUMP';
      frame = 0;
      onGround = false;
      proximityJumpCooldown = 90;
      if (Math.random() < 0.4) showBubble('Eek! 😳');
    }
  });

  // ── Click to wave ─────────────────────────────────────────────────────────────
  canvas.addEventListener('click', (e) => {
    if (Math.abs(throwVX) > 1 || Math.abs(throwVY) > 1) return;
    state = 'WAVE';
    frame = 0;
    idleBehaviorTimer = 120;
    showBubble();
  });

  // ── Init ──────────────────────────────────────────────────────────────────────
  function initChar() {
    x = 120;
    y = getFloorY();
    setPos(x, y);
    idleBehaviorTimer = 200;
    if (!animFrame) tick();
  }

  // Wait for full page load so window.innerHeight is stable
  if (document.readyState === 'complete') {
    initChar();
  } else {
    window.addEventListener('load', initChar, { once: true });
  }

  window.addEventListener('resize', () => {
    const newFloor = getFloorY();
    if (y > newFloor || y < newFloor - 10) { y = newFloor; setPos(x, y); }
    x = clampX(x);
  });

  return { showBubble };
})();

// ── Init ──────────────────────────────────────────────────────────────────────
document.documentElement.classList.add('js');
applyLang(currentLang);
