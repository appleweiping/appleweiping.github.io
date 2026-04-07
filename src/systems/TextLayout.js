/**
 * 自定义文本排版系统
 * 实现字符级精细控制的排版引擎
 * 核心逻辑：Canvas 度量 + 用户态换行 + 参数化渲染
 */

import Math2D from '../utils/math.js';

export class TextLayout {
  constructor(text = '', maxWidth = 600, options = {}) {
    this.text = text;
    this.maxWidth = maxWidth;
    
    // 配置
    this.font = options.font || '18px "Segoe UI", Arial, sans-serif';
    this.fontColor = options.color || '#111827';
    this.lineHeight = options.lineHeight || 1.5;
    this.alignment = options.alignment || 'left';  // left, center, right
    this.letterSpacing = options.letterSpacing || 0;
    
    // 测量值 (计算结果)
    this.lines = [];  // [{text, width, y, chars: []}]
    this.characters = [];  // 所有字符的信息
    this.totalHeight = 0;
    this.totalWidth = 0;
    
    // 动画状态
    this.animations = {};  // 字符级动画
    this.breathingPhase = 0;
    this.scrollDelay = {};  // 字符的延迟进度
    this.wavePhase = 0;
    
    // 是否需要重新测量
    this.dirty = true;
  }
  
  /**
   * 设置文本内容
   */
  setText(text) {
    if (this.text !== text) {
      this.text = text;
      this.dirty = true;
    }
  }
  
  /**
   * Canvas 度量与排版计算
   */
  measure(ctx = null) {
    if (!this.dirty) return;
    
    // 获取或创建临时Canvas
    let tempCanvas, tempCtx;
    if (!ctx) {
      tempCanvas = document.createElement('canvas');
      tempCtx = tempCanvas.getContext('2d');
    } else {
      tempCtx = ctx;
    }
    
    tempCtx.font = this.font;
    
    // 重置
    this.lines = [];
    this.characters = [];
    let currentLine = { text: '', width: 0, chars: [] };
    let x = 0;
    let y = 0;
    let charIndex = 0;
    
    // 逐字处理
    const words = this.text.split(' ');
    
    for (let wordIdx = 0; wordIdx < words.length; wordIdx++) {
      const word = words[wordIdx];
      const isLastWord = wordIdx === words.length - 1;
      
      for (let charIdx = 0; charIdx < word.length; charIdx++) {
        const char = word[charIdx];
        const charWidth = tempCtx.measureText(char).width + this.letterSpacing;
        
        // 检查是否需要换行
        if (x + charWidth > this.maxWidth && x > 0) {
          // 保存当前行
          this.lines.push({ ...currentLine, width: x });
          
          // 开始新行
          currentLine = { text: '', width: 0, chars: [] };
          x = 0;
          y += this.lineHeight * 25;  // 约25px行高
        }
        
        // 添加字符
        currentLine.text += char;
        currentLine.chars.push({
          char,
          index: charIndex,
          x,
          width: charWidth,
          opacity: 1,
          scale: 1,
          offsetY: 0,
          offsetX: 0
        });
        
        this.characters.push({
          char,
          lineIdx: this.lines.length,
          x: x,
          y: y,
          width: charWidth,
          opacity: 1,
          scale: 1,
          velocity: 0,
          delay: 0
        });
        
        x += charWidth;
        charIndex++;
      }
      
      // 添加空格 (除了最后一个单词)
      if (!isLastWord) {
        const spaceWidth = tempCtx.measureText(' ').width + this.letterSpacing;
        
        if (x + spaceWidth > this.maxWidth) {
          this.lines.push({ ...currentLine, width: x });
          currentLine = { text: ' ', width: spaceWidth, chars: [] };
          x = spaceWidth;
          y += this.lineHeight * 25;
        } else {
          currentLine.text += ' ';
          currentLine.width = x + spaceWidth;
          x += spaceWidth;
        }
      }
    }
    
    // 保存最后一行
    if (currentLine.text.length > 0) {
      this.lines.push({ ...currentLine, width: x });
    }
    
    // 计算总高度和宽度
    this.totalHeight = y + this.lineHeight * 25;
    this.totalWidth = Math.max(...this.lines.map(l => l.width), 0);
    
    this.dirty = false;
  }
  
