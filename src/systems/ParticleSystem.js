/**
 * 粒子系统
 * 管理大量粒子的生成、更新、渲染
 */

export class ParticleSystem {
  constructor(capacity = 500) {
    this.particles = [];
    this.capacity = capacity;
    this.emitCount = 0;
  }
  
  /**
   * 发射粒子
   */
  emit(x, y, vx, vy, lifetime, size, color, options = {}) {
    if (this.particles.length >= this.capacity) {
      this.particles.shift();  // 移除最旧的
    }
    
    this.particles.push({
      x, y,
      vx, vy,
      lifetime,
      maxLifetime: lifetime,
      size,
      color,
      opacity: 1,
      rotation: options.rotation || 0,
      rotationSpeed: options.rotationSpeed || 0,
      damping: options.damping || 0.98  // 速度衰减因子
    });
    
    this.emitCount++;
  }
  
  /**
   * 爆发发射 (圆形或扇形)
   */
  burst(x, y, count, speed, lifetime, size, color, options = {}) {
    const { 
      angle = 0,           // 起始角度
      spread = Math.PI * 2 // 角度范围
    } = options;
    
    for (let i = 0; i < count; i++) {
      const theta = angle + (spread / count) * i + (Math.random() - 0.5) * 0.3;
      const v = speed * (0.8 + Math.random() * 0.4);  // 随机速度
      const vx = Math.cos(theta) * v;
      const vy = Math.sin(theta) * v;
      
      this.emit(x, y, vx, vy, lifetime, size, color, options);
    }
  }
  
  /**
   * 更新所有粒子
   */
  update(deltaTime, gravity = 0) {
    this.particles = this.particles.filter(p => {
      // 位置更新
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      
      // 重力与空气阻力
      p.vy += gravity * deltaTime;
      p.vx *= p.damping;
      p.vy *= p.damping;
      
      // 生命周期
      p.lifetime -= deltaTime;
      p.opacity = Math.max(0, p.lifetime / p.maxLifetime);
      
      // 旋转
      if (p.rotationSpeed) {
        p.rotation += p.rotationSpeed * deltaTime;
      }
      
      return p.lifetime > 0;
    });
  }
  
  /**
   * 渲染所有粒子
   */
  render(ctx) {
    ctx.save();
    
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      
      ctx.translate(p.x, p.y);
      if (p.rotation) ctx.rotate(p.rotation);
      
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
    
    ctx.restore();
  }
  
  /**
   * 清空所有粒子
   */
  clear() {
    this.particles = [];
    this.emitCount = 0;
  }
  
  /**
   * 获取活跃粒子数
   */
  getActiveCount() {
    return this.particles.length;
  }
}

export default ParticleSystem;
