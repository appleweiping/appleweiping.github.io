/**
 * Main canvas scene coordinator with adaptive quality, cleanup, and runtime guards.
 */

import InputManagerOptimized from '../interaction/InputManagerOptimized.js';
import AnimationController from '../interaction/AnimationController.js';
import BackgroundOptimized from '../systems/BackgroundOptimized.js';
import CharacterOptimized from '../systems/CharacterOptimized.js';
import TextLayoutOptimized from '../systems/TextLayoutOptimized.js';
import DebugPanelOptimized from './DebugPanelOptimized.js';

const SCENE_CONFIG = {
  maxFrameDelta: 0.033,
  mobileBreakpoint: 768,
  keyToggleDebug: 'd'
};

export class HeroSceneOptimized {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
    if (!this.ctx) {
      throw new Error('Canvas 2D context is unavailable in this browser.');
    }

    this.quality = this.detectQualityProfile();
    this.width = canvas.width;
    this.height = canvas.height;
    this.dpr = this.getEffectiveDpr();
    this.setupCanvasSize();
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    this.time = 0;
    this.deltaTime = 0;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.fps = 0;
    this.fpsUpdateTime = 0;

    this.performanceData = {
      frameTime: 0,
      renderTime: 0,
      updateTime: 0,
      frameDropped: false
    };

    this.input = new InputManagerOptimized(canvas);
    this.animation = new AnimationController();
    this.background = new BackgroundOptimized(this.width, this.height, this.quality.background);
    this.character = new CharacterOptimized(this.width * 0.75, this.height * 0.52, 1.2);

    this.titleText = new TextLayoutOptimized('Weiping Yan', Math.min(320, this.width * 0.45), {
      font: 'bold 48px "Segoe UI", Arial, sans-serif',
      color: '#111827'
    });
    this.titleText.measure(this.ctx);

    this.subtitleText = new TextLayoutOptimized(
      'AI for Science | Foundation Models | Analog Circuit Design',
      Math.min(420, this.width * 0.6),
      {
        font: '18px "Segoe UI", Arial, sans-serif',
        color: '#374151'
      }
    );
    this.subtitleText.measure(this.ctx);

    this.debugPanel = new DebugPanelOptimized(this);
    this.isRunning = false;
    this.isPaused = false;
    this.isDestroyed = false;
    this.rafId = 0;
    this.resizeFrame = 0;

    this.handleResize = this.scheduleResize.bind(this);
    this.handleVisibilityChange = this.onVisibilityChange.bind(this);
    this.handleKeyDown = this.onKeyDown.bind(this);
    this.renderLoop = this.renderLoop.bind(this);

