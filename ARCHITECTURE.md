# 个人网站可编程视觉系统 - 技术架构

## 核心设计理念

本项目的核心改变是：**从 DOM 流式布局 → 自定义渲染管线**。所有视觉元素（角色、文本、背景、粒子）都不再依赖浏览器原生排版，而是通过统一的 Canvas 或 WebGL 渲染循环驱动，实现毫秒级精确控制。

---

## 系统架构图

```
┌─────────────────────────────────────────────────────┐
│                  HeroScene 控制器                    │  <- 主协调器
│  (时间管理 | 滚动进度 | 输入状态 | 帧同步)          │
└──────────────┬──────────────────────────────────────┘
               │
       ┌───────┼───────┬───────┬─────────┐
       ▼       ▼       ▼       ▼         ▼
┌──────────┐┌───────┐┌─────────┐┌──────┐┌──────────┐
│ 角色渲染 ││文本   ││ 背景    ││粒子  ││ 交互    │
│ 层       ││排版   ││ 系统    ││系统  ││ 引擎    │
│          ││系统   ││ (分层)  ││      ││         │
│ • 分层   ││• 度量 ││ 1. 远景│└──────┘│• 鼠标  │
│ • 微动画 ││• 换行 ││ 2. 中景││      │• 滚动  │
│ • 视差   ││• 渲染 ││ 3. 近景││      │• 阻尼  │
└──────────┘└───────┘└─────────┘└──────┘└──────────┘
       ▲       ▲       ▲       ▲         ▲
       └───────┴───────┴───────┴─────────┘
         requestAnimationFrame 16ms/frame
```

---

## 1. 角色渲染系统 (Character Rendering Layer)

### 设计原则
- **原创设计，禁止 IP**：长寿种族叙事，冷静疏离气质
- **分层存储**：头发(含摆动)、面部、服装、身体、饰物
- **半自主实体**：不是装饰，参与视觉节奏

### 实现方式
```javascript
class Character {
  constructor() {
    this.layers = {
      hair: { scale: 1, rotation: 0, opacity: 1 },    // 支持摆动
      face: { scale: 1, opacity: 1 },
      clothes: { scale: 1, opacity: 1 },
      body: { scale: 1, opacity: 1 },
      accessories: [/* 多个饰物 */]
    };
    // 参数化控制
    this.breathingPhase = 0;        // 呼吸周期
    this.hairSwayPhase = 0;         // 头发摆动
    this.eyeBlinkPhase = 0;         // 眨眼周期
    this.parallaxOffset = { x: 0, y: 0 };  // 鼠标响应
  }

  // 微动画驱动（每帧调用）
  update(deltaTime, inputState) {
    this.breathingPhase += deltaTime * 0.3;  // 低频
    this.hairSwayPhase += deltaTime * 0.5;
    this.eyes = Math.sin(this.eyeBlinkPhase) > 0.7;  // 0.7阈值眨眼
    this.parallaxOffset = inputState.mouseNorm.scale(5);  // 鼠标视差
    this.render();
  }

  render() {
    // 使用 Canvas 2D API 或 SVG 或自定义格式渲染各层
    ctx.save();
    ctx.translate(this.x, this.y);
    this.drawHair(ctx);    // 支持摆动变换
    this.drawFace(ctx);
    this.drawClothes(ctx);
    this.drawBody(ctx);
    this.drawAccessories(ctx);
    ctx.restore();
  }
}
```

### 动画原则
- **低频呼吸**：scale/position 幅度 ±2%，周期 3-4 秒
- **头发摆动**：正弦/Perlin 噪声，周期 2-3 秒，角度±3°
- **眨眼**：随机 break，10% 闭眼时间
- **鼠标视差**：1-5px 微移，阻尼衰减
- **关键限制**：所有动画应"几乎不可察觉但持续存在"

---

## 2. 自定义文本排版系统 (Custom Layout Pipeline)

### 核心问题
传统 DOM 排版导致：reflow 瓶颈、无字符级控制、难以实现动态布局。

### 解决方案：用户态排版引擎

