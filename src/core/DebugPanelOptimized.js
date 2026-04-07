/**
 * Simple on-canvas debug panel.
 */

export class DebugPanelOptimized {
  constructor(scene) {
    this.scene = scene;
    this.visible = Boolean(typeof window !== 'undefined' && window.__DEBUG_HERO_SCENE__ === true);
    this.metrics = {
      fps: 0,
      frameTime: 0,
      updateTime: 0,
      renderTime: 0,
      particleCount: 0,
      characterPos: { x: 0, y: 0 },
      mousePos: { x: 0, y: 0 },
      scrollProgress: 0
    };
  }

  update() {
    const state = this.scene.getState();
    this.metrics.fps = state.fps;
    this.metrics.frameTime = state.performance.frameTime || 16.67;
    this.metrics.updateTime = state.performance.updateTime;
    this.metrics.renderTime = state.performance.renderTime;
    this.metrics.particleCount =
      this.scene.background.midLayer.getActiveCount() +
      this.scene.background.nearLayer.getActiveCount();
    this.metrics.characterPos = {
      x: this.scene.character.x,
      y: this.scene.character.y
    };
    this.metrics.mousePos = state.input.mouse;
    this.metrics.scrollProgress = state.input.scroll.progress;
  }

  render(ctx) {
    if (!this.visible) return;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 300, 220);

    ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 300, 220);

    ctx.fillStyle = '#00ff99';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('Debug Panel', 20, 28);

    ctx.fillStyle = '#00ccff';
    ctx.font = '11px monospace';

    let y = 50;
    const lineHeight = 16;
    const metrics = [
      `FPS: ${this.metrics.fps}`,
      `Frame: ${this.metrics.frameTime.toFixed(2)}ms`,
      `Update: ${this.metrics.updateTime.toFixed(2)}ms`,
      `Render: ${this.metrics.renderTime.toFixed(2)}ms`,
      `Particles: ${this.metrics.particleCount}`,
      `Char Pos: (${this.metrics.characterPos.x.toFixed(0)}, ${this.metrics.characterPos.y.toFixed(0)})`,
      `Mouse: (${this.metrics.mousePos.x.toFixed(0)}, ${this.metrics.mousePos.y.toFixed(0)})`,
      `Scroll: ${(this.metrics.scrollProgress * 100).toFixed(1)}%`,
      `Time: ${this.scene.time.toFixed(2)}s`
    ];

    metrics.forEach((metric, index) => {
      ctx.fillText(metric, 20, y + index * lineHeight);
    });

    ctx.fillStyle = 'rgba(0, 200, 100, 0.6)';
    ctx.font = '10px monospace';
    ctx.fillText('Space: Pause | D: Toggle panel', 20, y + metrics.length * lineHeight + 10);
    ctx.restore();
  }

  toggle() {
    this.visible = !this.visible;
  }
}

export default DebugPanelOptimized;
