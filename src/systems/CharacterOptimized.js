/**
 * Layered character renderer with cached static layers.
 */

import Math2D from '../utils/math.js';

function createCacheCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return {
    canvas,
    ctx: canvas.getContext('2d')
  };
}

export class CharacterOptimized {
  constructor(x, y, scale = 1.0) {
    this.x = x;
    this.y = y;
    this.scale = scale;

    this.rotation = 0;
    this.tiltX = 0;
    this.tiltY = 0;

    this.breathingPhase = Math.random() * Math.PI * 2;
    this.breathingSpeed = 0.3;
    this.breathingAmplitude = 0.02;

    this.hairSwayPhase = Math.random() * Math.PI * 2;
    this.hairSwaySpeed = 0.5;
    this.hairSwayAngle = 3;

    this.eyeBlinkPhase = 0;
    this.eyeBlinkSpeed = 2.0;
    this.eyeBlink = 1;
    this.eyeBlinkDuration = 0.1;

    this.parallaxStrength = 1.0;
    this.parallaxOffset = { x: 0, y: 0 };
    this.targetParallaxOffset = { x: 0, y: 0 };

    this.scrollSway = 0;
    this.scrollWave = 0;

    this.layers = {
      aura: { opacity: 0.15, visible: true },
      hair: {
        opacity: 1,
        rotation: 0,
        segments: 3,
        colors: ['#c8a2d0', '#b890c8', '#a878c0']
      },
      face: {
        opacity: 1,
        scale: 1,
        emotion: 'neutral'
      },
      eyes: {
        opacity: 1,
        blink: 1,
        lookAngle: 0
      },
      clothes: {
        opacity: 1,
        layerCount: 2
      },
      body: {
        opacity: 1,
        scale: 1
      },
      accessories: {
        opacity: 0.8,
        items: []
      }
    };

    this.layers.accessories.items = [
      { type: 'necklace', offset: { x: 0, y: 30 }, color: '#e8d4f0' },
      { type: 'bracelet', offset: { x: -25, y: 60 }, color: '#d4c5e8' }
    ];

    this.cache = {
      width: 260,
      height: 260,
      originX: 130,
      originY: 110,
      base: createCacheCanvas(260, 260),
      face: createCacheCanvas(260, 260)
    };

    this.rebuildCaches();
  }

  rebuildCaches() {
    this.renderBaseCache();
    this.renderFaceCache();
  }

  renderBaseCache() {
    const { ctx, canvas } = this.cache.base;
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(this.cache.originX, this.cache.originY);
    this.renderAura(ctx);
    this.renderBody(ctx);
    this.renderClothes(ctx);
    ctx.restore();
  }

  renderFaceCache() {
    const { ctx, canvas } = this.cache.face;
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(this.cache.originX, this.cache.originY);
    this.renderFace(ctx);
    ctx.restore();
  }

  update(deltaTime, inputState, scrollProgress) {
    this.breathingPhase += deltaTime * this.breathingSpeed;
    this.hairSwayPhase += deltaTime * this.hairSwaySpeed;
    this.eyeBlinkPhase += deltaTime * this.eyeBlinkSpeed;

    const breathing = Math.sin(this.breathingPhase);
    this.scale = 1.0 + breathing * this.breathingAmplitude;

    this.layers.hair.rotation = Math.sin(this.hairSwayPhase) * (this.hairSwayAngle * Math.PI / 180);

    this.updateBlink();
    this.layers.eyes.blink = this.eyeBlink;

    if (inputState && inputState.mouse) {
      const mouseNorm = inputState.mouse.norm;
      this.targetParallaxOffset.x = mouseNorm.x * 8 * this.parallaxStrength;
      this.targetParallaxOffset.y = mouseNorm.y * 5 * this.parallaxStrength;
    }

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

    if (scrollProgress !== undefined) {
      this.scrollWave = Math.sin(scrollProgress * Math.PI * 4) * 2;
      this.scrollSway = scrollProgress * 5;
    }

    this.tiltX = Math.sin(this.breathingPhase * 0.5) * 0.3;
    this.tiltY = Math.sin(this.hairSwayPhase * 0.3) * 0.2;
  }

  updateBlink() {
    const blinkCycle = 4.0;
    const blinkPhase = this.eyeBlinkPhase % blinkCycle;

    if (blinkPhase < 3.7) {
      this.eyeBlink = 1;
      return;
    }

    const closePhase = (blinkPhase - 3.7) / this.eyeBlinkDuration;
    this.eyeBlink = Math.cos(closePhase * Math.PI) * 0.5 + 0.5;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x + this.parallaxOffset.x, this.y + this.parallaxOffset.y + this.scrollWave);
    ctx.rotate(this.tiltX * Math.PI / 180);
    ctx.scale(this.scale, this.scale);

    ctx.drawImage(this.cache.base.canvas, -this.cache.originX, -this.cache.originY);
    this.renderHair(ctx);
    ctx.drawImage(this.cache.face.canvas, -this.cache.originX, -this.cache.originY);
    this.renderEyes(ctx);
    this.renderAccessories(ctx);

    ctx.restore();
  }

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

  renderHair(ctx) {
    ctx.save();
    ctx.translate(0, -20);
    ctx.rotate(this.layers.hair.rotation);
    ctx.globalAlpha = this.layers.hair.opacity;

    const colors = this.layers.hair.colors;

    ctx.fillStyle = colors[2];
    ctx.beginPath();
    ctx.ellipse(-15, 10, 12, 40, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(15, 10, 12, 40, 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors[0];
    ctx.beginPath();
    ctx.ellipse(0, -5, 18, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderBody(ctx) {
    ctx.save();
    ctx.fillStyle = '#f5e6ff';
    ctx.globalAlpha = this.layers.body.opacity;

    ctx.fillRect(-6, 0, 12, 8);

    ctx.beginPath();
    ctx.ellipse(0, 20, 15, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(-20, 10, 8, 30);
    ctx.fillRect(12, 10, 8, 30);
    ctx.restore();
  }

  renderClothes(ctx) {
    ctx.save();
    ctx.globalAlpha = this.layers.clothes.opacity;

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

  renderFace(ctx) {
    ctx.save();
    ctx.globalAlpha = this.layers.face.opacity;

    ctx.fillStyle = '#f5e6ff';
    ctx.beginPath();
    ctx.ellipse(0, -5, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(200, 170, 200, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, -5, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  renderEyes(ctx) {
    ctx.save();
    ctx.globalAlpha = this.layers.eyes.opacity;

    const blink = this.layers.eyes.blink;
    const eyeSpacing = 8;

    ctx.fillStyle = '#6b5b8f';
    ctx.beginPath();
    ctx.ellipse(-eyeSpacing, -8, 4, 5 * blink, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(eyeSpacing, -8, 4, 5 * blink, 0, 0, Math.PI * 2);
    ctx.fill();

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

  renderAccessories(ctx) {
    ctx.save();
    ctx.globalAlpha = this.layers.accessories.opacity;

    this.layers.accessories.items.forEach((item) => {
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

  setEmotion(emotion) {
    this.layers.face.emotion = emotion;
    this.renderFaceCache();
  }

  setParallaxStrength(strength) {
    this.parallaxStrength = strength;
  }
}

export default CharacterOptimized;