```javascript
class TextLayout {
  constructor(text, maxWidth, font) {
    this.text = text;
    this.maxWidth = maxWidth;
    this.font = font;  // e.g., "18px Segoe UI"
    this.lines = [];   // [{text, y, glyphs: [{x, y, char, width}]}]
    this.characters = [];  // 所有字符的度量与位置信息
  }

  // 核心：Canvas 度量 + 用户态换行
  measure() {
    // 创建临时 Canvas 获取精确度量
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = this.font;

    // 逐字符度量
    let x = 0, y = 0;
    this.characters = [];
    const words = this.text.split(' ');

    for (let word of words) {
      const wordWidth = ctx.measureText(word).width;
      
      if (x + wordWidth > this.maxWidth && x > 0) {
        // 换行
        y += this.lineHeight;
        x = 0;
      }

      for (let char of word + ' ') {
        const charWidth = ctx.measureText(char).width;
        this.characters.push({
          char,
          x: x + this.x,
          y: y + this.y,
          width: charWidth,
          opacity: 1,
          scale: 1,
          delay: 0  // 支持延迟渐进动画
        });
        x += charWidth;
      }
    }
  }

  // 渲染字符流
  render(ctx) {
    this.characters.forEach(glyph => {
      ctx.globalAlpha = glyph.opacity;
      ctx.save();
      ctx.translate(glyph.x, glyph.y);
      ctx.scale(glyph.scale, glyph.scale);
      ctx.fillText(glyph.char, 0, 0);
      ctx.restore();
    });
  }

  // 支持动态行为
  applyBreathingAnimation(phase) {
    this.characters.forEach((g, i) => {
      g.opacity = 0.8 + 0.2 * Math.sin(phase + i * 0.1);
    });
  }

  applyScrollDelay(scrollProgress) {
    // 延迟跟随效果
    this.characters.forEach((g, i) => {
      g.delay = Math.max(0, scrollProgress - i * 0.01);
      g.y += (1 - g.delay) * 20;  // 惯性延迟
    });
  }
}
```

### 关键特性
- **字符级控制**：每个字符独立透明度、缩放、位置
- **自定义亮度曲线**：呼吸式透明度、渐进延迟、围绕形状流动（高级）
- **性能**：避免频繁 DOM 操作，单次 measure + render 成本 < 5ms

---

## 3. 分层背景系统 (Layered Background)

### 三层结构

```javascript
class BackgroundSystem {
  constructor() {
    // 第一层：远景 (Sky)
    this.skyLayer = {
      type: 'gradient',
      colors: ['#f0e5ff', '#d4c5ff', '#c8b3ff'],
      angle: 0,  // 响应滚动渐变
      animation: 'subtle_hue_shift'
    };

    // 第二层：中景 (Atmosphere)
    this.midLayer = {
      particles: [],  // 雾气与光带
      opacity: 0.3,
      blurFilter: 'blur(2px)',
      parallaxRatio: 0.5  // 50% 视差
    };

    // 第三层：近景 (Micro Elements)
    this.nearLayer = {
      particles: [],  // 微光与闪烁
      opacity: 0.6,
      parallaxRatio: 1.0  // 100% 视差
    };
  }

  render(ctx, scrollProgress, mousePosNorm) {
    // 远景：基础梯度
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, this.skyLayer.colors[0]);
    gradient.addColorStop(0.5, this.skyLayer.colors[1]);
    gradient.addColorStop(1, this.skyLayer.colors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    // 中景：雾气粒子
    this.midLayer.particles.forEach(p => {
      const offsetX = mousePosNorm.x * this.midLayer.parallaxRatio * 30;
      ctx.globalAlpha = this.midLayer.opacity;
      ctx.drawImage(p.texture, p.x + offsetX, p.y);
    });

    // 近景：微光粒子（100% 跟随鼠标）
    this.nearLayer.particles.forEach(p => {
      const offsetX = mousePosNorm.x * 30;
      const offsetY = mousePosNorm.y * 20;
      ctx.globalAlpha = this.nearLayer.opacity;
      ctx.drawImage(p.texture, p.x + offsetX, p.y + offsetY);
    });
  }
}
```

### 视差逻辑
- **远景** (parallax=0)：固定，只响应渐变变化
- **中景** (parallax=0.5)：半速响应鼠标与滚动
- **近景** (parallax=1.0)：全速响应，最敏感

---

## 4. 粒子系统 (Particle System)

### 简化 Canvas 实现

```javascript
class ParticleSystem {
  constructor(capacity = 500) {
    this.particles = [];
    this.capacity = capacity;
  }

  emit(x, y, vx, vy, lifetime, size, color) {
    if (this.particles.length >= this.capacity) {
      this.particles.shift();  // 移除最旧粒子
    }
    this.particles.push({
      x, y, vx, vy, lifetime, maxLifetime: lifetime,
      size, color, opacity: 1
    });
  }

  update(deltaTime) {
    this.particles = this.particles.filter(p => {
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.lifetime -= deltaTime;
      p.opacity = p.lifetime / p.maxLifetime;  // 淡出
      return p.lifetime > 0;
    });
  }

  render(ctx) {
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
```

### 密度控制
- **总粒子数** < 500（避免 GC 压力）
- **发射率** < 50 particles/sec
- **生存期** 1-3 秒
- **结果**：安静、低调的氛围，而非视觉轰炸

---

## 5. HeroScene 控制器与交互引擎

