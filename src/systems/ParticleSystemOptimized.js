/**
 * Particle system with bounded storage and in-place updates.
 */

export class ParticleSystemOptimized {
  constructor(capacity = 500) {
    this.particles = [];
    this.capacity = capacity;
    this.emitCount = 0;
    this.overflowIndex = 0;
  }

  emit(x, y, vx, vy, lifetime, size, color, options = {}) {
    const particle = {
      x,
      y,
      vx,
      vy,
      lifetime,
      maxLifetime: lifetime,
      size,
      color,
      opacity: 1,
      rotation: options.rotation || 0,
      rotationSpeed: options.rotationSpeed || 0,
      damping: options.damping || 0.98
    };

    if (this.particles.length >= this.capacity) {
      this.particles[this.overflowIndex] = particle;
      this.overflowIndex = (this.overflowIndex + 1) % this.capacity;
    } else {
      this.particles.push(particle);
    }

    this.emitCount++;
  }

  burst(x, y, count, speed, lifetime, size, color, options = {}) {
    const {
      angle = 0,
      spread = Math.PI * 2
    } = options;

    for (let i = 0; i < count; i++) {
      const theta = angle + (spread / count) * i + (Math.random() - 0.5) * 0.3;
      const velocity = speed * (0.8 + Math.random() * 0.4);
      const vx = Math.cos(theta) * velocity;
      const vy = Math.sin(theta) * velocity;
      this.emit(x, y, vx, vy, lifetime, size, color, options);
    }
  }

  update(deltaTime, gravity = 0) {
    let index = this.particles.length;
    while (index--) {
      const particle = this.particles[index];

      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.vy += gravity * deltaTime;
      particle.vx *= particle.damping;
      particle.vy *= particle.damping;

      if (Number.isFinite(particle.lifetime)) {
        particle.lifetime -= deltaTime;
        particle.opacity = Math.max(0, particle.lifetime / particle.maxLifetime);
      } else {
        particle.opacity = 1;
      }

      if (particle.rotationSpeed) {
        particle.rotation += particle.rotationSpeed * deltaTime;
      }

      if (particle.lifetime <= 0) {
        const lastIndex = this.particles.length - 1;
        this.particles[index] = this.particles[lastIndex];
        this.particles.pop();
      }
    }
  }

  render(ctx) {
    ctx.save();

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      if (particle.opacity <= 0) {
        continue;
      }

      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  clear() {
    this.particles.length = 0;
    this.emitCount = 0;
    this.overflowIndex = 0;
  }

  getActiveCount() {
    return this.particles.length;
  }
}

export default ParticleSystemOptimized;
