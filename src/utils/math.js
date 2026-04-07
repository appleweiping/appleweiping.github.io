/**
 * Math and interpolation helpers used by the canvas animation systems.
 */

export const Math2D = {
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
  lerp: (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t)),
  smoothstep: (t) => {
    t = Math.max(0, Math.min(1, t));
    return t * t * (3 - 2 * t);
  },
  dampedLerp: (current, target, deltaTime, damping = 0.1) => {
    const diff = target - current;
    const change = diff * damping;
    return current + change * deltaTime;
  },
  normalizeAngle: (angle) => ((angle % 360) + 360) % 360,
  seededRandom: (seed) => {
    const a = 1103515245;
    const c = 12345;
    const m = 2147483648;
    return ((a * seed + c) % m) / m;
  },
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
  clamp: (value, min, max) => Math.max(min, Math.min(max, value)),
  map: (value, inMin, inMax, outMin, outMax) => {
    const ratio = (value - inMin) / (inMax - inMin);
    return outMin + ratio * (outMax - outMin);
  }
};

export default Math2D;