  /**
   * 应用呼吸式透明度动画
   */
  applyBreathingAnimation(phase, amplitude = 0.15) {
    this.breathingPhase = phase;
    this.characters.forEach((char, idx) => {
      const breathing = Math.sin(phase + idx * 0.15) * amplitude;
      char.opacity = 0.85 + breathing;
    });
  }
  
  /**
   * 应用滚动延迟效果
   */
  applyScrollDelay(scrollProgress) {
    this.characters.forEach((char, idx) => {
      // 逐个字符延迟
      const delayFactor = 0.02;  // 每个字符延迟因子
      const charDelay = Math.max(0, scrollProgress - idx * delayFactor);
      
      char.delay = charDelay;
      
      // 使用延迟产生位移效果
      if (charDelay < 1) {
        const eased = charDelay * charDelay;  // 平方缓动
        char.offsetY = (1 - eased) * 15;  // 从下方浮上来
        char.opacity = eased;
      }
    });
  }
  
  /**
   * 应用波浪效应
   */
  applyWaveAnimation(wavePhase, waveAmplitude = 3) {
    this.wavePhase = wavePhase;
    this.characters.forEach((char, idx) => {
      const wave = Math.sin(wavePhase + idx * 0.3) * waveAmplitude;
      char.offsetY = (char.offsetY || 0) + wave;
    });
  }
  
  /**
   * 应用随机抖动 (打字效果)
   */
  applyJitterAnimation(jitterStrength = 1.5) {
    this.characters.forEach((char, idx) => {
      const jitter = (Math.random() - 0.5) * jitterStrength;
      char.offsetX = jitter;
      char.offsetY = (char.offsetY || 0) + (Math.random() - 0.5) * jitterStrength;
    });
  }
  
  /**
   * 渲染全部文本
   */
  render(ctx, baseX = 0, baseY = 0) {
    if (!ctx) return;
    
    ctx.save();
    ctx.font = this.font;
    ctx.fillStyle = this.fontColor;
    
    // 渲染每个字符
    this.characters.forEach(char => {
      ctx.save();
      
      // 应用透明度和缩放
      ctx.globalAlpha = Math.max(0, char.opacity);
      
      const renderX = baseX + char.x + char.offsetX;
      const renderY = baseY + char.y + 20 + char.offsetY;  // +20 基线偏移
      
      ctx.translate(renderX, renderY);
      ctx.scale(char.scale || 1, char.scale || 1);
      ctx.translate(-(renderX), -(renderY));
      
      ctx.fillText(char.char, renderX, renderY);
      ctx.restore();
    });
    
    ctx.restore();
  }
  
  /**
   * 渲染行为单位的文本 (更高效)
   */
  renderLines(ctx, baseX = 0, baseY = 0) {
    if (!ctx) return;
    
    ctx.save();
    ctx.font = this.font;
    ctx.fillStyle = this.fontColor;
    
    this.lines.forEach((line, lineIdx) => {
      let lineX = baseX;
      
      // 计算对齐偏移
      if (this.alignment === 'center') {
        lineX = baseX + (this.maxWidth - line.width) / 2;
      } else if (this.alignment === 'right') {
        lineX = baseX + (this.maxWidth - line.width);
      }
      
      const lineY = baseY + lineIdx * this.lineHeight * 25;
      
      ctx.fillText(line.text, lineX, lineY);
    });
    
    ctx.restore();
  }
  
  /**
   * 获取特定字符的信息
   */
  getCharAt(index) {
    return this.characters[index] || null;
  }
  
  /**
   * 获取行的信息
   */
  getLineAt(index) {
    return this.lines[index] || null;
  }
  
  /**
   * 清空所有动画状态
   */
  resetAnimations() {
    this.characters.forEach(char => {
      char.opacity = 1;
      char.scale = 1;
      char.offsetX = 0;
      char.offsetY = 0;
      char.velocity = 0;
      char.delay = 0;
    });
  }
}

export default TextLayout;
