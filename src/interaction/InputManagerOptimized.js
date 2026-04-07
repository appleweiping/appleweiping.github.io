/**
 * Input manager with requestAnimationFrame batched pointer updates
 * and cleanup support for scene teardown.
 */

export class InputManagerOptimized {
  constructor(canvas) {
    this.canvas = canvas;

    this.mouse = {
      x: 0,
      y: 0,
      norm: { x: 0, y: 0 },
      lastX: 0,
      lastY: 0,
      deltaX: 0,
      deltaY: 0,
      isMoving: false
    };

    this.scroll = {
      y: 0,
      progress: 0,
      velocity: 0,
      direction: 0,
      lastTime: 0
    };

    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    this.mouseInactiveTimer = 0;
    this.mouseFrame = 0;
    this.pendingMousePosition = null;

    this.bindEvents();
    this.updateScroll();
  }

  bindEvents() {
    this.handleMouseMove = (event) => {
      this.pendingMousePosition = {
        x: event.clientX,
        y: event.clientY
      };

      if (!this.mouseFrame) {
        this.mouseFrame = window.requestAnimationFrame(() => {
          this.mouseFrame = 0;
          this.applyMousePosition();
        });
      }
    };

    this.handleTouchMove = (event) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      this.handleMouseMove(touch);
      this.updateScroll();
    };

    this.handleResize = () => {
      this.refreshBounds();
      this.updateScroll();
    };

    document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    window.addEventListener('scroll', this.updateScroll, { passive: true });
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  applyMousePosition() {
    if (!this.pendingMousePosition) {
      return;
    }

    const { x, y } = this.pendingMousePosition;
    this.pendingMousePosition = null;

    this.mouse.lastX = this.mouse.x;
    this.mouse.lastY = this.mouse.y;
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouse.deltaX = this.mouse.x - this.mouse.lastX;
    this.mouse.deltaY = this.mouse.y - this.mouse.lastY;
    this.mouse.isMoving = true;

    const safeWidth = Math.max(this.viewportWidth, 1);
    const safeHeight = Math.max(this.viewportHeight, 1);
    this.mouse.norm.x = (this.mouse.x / safeWidth) * 2 - 1;
    this.mouse.norm.y = (this.mouse.y / safeHeight) * 2 - 1;

    window.clearTimeout(this.mouseInactiveTimer);
    this.mouseInactiveTimer = window.setTimeout(() => {
      this.mouse.isMoving = false;
    }, 500);
  }

  updateScroll = () => {
    const now = performance.now();
    const dt = (now - this.scroll.lastTime) / 1000 || 0;
    this.scroll.lastTime = now;

    const previousY = this.scroll.y;
    this.scroll.y = window.scrollY;
    const deltaY = this.scroll.y - previousY;

    if (deltaY > 0) this.scroll.direction = 1;
    else if (deltaY < 0) this.scroll.direction = -1;
    else this.scroll.direction = 0;

    this.scroll.velocity = deltaY / Math.max(dt, 0.001);

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.scroll.progress = maxScroll > 0 ? this.scroll.y / maxScroll : 0;
  };

  refreshBounds() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
  }

  getState() {
    return {
      mouse: { ...this.mouse },
      scroll: { ...this.scroll }
    };
  }

  isMouseInRect(x, y, w, h) {
    return this.mouse.x >= x &&
      this.mouse.x <= x + w &&
      this.mouse.y >= y &&
      this.mouse.y <= y + h;
  }

  destroy() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('scroll', this.updateScroll);
    window.removeEventListener('resize', this.handleResize);
    window.clearTimeout(this.mouseInactiveTimer);

    if (this.mouseFrame) {
      window.cancelAnimationFrame(this.mouseFrame);
      this.mouseFrame = 0;
    }
  }
}

export default InputManagerOptimized;
