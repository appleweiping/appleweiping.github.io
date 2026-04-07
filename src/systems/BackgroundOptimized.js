/**
 * Layered background system with cached gradients and adaptive particle budgets.
 */

import ParticleSystemOptimized from './ParticleSystemOptimized.js';

export class BackgroundOptimized {
  constructor(width, height, options = {}) {
    this.width = width;
    this.height = height;
    this.quality = {
      blurValue: options.blurValue ?? 2,
      enableBlur: options.enableBlur ?? true,
      midParticleCount: options.midParticleCount ?? 40,
      nearParticleCount: options.nearParticleCount ?? 60
    };

    this.sky = {
      colors: ['#e8ddf7', '#d4c5ff', '#c8b3ff', '#b8a0e8'],
      hueShift: 0,
      animation: true
    };

    this.skyGradient = null;
    this.skyOverlayGradient = null;
    this.gradientHeight = 0;

    this.midLayer = new ParticleSystemOptimized(Math.max(this.quality.midParticleCount, 1));
    this.midLayer.parallaxRatio = 0.5;
    this.midLayer.opacity = 0.25;
    this.midLayer.blurValue = this.quality.blurValue;
    this.midLayerOffsetX = 0;
    this.midLayerOffsetY = 0;

    this.nearLayer = new ParticleSystemOptimized(Math.max(this.quality.nearParticleCount, 1));
    this.nearLayer.parallaxRatio = 1.0;
    this.nearLayer.opacity = 0.4;
    this.nearLayerOffsetX = 0;
    this.nearLayerOffsetY = 0;

    this.initParticles();
  }

  initParticles() {
    this.midLayer.clear();
    this.nearLayer.clear();

    for (let i = 0; i < this.quality.midParticleCount; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 20 + Math.random() * 60;
      this.midLayer.emit(
        x,
        y,
        Math.random() * 5 - 2.5,
        Math.random() * 2 - 1,
        Infinity,
        size,
        'rgba(200, 180, 255, 0.1)'
      );
    }

    for (let i = 0; i < this.quality.nearParticleCount; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 1.5 + Math.random() * 4;
      this.nearLayer.emit(
        x,
        y,
        Math.random() * 3 - 1.5,
        Math.random() * 3 - 1.5,
        Infinity,
        size,
        'rgba(255, 240, 200, 0.6)'
      );
    }
  }

  ensureGradients(ctx) {
    if (this.skyGradient && this.skyOverlayGradient && this.gradientHeight === this.height) {
      return;
    }

    const base = ctx.createLinearGradient(0, 0, 0, this.height);
    const overlay = ctx.createLinearGradient(0, 0, 0, this.height);
    const colors = this.sky.colors;

    colors.forEach((color, index) => {
      const stop = index / (colors.length - 1);
      base.addColorStop(stop, color);
      overlay.addColorStop(stop, colors[colors.length - 1 - index]);
    });

    this.skyGradient = base;
    this.skyOverlayGradient = overlay;
    this.gradientHeight = this.height;
  }

  update(deltaTime, scrollProgress, mouseNorm) {
    if (this.sky.animation) {
      this.sky.hueShift += deltaTime * 0.05;
    }

    const mouse = mouseNorm || { x: 0, y: 0 };
    this.midLayerOffsetX = mouse.x * this.midLayer.parallaxRatio * 30;
    this.midLayerOffsetY = mouse.y * this.midLayer.parallaxRatio * 20;
    this.nearLayerOffsetX = mouse.x * this.nearLayer.parallaxRatio * 30;
    this.nearLayerOffsetY = mouse.y * this.nearLayer.parallaxRatio * 20;

    this.midLayer.update(deltaTime, 0.5);
    this.nearLayer.update(deltaTime, 1.0);
    this.wrapParticles();
    this.scrollProgress = scrollProgress || 0;
  }

  wrapParticles() {
    const wrapLayer = (particles) => {
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        if (particle.x < -100) particle.x = this.width + 100;
        if (particle.x > this.width + 100) particle.x = -100;
        if (particle.y < -100) particle.y = this.height + 100;
        if (particle.y > this.height + 100) particle.y = -100;
      }
    };

    wrapLayer(this.midLayer.particles);
    wrapLayer(this.nearLayer.particles);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.skyGradient = null;
    this.skyOverlayGradient = null;
    this.gradientHeight = 0;
    this.initParticles();
  }

  render(ctx, scrollProgress = 0) {
    this.renderSkyGradient(ctx, scrollProgress);

    ctx.save();
    if (this.quality.enableBlur && this.midLayer.blurValue > 0) {
      ctx.filter = `blur(${this.midLayer.blurValue}px)`;
    }
    ctx.globalAlpha = this.midLayer.opacity;
    ctx.translate(this.midLayerOffsetX, this.midLayerOffsetY);
    this.midLayer.render(ctx);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = this.nearLayer.opacity;
    ctx.translate(this.nearLayerOffsetX, this.nearLayerOffsetY);
    this.nearLayer.render(ctx);
    ctx.restore();
  }

  renderSkyGradient(ctx, scrollProgress = 0) {
    this.ensureGradients(ctx);

    ctx.fillStyle = this.skyGradient;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.globalAlpha = 0.08 + Math.min(0.12, scrollProgress * 0.12 + Math.sin(this.sky.hueShift) * 0.02);
    ctx.fillStyle = this.skyOverlayGradient;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }

  setOpacity(opacity) {
    this.midLayer.opacity = opacity * 0.25;
    this.nearLayer.opacity = opacity * 0.4;
  }
}

export default BackgroundOptimized;
