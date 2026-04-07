/**
 * 动画控制器
 * 管理时间、缓动与关键帧
 */

import Math2D from '../utils/math.js';

export class AnimationController {
  constructor() {
    this.time = 0;
    this.deltaTime = 0;
    this.lastFrameTime = 0;
    this.paused = false;
    this.timeScale = 1.0;
    
    // 活跃动画列表
    this.animations = new Map();
    this.nextAnimId = 0;
  }
  
  update(currentTime) {
    if (this.paused) return;
    
    const deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;
    
    this.deltaTime = Math.min(deltaTime, 0.033);  // 上限 33ms，防止跳帧
    this.time += this.deltaTime * this.timeScale;
    
    // 更新所有动画
    for (const [id, anim] of this.animations) {
      if (!anim.paused) {
        anim.time += this.deltaTime;
        
        const progress = anim.duration > 0 
          ? Math.min(anim.time / anim.duration, 1)
          : 1;
        
        if (anim.onUpdate) {
          const eased = this.easeValue(progress, anim.easing);
          anim.onUpdate(eased, progress);
        }
        
        // 完成回调
        if (progress >= 1) {
          if (anim.onComplete) anim.onComplete();
          
          if (anim.loop) {
            anim.time = 0;
          } else {
            this.animations.delete(id);
          }
        }
      }
    }
  }
  
  /**
   * 创建动画
   * @param {Object} options - 动画配置
   * @param {number} options.duration - 持续时间 (秒)
   * @param {string} options.easing - 缓动类型
   * @param {Function} options.onUpdate - 更新回调 (eased, progress)
   * @param {Function} options.onComplete - 完成回调
   * @param {boolean} options.loop - 是否循环
   */
  create(options) {
    const {
      duration = 1,
      easing = 'linear',
      onUpdate,
      onComplete,
      loop = false
    } = options;
    
    const id = this.nextAnimId++;
    const animation = {
      id,
      time: 0,
      duration,
      easing,
      onUpdate,
      onComplete,
      loop,
      paused: false
    };
    
    this.animations.set(id, animation);
    return id;
  }
  
  /**
   * 创建值过渡
   * @param {number} from - 起始值
   * @param {number} to - 目标值
   * @param {number} duration - 持续时间
   * @param {Function} onValue - 值更新回调
   * @param {string} easing - 缓动类型
   */
  tween(from, to, duration, onValue, easing = 'easeOutCubic') {
    return this.create({
      duration,
      easing,
      onUpdate: (eased) => {
        const value = Math2D.lerp(from, to, eased);
        onValue(value);
      }
    });
  }
  
  // 暂停/恢复
  pause(id) {
    if (this.animations.has(id)) {
      this.animations.get(id).paused = true;
    }
  }
  
  resume(id) {
    if (this.animations.has(id)) {
      this.animations.get(id).paused = false;
    }
  }
  
  stop(id) {
    this.animations.delete(id);
  }
  
  // 缓动函数库
  easeValue(t, type = 'linear') {
    t = Math.max(0, Math.min(1, t));
    
    switch (type) {
      case 'linear':
        return t;
      
      case 'easeInQuad':
        return t * t;
      
      case 'easeOutQuad':
        return t * (2 - t);
      
      case 'easeInOutQuad':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      
      case 'easeInCubic':
        return t * t * t;
      
      case 'easeOutCubic':
        return (--t) * t * t + 1;
      
      case 'easeInOutCubic':
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * (t - 2)) * (2 * (t - 2)) + 1;
      
      case 'easeInQuart':
        return t * t * t * t;
      
      case 'easeOutQuart':
        return 1 - (--t) * t * t * t;
      
      case 'easeInOutQuart':
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
      
      case 'easeInQuint':
        return t * t * t * t * t;
      
      case 'easeOutQuint':
        return 1 + (--t) * t * t * t * t;
      
      case 'easeInOutQuint':
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
      
      case 'easeInExpo':
        return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
      
      case 'easeOutExpo':
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      
      case 'easeInOutExpo':
        return t === 0 ? 0 : t === 1 ? 1 : t < 0.5 
          ? Math.pow(2, 20 * t - 10) / 2
          : (2 - Math.pow(2, -20 * t + 10)) / 2;
      
      case 'easeInCirc':
        return 1 - Math.sqrt(1 - t * t);
      
      case 'easeOutCirc':
        return Math.sqrt(1 - (--t) * t);
      
      case 'easeInOutCirc':
        return t < 0.5
          ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
          : (Math.sqrt(1 - 4 * (t - 1) * (t - 1)) + 1) / 2;
      
      // 强阻尼效果 (推荐用于微交互)
      case 'criticallyDamped':
        // 二阶欠阻尼系统
        return 1 - (1 + 2 * t) * Math.exp(-2 * t);
      
      default:
        return t;
    }
  }
}

export default AnimationController;