    this.bindEvents();
    this.start();
  }

  detectQualityProfile() {
    const supportsMatchMedia = typeof window.matchMedia === 'function';
    const reducedMotion = supportsMatchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = supportsMatchMedia && window.matchMedia('(pointer: coarse)').matches;
    const isMobile = coarsePointer || window.innerWidth <= SCENE_CONFIG.mobileBreakpoint;
    const lowPower = reducedMotion || isMobile;

    return {
      reducedMotion,
      isMobile,
      maxDpr: lowPower ? 1.5 : 2,
      background: {
        enableBlur: !lowPower,
        blurValue: lowPower ? 0 : 2,
        midParticleCount: lowPower ? 20 : 40,
        nearParticleCount: lowPower ? 35 : 60
      }
    };
  }

  getEffectiveDpr() {
    return Math.min(window.devicePixelRatio || 1, this.quality.maxDpr);
  }

  setupCanvasSize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, Math.round(rect.width));
    this.height = Math.max(1, Math.round(rect.height));
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  bindEvents() {
    window.addEventListener('resize', this.handleResize, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  onVisibilityChange() {
    if (document.hidden) {
      this.isPaused = true;
      return;
    }

    this.isPaused = false;
    this.lastFrameTime = performance.now();
  }

  onKeyDown(event) {
    if (event.key === ' ') {
      event.preventDefault();
      this.isPaused = !this.isPaused;
      return;
    }

    if (event.key.toLowerCase() === SCENE_CONFIG.keyToggleDebug) {
      this.debugPanel.toggle();
    }
  }

  scheduleResize() {
    if (this.resizeFrame) {
      return;
    }

    this.resizeFrame = window.requestAnimationFrame(() => {
      this.resizeFrame = 0;
      this.onWindowResize();
    });
  }

  start() {
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.renderLoop();
  }

  stop() {
    this.isRunning = false;

    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  renderLoop() {
    if (!this.isRunning) return;

    const frameStart = performance.now();

    try {
      const now = performance.now();

      if (!this.isPaused) {
        const updateStart = performance.now();
        this.deltaTime = Math.min((now - this.lastFrameTime) / 1000, SCENE_CONFIG.maxFrameDelta);
        this.time += this.deltaTime;
        this.lastFrameTime = now;
        this.update(this.deltaTime);
        this.performanceData.updateTime = performance.now() - updateStart;
      }

      const renderStart = performance.now();
      this.render();
      this.performanceData.renderTime = performance.now() - renderStart;

      this.frameCount++;
      if (now - this.fpsUpdateTime >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.fpsUpdateTime = now;
        this.performanceData.frameDropped = this.fps < 50;

        if (this.performanceData.frameDropped) {
          console.warn(`FPS DROP: ${this.fps} fps`);
        }
      }
    } catch (error) {
      this.handleRuntimeError(error);
      return;
    }

    this.performanceData.frameTime = performance.now() - frameStart;
    this.rafId = window.requestAnimationFrame(this.renderLoop);
  }

  handleRuntimeError(error) {
    this.stop();
    console.error('HeroScene runtime error:', error);

    const hero = this.canvas.parentElement;
    if (hero && !hero.querySelector('.hero-fallback')) {
      const fallback = document.createElement('p');
      fallback.className = 'hero-fallback';
      fallback.textContent = 'Animation paused because of a runtime error. The rest of the page remains available.';
      hero.appendChild(fallback);
    }
  }

  update(deltaTime) {
    const inputState = this.input.getState();

    this.animation.update(performance.now());
    this.background.update(deltaTime, inputState.scroll.progress, inputState.mouse.norm);
    this.character.update(deltaTime, inputState, inputState.scroll.progress);

    this.titleText.applyBreathingAnimation(this.time * 0.5, 0.08);
    this.titleText.applyScrollDelay(inputState.scroll.progress);

    this.subtitleText.applyBreathingAnimation(this.time * 0.3, 0.06);
    this.subtitleText.applyScrollDelay(inputState.scroll.progress * 0.9);
  }

  render() {
    const inputState = this.input.getState();

    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.background.render(this.ctx, inputState.scroll.progress);
    this.renderTextLayer();
    this.character.render(this.ctx);

    this.debugPanel.update();
    this.debugPanel.render(this.ctx);
  }

  renderTextLayer() {
    const padding = 40;

    this.ctx.save();
    this.ctx.globalAlpha = 0.95;
    this.titleText.render(this.ctx, padding, 60);
    this.ctx.restore();

    this.ctx.save();
    this.ctx.globalAlpha = 0.85;
    this.subtitleText.render(this.ctx, padding, 130);
    this.ctx.restore();
  }

  onWindowResize() {
    this.dpr = this.getEffectiveDpr();
    this.setupCanvasSize();
    this.input.refreshBounds();
    this.background.resize(this.width, this.height);
    this.character.x = this.width * 0.75;
    this.character.y = this.height * 0.52;

    this.titleText.maxWidth = Math.min(320, this.width * 0.45);
    this.subtitleText.maxWidth = Math.min(420, this.width * 0.6);
    this.titleText.dirty = true;
    this.subtitleText.dirty = true;
    this.titleText.measure(this.ctx);
    this.subtitleText.measure(this.ctx);
  }

  destroy() {
    if (this.isDestroyed) {
      return;
    }

    this.isDestroyed = true;
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('keydown', this.handleKeyDown);
    this.input.destroy();

    if (this.resizeFrame) {
      window.cancelAnimationFrame(this.resizeFrame);
      this.resizeFrame = 0;
    }
  }

  getState() {
    return {
      time: this.time,
      deltaTime: this.deltaTime,
      fps: this.fps,
      isPaused: this.isPaused,
      performance: { ...this.performanceData },
      input: this.input.getState()
    };
  }
}

export default HeroSceneOptimized;
