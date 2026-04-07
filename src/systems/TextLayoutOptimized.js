/**
 * Custom text layout system with lightweight per-character rendering.
 */

export class TextLayoutOptimized {
  constructor(text = '', maxWidth = 600, options = {}) {
    this.text = text;
    this.maxWidth = maxWidth;
    this.font = options.font || '18px "Segoe UI", Arial, sans-serif';
    this.fontColor = options.color || '#111827';
    this.lineHeight = options.lineHeight || 1.5;
    this.alignment = options.alignment || 'left';
    this.letterSpacing = options.letterSpacing || 0;

    this.lines = [];
    this.characters = [];
    this.totalHeight = 0;
    this.totalWidth = 0;

    this.animations = {};
    this.breathingPhase = 0;
    this.scrollDelay = {};
    this.wavePhase = 0;
    this.dirty = true;
  }

  setText(text) {
    if (this.text !== text) {
      this.text = text;
      this.dirty = true;
    }
  }

  measure(ctx = null) {
    if (!this.dirty) return;

    let tempCanvas;
    let tempCtx = ctx;
    if (!tempCtx) {
      tempCanvas = document.createElement('canvas');
      tempCtx = tempCanvas.getContext('2d');
    }

    if (!tempCtx) {
      return;
    }

    tempCtx.font = this.font;

    this.lines = [];
    this.characters = [];
    let currentLine = { text: '', width: 0, chars: [] };
    let x = 0;
    let y = 0;
    let charIndex = 0;

    const words = this.text.split(' ');

    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
      const word = words[wordIndex];
      const isLastWord = wordIndex === words.length - 1;

      for (let charIndexInWord = 0; charIndexInWord < word.length; charIndexInWord++) {
        const char = word[charIndexInWord];
        const charWidth = tempCtx.measureText(char).width + this.letterSpacing;

        if (x + charWidth > this.maxWidth && x > 0) {
          this.lines.push({ ...currentLine, width: x });
          currentLine = { text: '', width: 0, chars: [] };
          x = 0;
          y += this.lineHeight * 25;
        }

        currentLine.text += char;
        currentLine.chars.push({
          char,
          index: charIndex,
          x,
          width: charWidth,
          opacity: 1,
          scale: 1,
          offsetY: 0,
          offsetX: 0
        });

        this.characters.push({
          char,
          lineIdx: this.lines.length,
          x,
          y,
          width: charWidth,
          opacity: 1,
          scale: 1,
          velocity: 0,
          delay: 0,
          offsetX: 0,
          offsetY: 0
        });

        x += charWidth;
        charIndex++;
      }

      if (!isLastWord) {
        const spaceWidth = tempCtx.measureText(' ').width + this.letterSpacing;

        if (x + spaceWidth > this.maxWidth) {
          this.lines.push({ ...currentLine, width: x });
          currentLine = { text: ' ', width: spaceWidth, chars: [] };
          x = spaceWidth;
          y += this.lineHeight * 25;
        } else {
          currentLine.text += ' ';
          currentLine.width = x + spaceWidth;
          x += spaceWidth;
        }
      }
    }

    if (currentLine.text.length > 0) {
      this.lines.push({ ...currentLine, width: x });
    }

    this.totalHeight = y + this.lineHeight * 25;
    this.totalWidth = Math.max(...this.lines.map((line) => line.width), 0);
    this.dirty = false;
  }

  applyBreathingAnimation(phase, amplitude = 0.15) {
    this.breathingPhase = phase;
    this.characters.forEach((char, index) => {
      const breathing = Math.sin(phase + index * 0.15) * amplitude;
      char.opacity = 0.85 + breathing;
    });
  }

  applyScrollDelay(scrollProgress) {
    this.characters.forEach((char, index) => {
      const delayFactor = 0.02;
      const charDelay = Math.max(0, scrollProgress - index * delayFactor);

      char.delay = charDelay;

      if (charDelay < 1) {
        const eased = charDelay * charDelay;
        char.offsetY = (1 - eased) * 15;
        char.opacity = eased;
      }
    });
  }

  applyWaveAnimation(wavePhase, waveAmplitude = 3) {
    this.wavePhase = wavePhase;
    this.characters.forEach((char, index) => {
      const wave = Math.sin(wavePhase + index * 0.3) * waveAmplitude;
      char.offsetY = (char.offsetY || 0) + wave;
    });
  }

  applyJitterAnimation(jitterStrength = 1.5) {
    this.characters.forEach((char) => {
      char.offsetX = (Math.random() - 0.5) * jitterStrength;
      char.offsetY = (char.offsetY || 0) + (Math.random() - 0.5) * jitterStrength;
    });
  }

  render(ctx, baseX = 0, baseY = 0) {
    if (!ctx) return;

    ctx.save();
    ctx.font = this.font;
    ctx.fillStyle = this.fontColor;

    this.characters.forEach((char) => {
      const opacity = Math.max(0, char.opacity);
      if (opacity <= 0.001) {
        return;
      }

      const renderX = baseX + char.x + char.offsetX;
      const renderY = baseY + char.y + 20 + char.offsetY;
      const scale = char.scale || 1;

      if (scale !== 1) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(renderX, renderY);
        ctx.scale(scale, scale);
        ctx.translate(-renderX, -renderY);
        ctx.fillText(char.char, renderX, renderY);
        ctx.restore();
        return;
      }

      ctx.globalAlpha = opacity;
      ctx.fillText(char.char, renderX, renderY);
    });

    ctx.restore();
  }
}

export default TextLayoutOptimized;
