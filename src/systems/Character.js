/**
 * 角色系统 - 分层设计
 * 原创动漫风格长寿种族角色
 * 特点：冷静、疏离、理性且温柔
 */

import Math2D from '../utils/math.js';

export class Character {
  constructor(x, y, scale = 1.0) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    
    // 角色姿态
    this.rotation = 0;
    this.tiltX = 0;  // 身体倾斜
    this.tiltY = 0;
    
    // 微动画参数
    this.breathingPhase = Math.random() * Math.PI * 2;
    this.breathingSpeed = 0.3;  // rad/s
    this.breathingAmplitude = 0.02;  // 2% 缩放变化
    
    this.hairSwayPhase = Math.random() * Math.PI * 2;
    this.hairSwaySpeed = 0.5;  // rad/s
    this.hairSwayAngle = 3;  // 度数
    
    this.eyeBlinkPhase = 0;
    this.eyeBlinkSpeed = 2.0;
    this.eyeBlink = 1;  // 0-1, 0=闭眼
    this.eyeBlinkDuration = 0.1;  // 秒
    
    // 视差响应
    this.parallaxStrength = 1.0;
    this.parallaxOffset = { x: 0, y: 0 };
    this.targetParallaxOffset = { x: 0, y: 0 };
    
    // 滚动响应
    this.scrollSway = 0;
    this.scrollWave = 0;
    
    // 层组件
    this.layers = {
      // 背景光晕
      aura: { opacity: 0.15, visible: true },
      
      // 长发 (支持摆动)
      hair: {
        opacity: 1,
        rotation: 0,
        segments: 3,
        colors: ['#c8a2d0', '#b890c8', '#a878c0']
      },
      
      // 面部
      face: {
        opacity: 1,
        scale: 1,
        emotion: 'neutral'  // neutral, smile, concern
      },
      
      // 眼睛
      eyes: {
        opacity: 1,
        blink: 1,
        lookAngle: 0
      },
      
      // 服装
      clothes: {
        opacity: 1,
        layerCount: 2
      },
      
      // 身体
      body: {
        opacity: 1,
        scale: 1
      },
      
      // 饰物 (项链、手环等)
      accessories: {
        opacity: 0.8,
        items: []
      }
    };
    
