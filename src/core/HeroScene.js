/**
 * HeroScene - 主协调器
 * 统一管理时间、子系统渲染与交互
 */

import Math2D from '../utils/math.js';
import InputManager from '../interaction/InputManager.js';
import AnimationController from '../interaction/AnimationController.js';
import BackgroundSystem from '../systems/Background.js';
import Character from '../systems/Character.js';
import TextLayout from '../systems/TextLayout.js';
import DebugPanel from './DebugPanel.js';

export class HeroScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
    this.width = canvas.width;
    this.height = canvas.height;
    this.dpr = window.devicePixelRatio || 1;
    
    // 调整 Canvas 分辨率
    canvas.width = this.width * this.dpr;
    canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    
    // 全局时间与状态
    this.time = 0;
    this.deltaTime = 0;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.fps = 0;
    this.fpsUpdateTime = 0;
    
    // 性能监控
    this.performanceData = {
      renderTime: 0,
      updateTime: 0,
      frameDropped: false
    };
    
    // 初始化子系统
    this.input = new InputManager(canvas);
    this.animation = new AnimationController();
    this.background = new BackgroundSystem(this.width, this.height);
    
    // 初始化角色 (在画布右侧)
    this.character = new Character(
      this.width * 0.75,  // x 位置
      this.height * 0.52,  // y 位置
      1.2  // 缩放
    );
    
    // 初始化文本布局 (左侧主文本)
    this.titleText = new TextLayout(
      'Weiping Yan',
      300,
      {
        font: 'bold 48px "Segoe UI", Arial, sans-serif',
        color: '#111827'
      }
    );
    this.titleText.measure(this.ctx);
    
    // 副标题文本
    this.subtitleText = new TextLayout(
      'AI for Science | Foundation Models | Analog Circuit Design',
      380,
      {
        font: '18px "Segoe UI", Arial, sans-serif',
        color: '#374151'
      }
    );
    this.subtitleText.measure(this.ctx);
    
    // 初始化调试面板
    this.debugPanel = new DebugPanel(this);
    
    // 运行状态
    this.isRunning = false;
    this.isPaused = false;
    
    this.bindEvents();
    this.start();
  }
  
  /**
   * 绑定事件
   */
  bindEvents() {
    // 窗口大小改变
    window.addEventListener('resize', () => this.onWindowResize());
    
    // 可见性改变 (Tab 切换)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isPaused = true;
      } else {
        this.isPaused = false;
        this.lastFrameTime = performance.now();
      }
    });
    
    // 键盘控制 (调试)
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        this.isPaused = !this.isPaused;
      }
    });
  }
  
  /**
   * 启动渲染循环
   */
  start() {
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.renderLoop();
  }
  
  /**
   * 停止渲染循环
   */
  stop() {
    this.isRunning = false;
  }
  
  /**
   * 主渲染循环
   */
  renderLoop() {
    if (!this.isRunning) return;
    
    const now = performance.now();
    
    // 更新逻辑
    if (!this.isPaused) {
      const updateStart = performance.now();
      
      this.deltaTime = Math.min((now - this.lastFrameTime) / 1000, 0.033);
      this.time += this.deltaTime;
      this.lastFrameTime = now;
      
      // 更新子系统
      this.update(this.deltaTime);
      
      this.performanceData.updateTime = performance.now() - updateStart;
    }
    
    // 渲染
    const renderStart = performance.now();
    this.render();
    this.performanceData.renderTime = performance.now() - renderStart;
    
    // FPS 计算
    this.frameCount++;
    if (now - this.fpsUpdateTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsUpdateTime = now;
      
      // 性能警告
      if (this.fps < 50) {
        console.warn(`⚠️ FPS DROP: ${this.fps} fps`);
        this.performanceData.frameDropped = true;
      } else {
        this.performanceData.frameDropped = false;
      }
    }
    
    requestAnimationFrame(() => this.renderLoop());
  }
  
  /**
   * 更新子系统状态
   */
  update(deltaTime) {
    // 更新输入
    const inputState = this.input.getState();
    
    // 更新动画控制器
    this.animation.update(performance.now());
    
    // 更新背景
    this.background.update(
      deltaTime,
      inputState.scroll.progress,
      inputState.mouse.norm
    );
    
    // 更新角色
    this.character.update(deltaTime, inputState, inputState.scroll.progress);
    
    // 更新文本动画
    this.titleText.applyBreathingAnimation(this.time * 0.5, 0.08);
    this.titleText.applyScrollDelay(inputState.scroll.progress);
    
    this.subtitleText.applyBreathingAnimation(this.time * 0.3, 0.06);
    this.subtitleText.applyScrollDelay(inputState.scroll.progress * 0.9);
  }
  
  /**
   * 渲染所有元素
   */
  render() {
    const inputState = this.input.getState();
    
    // 清空画布
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // 渲染背景
    this.background.render(this.ctx, inputState.scroll.progress);
    
    // 渲染文本 (在角色后面，建立分层)
    this.renderTextLayer();
    
    // 渲染角色
    this.character.render(this.ctx);
    
    // 更新并渲染调试面板
    this.debugPanel.update();
    this.debugPanel.render(this.ctx);
    
    // 调试信息 (开发环境)
    const DEBUG_MODE = typeof window !== 'undefined' && window.__DEBUG_HERO_SCENE__ === true;
    if (DEBUG_MODE && false) {  // false to disable renderDebugInfo
      this.renderDebugInfo();
    }
  }
  
  /**
   * 渲染文本层
   */
  renderTextLayer() {
    const padding = 40;
    
    // 标题
    this.ctx.save();
    this.ctx.globalAlpha = 0.95;
    this.titleText.render(this.ctx, padding, 60);
    this.ctx.restore();
    
    // 副标题
    this.ctx.save();
    this.ctx.globalAlpha = 0.85;
    this.subtitleText.render(this.ctx, padding, 130);
    this.ctx.restore();
  }
  
  /**
   * 渲染调试信息
   */
  renderDebugInfo() {
    this.ctx.save();
    this.ctx.fillStyle = '#333';
    this.ctx.font = '12px monospace';
    this.ctx.globalAlpha = 0.7;
    
    let y = 20;
    const x = 15;
    const lineHeight = 16;
    
    const debugLines = [
      `FPS: ${this.fps}`,
      `Time: ${this.time.toFixed(2)}s`,
      `Particles: ${this.background.midLayer.getActiveCount() + this.background.nearLayer.getActiveCount()}`,
      `Update: ${this.performanceData.updateTime.toFixed(2)}ms`,
      `Render: ${this.performanceData.renderTime.toFixed(2)}ms`,
      `Paused: ${this.isPaused ? 'Yes' : 'No'}`
    ];
    
    debugLines.forEach((line, i) => {
      this.ctx.fillText(line, x, y + i * lineHeight);
    });
    
    this.ctx.restore();
  }
  
  /**
   * 窗口大小改变处理
   */
  onWindowResize() {
    // 重新计算 Canvas 大小
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    
    // 重新初始化背景系统
    this.background = new BackgroundSystem(this.width, this.height);
  }
  
  /**
   * 获取当前状态
   */
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

export default HeroScene;
