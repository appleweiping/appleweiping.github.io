/**
 * 分层背景系统
 * 远景(梯度) → 中景(雾气) → 近景(微光)
 */

import Math2D from '../utils/math.js';
import ParticleSystem from './ParticleSystem.js';

export class BackgroundSystem {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    
    // 远景配置
    this.sky = {
      colors: ['#e8ddf7', '#d4c5ff', '#c8b3ff', '#b8a0e8'],
      hueShift: 0,  // 动画色相偏移
      animation: true
    };
    
    // 中景 (雾气粒子)
    this.midLayer = new ParticleSystem(100);
    this.midLayer.parallaxRatio = 0.5;
    this.midLayer.opacity = 0.25;
    this.midLayer.blurValue = 2;
    this.midLayerOffsetX = 0;
    this.midLayerOffsetY = 0;
    
    // 近景 (微光粒子)
    this.nearLayer = new ParticleSystem(100);
    this.nearLayer.parallaxRatio = 1.0;
    this.nearLayer.opacity = 0.4;
    this.nearLayerOffsetX = 0;
    this.nearLayerOffsetY = 0;
    
    // 初始化粒子
    this.initParticles();
  }
  
  /**
   * 初始化静止背景粒子
   */
  initParticles() {
    // 中景：大型雾气粒子
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 20 + Math.random() * 60;
      const color = `rgba(200, 180, 255, 0.1)`;
      
      this.midLayer.emit(x, y, Math.random() * 5 - 2.5, Math.random() * 2 - 1, Infinity, size, color);
    }
    
    // 近景：小型微光粒子
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 1.5 + Math.random() * 4;
      const color = `rgba(255, 240, 200, 0.6)`;
      
      this.nearLayer.emit(x, y, Math.random() * 3 - 1.5, Math.random() * 3 - 1.5, Infinity, size, color);
    }
  }
  
  /**
   * 更新背景动画状态
   */
  update(deltaTime, scrollProgress, mouseNorm) {
    // 远景：色相动画
    if (this.sky.animation) {
      this.sky.hueShift += deltaTime * 0.05;  // 缓慢色相变化
    }
    
    // 中景与近景的视差偏移
    this.midLayerOffsetX = mouseNorm.x * this.midLayer.parallaxRatio * 30;
    this.midLayerOffsetY = mouseNorm.y * this.midLayer.parallaxRatio * 20;
    
    this.nearLayerOffsetX = mouseNorm.x * this.nearLayer.parallaxRatio * 30;
    this.nearLayerOffsetY = mouseNorm.y * this.nearLayer.parallaxRatio * 20;
    
    // 更新粒子物理
    this.midLayer.update(deltaTime, 0.5);  // 轻微重力
    this.nearLayer.update(deltaTime, 1.0);
    
    // 循环粒子位置
    this.wrapParticles();
  }
  
  /**
   * 粒子世界循环
   */
  wrapParticles() {
    [...this.midLayer.particles, ...this.nearLayer.particles].forEach(p => {
      if (p.x < -100) p.x = this.width + 100;
      if (p.x > this.width + 100) p.x = -100;
      if (p.y < -100) p.y = this.height + 100;
      if (p.y > this.height + 100) p.y = -100;
    });
  }
  
  /**
   * 渲染整个背景
   */
  render(ctx, scrollProgress) {
    // 1. 远景：梯度背景
    this.renderSkyGradient(ctx, scrollProgress);
    
    // 2. 中景：雾气 (模糊效果)
    ctx.save();
    ctx.filter = `blur(${this.midLayer.blurValue}px)`;
    ctx.globalAlpha = this.midLayer.opacity;
    ctx.translate(this.midLayerOffsetX, this.midLayerOffsetY);
    this.midLayer.render(ctx);
    ctx.restore();
    
    // 3. 近景：微光 (清晰)
    ctx.save();
    ctx.globalAlpha = this.nearLayer.opacity;
    ctx.translate(this.nearLayerOffsetX, this.nearLayerOffsetY);
    this.nearLayer.render(ctx);
    ctx.restore();
  }
  
  /**
   * 渲染梯度天空
   */
  renderSkyGradient(ctx, scrollProgress) {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    
    const colors = this.sky.colors;
    const numStops = colors.length;
    
    for (let i = 0; i < numStops; i++) {
      const position = i / (numStops - 1);
      // 色相随scrollProgress缓慢变化
      const offset = (scrollProgress * 0.2) % 1;
      const adjustedPos = (position + offset) % 1;
      
      const colorIdx = Math.floor(adjustedPos * (numStops - 1));
      gradient.addColorStop(adjustedPos, colors[colorIdx]);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
  }
  
  /**
   * 调整背景强度
   */
  setOpacity(opacity) {
    this.midLayer.opacity = opacity * 0.25;
    this.nearLayer.opacity = opacity * 0.4;
  }
}

export default BackgroundSystem;
