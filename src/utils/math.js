/**
 * 数学与插值工具
 * 支持向量操作、缓动函数、噪声生成
 */

export const Math2D = {
  // 向量操作
  vec2: (x = 0, y = 0) => ({ x, y }),
  
  add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y }),
  sub: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y }),
  scale: (v, s) => ({ x: v.x * s, y: v.y * s }),
  dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y,
  length: (v) => Math.sqrt(v.x * v.x + v.y * v.y),
  normalize: (v) => {
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    return len > 0 ? { x: v.x / len, y: v.y / len } : { x: 0, y: 0 };
  },
  
  // 线性插值
  lerp: (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t)),
  
  // 平滑缓动 (Smoothstep)
  smoothstep: (t) => {
    t = Math.max(0, Math.min(1, t));
    return t * t * (3 - 2 * t);
  },
  
  // 阻尼缓动 (二阶系统)
  dampedLerp: (current, target, deltaTime, damping = 0.1) => {
    const diff = target - current;
    const change = diff * damping;
    return current + change * deltaTime;
  },
  
  // 归一化角度 (0-360)
  normalizeAngle: (angle) => {
    return ((angle % 360) + 360) % 360;
  },
  
  // 线性同余生成器 (伪随机, 用于一致性噪声)
  seededRandom: (seed) => {
    const a = 1103515245;
    const c = 12345;
    const m = 2147483648;
    return ((a * seed + c) % m) / m;
  },
  
  // Perlin 噪声 (简化版 1D)
  perlin1D: (t, seed = 0) => {
    const ti = Math.floor(t);
    const tf = t - ti;
    
    const n0 = Math.sin(ti * 12.9898 + seed) * 43758.5453;
    const n1 = Math.sin((ti + 1) * 12.9898 + seed) * 43758.5453;
    
    const p0 = n0 - Math.floor(n0);
    const p1 = n1 - Math.floor(n1);
    
    const smooth = tf * tf * (3 - 2 * tf);
    return Math.ceil(p0 + (p1 - p0) * smooth * 1000) / 1000;
  },
  
  // 限制值范围
  clamp: (value, min, max) => Math.max(min, Math.min(max, value)),
  
  // 映射范围
  map: (value, inMin, inMax, outMin, outMax) => {
    const ratio = (value - inMin) / (inMax - inMin);
    return outMin + ratio * (outMax - outMin);
  }
};

export default Math2D;