### 统一协调器

```javascript
class HeroScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    // 子系统
    this.character = new Character();
    this.textLayout = new TextLayout('...');
    this.bg = new BackgroundSystem();
    this.particles = new ParticleSystem();

    // 全局状态
    this.time = 0;
    this.scrollProgress = 0;  // 0-1
    this.mouseNorm = { x: 0, y: 0 };  // 归一化坐标
    
    // 交互输入缓冲
    this.inputState = {
      mouseX: 0, mouseY: 0,
      mouseNorm: { x: 0, y: 0 },
      scrollY: 0
    };

    // 绑定事件
    this.bindEvents();
    this.renderLoop();
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.inputState.mouseX = e.clientX;
      this.inputState.mouseY = e.clientY;
      this.inputState.mouseNorm = {
        x: (e.clientX / this.width) * 2 - 1,  // -1 ~ 1
        y: (e.clientY / this.height) * 2 - 1
      };
    });

    window.addEventListener('scroll', () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      this.scrollProgress = window.scrollY / maxScroll;
    });
  }

  renderLoop() {
    const now = performance.now();
    const deltaTime = (now - this.lastTime) / 1000 || 0;
    this.lastTime = now;

    this.time += deltaTime;

    // 更新所有子系统
    this.character.update(deltaTime, this.inputState);
    this.textLayout.applyBreathingAnimation(this.time * 0.5);
    this.textLayout.applyScrollDelay(this.scrollProgress);
    this.particles.update(deltaTime);

    // 渲染管线
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.bg.render(this.ctx, this.scrollProgress, this.inputState.mouseNorm);
    this.character.render(this.ctx);
    this.textLayout.render(this.ctx);
    this.particles.render(this.ctx);

    requestAnimationFrame(() => this.renderLoop());
  }
}

// 启动
const scene = new HeroScene(document.getElementById('heroCanvas'));
```

---

## 6. 性能约束

### 目标
- **帧率**：60 FPS（主流设备）
- **帧预算**：< 16.67ms / frame
- **减速时降级**：检测 frame drop，减少粒子数或特效

### 优化策略
1. **避免 layout thrashing**：使用 `will-change`, `contain` CSS
2. **Canvas 批处理**：单次 measure, 多次 render
3. **Object pool**：粒子对象复用，避免频繁 GC
4. **Blur/Filter 缓存**：预渲染背景模糊，不每帧重新计算

---

## 7. 集成流程

### 保留内容区域
```
┌──────────────────────────────────────────┐
│          <Hero Canvas> 可编程视觉        │  <- 新系统
├──────────────────────────────────────────┤
│  About / Research / Experience / Projects│  <- 现有 DOM 内容
│  (使用  Intersection Observer 触发      │
│   About 区域的文本动画)                  │
└──────────────────────────────────────────┘
```

---

## 8. 文件结构

```
appleweiping.github.io/
├── index.html              <- 改进版 (+ Canvas 容器)
├── style.css               <- 现有内容 CSS + Canvas 容器  
├── script.js               <- 旧脚本 (保留或合并)
├── src/
│   ├── core/
│   │   ├── HeroScene.js     <- 主协调器
│   │   └── renderLoop.js    <- 帧同步
│   ├── systems/
│   │   ├── Character.js     <- 角色系统
│   │   ├── TextLayout.js    <- 文本排版
│   │   ├── Background.js    <- 背景系统
│   │   └── ParticleSystem.js <- 粒子系统
│   ├── interaction/
│   │   ├── InputManager.js  <- 输入处理
│   │   └── AnimationController.js <- 动画驱动
│   └── utils/
│       └── math.js          <- 向量/插值工具
└── ARCHITECTURE.md         <- 本文件
```

---

## 9. 实施路线图

1. **第1阶段**：建立 Canvas 容器 + renderLoop（测试 60fps）
2. **第2阶段**：实现角色分层 + 基础微动画
3. **第3阶段**：文本排版引擎 + 字符级动画
4. **第4阶段**：背景分层 + 粒子系统
5. **第5阶段**：鼠标/滚动交互集成
6. **第6阶段**：性能分析与降级方案
7. **第7阶段**：集成现有内容 + 测试

---

## 关键决策点

- **渲染库**：纯 Canvas 2D（简单、跨浏览器）vs WebGL（更强大但复杂）
  - **建议**：Canvas 2D 为主，关键动画使用 WebGL
  
- **角色素材格式**：SVG（矢量、易修改）vs Canvas 手绘（性能优）
  - **建议**：SVG 素材 → 预渲染为 Canvas Path 或 ImageData

- **字体系统**：Web Font（灵活）vs 系统字体（快速）
  - **建议**：混合策略，标题用 Web Font，正文用系统字体

