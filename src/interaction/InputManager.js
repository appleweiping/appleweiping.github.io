/**
 * 输入管理器
 * 捕获并缓冲鼠标、滚动、触摸等输入
 */

export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    
    // 鼠标状态
    this.mouse = {
      x: 0,
      y: 0,
      norm: { x: 0, y: 0 },  // 归一化 (-1 ~ 1)
      lastX: 0,
      lastY: 0,
      deltaX: 0,
      deltaY: 0,
      isMoving: false
    };
    
    // 滚动状态
    this.scroll = {
      y: 0,
      progress: 0,  // 0 - 1
      velocity: 0,
      direction: 0,  // 1: down, -1: up, 0: static
      lastTime: 0,
      lastY: 0
    };
    
    this.bindEvents();
  }
  
  bindEvents() {
    // 鼠标移动
    document.addEventListener('mousemove', (e) => {
      this.mouse.lastX = this.mouse.x;
      this.mouse.lastY = this.mouse.y;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      
      this.mouse.deltaX = this.mouse.x - this.mouse.lastX;
      this.mouse.deltaY = this.mouse.y - this.mouse.lastY;
      this.mouse.isMoving = true;
      
      // 归一化到 -1 ~ 1
      this.mouse.norm.x = (this.mouse.x / window.innerWidth) * 2 - 1;
      this.mouse.norm.y = (this.mouse.y / window.innerHeight) * 2 - 1;
      
      // 不活动计时器
      clearTimeout(this.mouseInactiveTimer);
      this.mouseInactiveTimer = setTimeout(() => {
        this.mouse.isMoving = false;
      }, 500);
    });
    
    // 滚动事件
    const updateScroll = () => {
      const now = performance.now();
      const dt = (now - this.scroll.lastTime) / 1000 || 0;
      this.scroll.lastTime = now;
      
      const prevY = this.scroll.y;
      this.scroll.y = window.scrollY;
      const deltaY = this.scroll.y - prevY;
      
      // 计算方向
      if (deltaY > 0) this.scroll.direction = 1;
      else if (deltaY < 0) this.scroll.direction = -1;
      else this.scroll.direction = 0;
      
      // 计算速度 (px/sec)
      this.scroll.velocity = deltaY / Math.max(dt, 0.001);
      
      // 计算进度 (0-1)
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      this.scroll.progress = maxScroll > 0 ? this.scroll.y / maxScroll : 0;
    };
    
    window.addEventListener('scroll', updateScroll, { passive: true });
    self.addEventListener('touchmove', updateScroll, { passive: true });
  }
  
  // 获取当前状态快照
  getState() {
    return {
      mouse: { ...this.mouse },
      scroll: { ...this.scroll }
    };
  }
  
  // 获取鼠标是否在某个矩形内
  isMouseInRect(x, y, w, h) {
    return this.mouse.x >= x &&
           this.mouse.x <= x + w &&
           this.mouse.y >= y &&
           this.mouse.y <= y + h;
  }
}

export default InputManager;