    // 初始化饰物
    this.layers.accessories.items = [
      { type: 'necklace', offset: { x: 0, y: 30 }, color: '#e8d4f0' },
      { type: 'bracelet', offset: { x: -25, y: 60 }, color: '#d4c5e8' }
    ];
  }
  
  /**
   * 更新角色动画状态
   */
  update(deltaTime, inputState, scrollProgress) {
    // 更新各种动画相位
    this.breathingPhase += deltaTime * this.breathingSpeed;
    this.hairSwayPhase += deltaTime * this.hairSwaySpeed;
    this.eyeBlinkPhase += deltaTime * this.eyeBlinkSpeed;
    
    // 呼吸动画 (缩放)
    const breathing = Math.sin(this.breathingPhase);
    this.scale = 1.0 + breathing * this.breathingAmplitude;
    
    // 头发摆动
    this.layers.hair.rotation = Math.sin(this.hairSwayPhase) * (this.hairSwayAngle * Math.PI / 180);
    
    // 眨眼动画
    this.updateBlink();
    this.layers.eyes.blink = this.eyeBlink;
    
    // 视差响应 (鼠标)
    if (inputState && inputState.mouse) {
      const mouseNorm = inputState.mouse.norm;
      this.targetParallaxOffset.x = mouseNorm.x * 8 * this.parallaxStrength;
      this.targetParallaxOffset.y = mouseNorm.y * 5 * this.parallaxStrength;
    }
    
    // 平滑视差阻尼
    this.parallaxOffset.x = Math2D.dampedLerp(
      this.parallaxOffset.x,
      this.targetParallaxOffset.x,
      deltaTime,
      0.08
    );
    this.parallaxOffset.y = Math2D.dampedLerp(
      this.parallaxOffset.y,
      this.targetParallaxOffset.y,
      deltaTime,
      0.08
    );
    
    // 滚动波浪效应
    if (scrollProgress !== undefined) {
      this.scrollWave = Math.sin(scrollProgress * Math.PI * 4) * 2;
      this.scrollSway = scrollProgress * 5;
    }
    
    // 随机微小抖动 (生命感)
    this.tiltX = Math.sin(this.breathingPhase * 0.5) * 0.3;
    this.tiltY = Math.sin(this.hairSwayPhase * 0.3) * 0.2;
  }
  
  /**
   * 眨眼逻辑
   */
  updateBlink() {
    const blinkCycle = 4.0;  // 4 秒周期
    const blinkPhase = this.eyeBlinkPhase % blinkCycle;
    
    // 前3.7秒睁眼
    if (blinkPhase < 3.7) {
      this.eyeBlink = 1;
    } else {
      // 最后0.3秒闭眼
      const closePhase = (blinkPhase - 3.7) / this.eyeBlinkDuration;
      this.eyeBlink = Math.cos(closePhase * Math.PI) * 0.5 + 0.5;
    }
  }
  
  /**
   * 渲染角色
   */
  render(ctx) {
    ctx.save();
    
    // 应用初始变换
    ctx.translate(this.x + this.parallaxOffset.x, this.y + this.parallaxOffset.y + this.scrollWave);
    ctx.rotate(this.tiltX * Math.PI / 180);
    ctx.scale(this.scale, this.scale);
    
    // 绘制光晕背景
    this.renderAura(ctx);
    
    // 绘制角色各层
    this.renderHair(ctx);
    this.renderBody(ctx);
    this.renderClothes(ctx);
    this.renderFace(ctx);
    this.renderEyes(ctx);
    this.renderAccessories(ctx);
    
    ctx.restore();
  }
  
  /**
   * 光晕效果
   */
  renderAura(ctx) {
    if (!this.layers.aura.visible) return;
    
    ctx.save();
    ctx.globalAlpha = this.layers.aura.opacity;
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 80);
    gradient.addColorStop(0, 'rgba(200, 162, 208, 0.4)');
    gradient.addColorStop(0.5, 'rgba(200, 162, 208, 0.1)');
    gradient.addColorStop(1, 'rgba(200, 162, 208, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 80, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  /**
   * 渲染长发
   */
  renderHair(ctx) {
    ctx.save();
    ctx.translate(0, -20);
    ctx.rotate(this.layers.hair.rotation);
    ctx.globalAlpha = this.layers.hair.opacity;
    
    const colors = this.layers.hair.colors;
    
    // 左侧发束
    ctx.fillStyle = colors[2];
    ctx.beginPath();
    ctx.ellipse(-15, 10, 12, 40, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // 右侧发束
    ctx.fillStyle = colors[2];
    ctx.beginPath();
    ctx.ellipse(15, 10, 12, 40, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // 中央发色
    ctx.fillStyle = colors[0];
    ctx.beginPath();
    ctx.ellipse(0, -5, 18, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  /**
   * 渲染身体
   */
  renderBody(ctx) {
    ctx.save();
    ctx.fillStyle = '#f5e6ff';  // 浅肤色
    ctx.globalAlpha = this.layers.body.opacity;
    
    // 脖子
    ctx.fillRect(-6, 0, 12, 8);
    
    // 胸部
    ctx.beginPath();
    ctx.ellipse(0, 20, 15, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 手臂
    ctx.fillRect(-20, 10, 8, 30);
    ctx.fillRect(12, 10, 8, 30);
    
    ctx.restore();
  }
  
  /**
   * 渲染服装
   */
  renderClothes(ctx) {
    ctx.save();
    ctx.globalAlpha = this.layers.clothes.opacity;
    
    // 外袍 - 深紫色
    ctx.fillStyle = '#9b7eb8';
    ctx.beginPath();
    ctx.moveTo(-18, 15);
    ctx.lineTo(-20, 50);
    ctx.lineTo(-10, 60);
    ctx.lineTo(0, 62);
    ctx.lineTo(10, 60);
    ctx.lineTo(20, 50);
    ctx.lineTo(18, 15);
    ctx.quadraticCurveTo(0, 20, -18, 15);
    ctx.fill();
    
    // 内衣 - 浅紫色
    ctx.fillStyle = '#d4c5ff';
    ctx.beginPath();
    ctx.moveTo(-12, 18);
    ctx.lineTo(-14, 45);
    ctx.lineTo(0, 48);
    ctx.lineTo(14, 45);
    ctx.lineTo(12, 18);
    ctx.quadraticCurveTo(0, 22, -12, 18);
    ctx.fill();
    
    ctx.restore();
  }
  
  /**
   * 渲染脸部
   */
  renderFace(ctx) {
    ctx.save();
    ctx.globalAlpha = this.layers.face.opacity;
    
    // 脸部
    ctx.fillStyle = '#f5e6ff';
    ctx.beginPath();
    ctx.ellipse(0, -5, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 侧脸线条 (立体感)
    ctx.strokeStyle = 'rgba(200, 170, 200, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, -5, 14, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  }
  
  /**
   * 渲染眼睛
   */
  renderEyes(ctx) {
    ctx.save();
    ctx.globalAlpha = this.layers.eyes.opacity;
    
    const blink = this.layers.eyes.blink;
    const eyeSpacing = 8;
    
    // 左眼
    ctx.fillStyle = '#6b5b8f';
    ctx.beginPath();
    ctx.ellipse(-eyeSpacing, -8, 4, 5 * blink, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 右眼
    ctx.beginPath();
    ctx.ellipse(eyeSpacing, -8, 4, 5 * blink, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 眼神光 (仅在睁眼时)
    if (blink > 0.5) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(-eyeSpacing + 1.5, -9, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(eyeSpacing + 1.5, -9, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  /**
   * 渲染饰物
   */
  renderAccessories(ctx) {
    ctx.save();
    ctx.globalAlpha = this.layers.accessories.opacity;
    
    this.layers.accessories.items.forEach(item => {
      const { type, offset, color } = item;
      
      if (type === 'necklace') {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, offset.y, 8, 0, Math.PI * 2);
        ctx.stroke();
      } else if (type === 'bracelet') {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(offset.x, offset.y, 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    
    ctx.restore();
  }
  
  /**
   * 设置情绪表情
   */
  setEmotion(emotion) {
    this.layers.face.emotion = emotion;
  }
  
  /**
   * 设置视差强度
   */
  setParallaxStrength(strength) {
    this.parallaxStrength = strength;
  }
}

export default Character;
