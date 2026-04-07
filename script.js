/**
 * Main entry point for the homepage canvas animation.
 */

function waitForDomReady() {
  if (document.readyState !== 'loading') {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    document.addEventListener('DOMContentLoaded', resolve, { once: true });
  });
}

function measureCanvas(canvas) {
  const container = canvas.parentElement;
  if (!container) {
    throw new Error('Canvas container not found.');
  }

  const rect = container.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(rect.width));
  canvas.height = Math.max(1, Math.round(rect.height));
}

function showFallbackMessage(message) {
  const hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.hero-fallback')) {
    return;
  }

  const fallback = document.createElement('p');
  fallback.className = 'hero-fallback';
  fallback.textContent = message;
  hero.appendChild(fallback);
}

function cleanVisibleCopy() {
  const replacements = [
    ['#experience .timeline-item:nth-of-type(1) h3', 'Research Assistant Intern - AI Research Group'],
    ['#experience .timeline-item:nth-of-type(1) .time', 'Mar 2026 - Present - Shenzhen'],
    ['#experience .timeline-item:nth-of-type(2) h3', 'Research Assistant - Zhangjiang Laboratory'],
    ['#experience .timeline-item:nth-of-type(2) .time', 'Jul 2025 - Sep 2025 - Shanghai, China'],
    ['#experience .timeline-item:nth-of-type(3) h3', 'Student Researcher - Carnegie Mellon University'],
    ['#experience .timeline-item:nth-of-type(3) .time', 'Sep 2023 - Feb 2024 - Beijing, China'],
    [
      'body > section:nth-of-type(6) .timeline-item:nth-of-type(1) .time',
      'B.Sc. in Computer Science, Electrical Engineering and Applied Physics (triple degree program) - Sep 2024 - Jun 2028'
    ],
    [
      'body > section:nth-of-type(6) .timeline-item:nth-of-type(2) .time',
      'B.Sc. in Computer Science, Electrical Engineering and Applied Physics (triple degree program) - Sep 2024 - Jun 2028'
    ],
    ['.footer p', 'Copyright 2026 Weiping Yan. Built with GitHub Pages.']
  ];

  replacements.forEach(([selector, text]) => {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = text;
    }
  });
}

(async function initHomepage() {
  let scene = null;

  try {
    await waitForDomReady();
    cleanVisibleCopy();

    const heroCanvas = document.getElementById('heroCanvas');
    if (!heroCanvas) {
      throw new Error('Canvas element (#heroCanvas) not found.');
    }

    measureCanvas(heroCanvas);

    console.log('Loading background animation system...');
    const HeroSceneModule = await import('./src/core/HeroSceneOptimized.js');
    const HeroScene = HeroSceneModule.default;

    console.log('Initializing animation engine...');
    scene = new HeroScene(heroCanvas);

    window.__HERO_SCENE__ = scene;
    window.__DEBUG_HERO_SCENE__ = false;

    console.log('Background animation initialized');
    console.log('Scene state:', scene.getState());

    window.addEventListener(
      'pagehide',
      () => {
        if (scene) {
          scene.destroy();
        }
      },
      { once: true }
    );
  } catch (error) {
    console.error('Failed to initialize HeroScene:', error);
    console.error(error.stack);
    showFallbackMessage(
      'Background animation is unavailable right now, but the page content is still fully accessible.'
    );
  }
})();

console.log('Homepage loaded successfully.');
