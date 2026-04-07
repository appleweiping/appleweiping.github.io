/**
 * Main Entry Point
 * Initialize Canvas-based animated background system
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
    {
      selector: '#experience .timeline-item:nth-of-type(1) h3',
      text: 'Research Assistant Intern - AI Research Group'
    },
    {
      selector: '#experience .timeline-item:nth-of-type(1) .time',
      text: 'Mar 2026 - Present - Shenzhen'
    },
    {
      selector: '#experience .timeline-item:nth-of-type(2) h3',
      text: 'Research Assistant - Zhangjiang Laboratory'
    },
    {
      selector: '#experience .timeline-item:nth-of-type(2) .time',
      text: 'Jul 2025 - Sep 2025 - Shanghai, China'
    },
    {
      selector: '#experience .timeline-item:nth-of-type(3) h3',
      text: 'Student Researcher - Carnegie Mellon University'
    },
    {
      selector: '#experience .timeline-item:nth-of-type(3) .time',
      text: 'Sep 2023 - Feb 2024 - Beijing, China'
    },
    {
      selector: 'body > section:nth-of-type(6) .timeline-item:nth-of-type(1) .time',
      text: 'B.Sc. in Computer Science, Electrical Engineering and Applied Physics (triple degree program) - Sep 2024 - Jun 2028'
    },
    {
      selector: 'body > section:nth-of-type(6) .timeline-item:nth-of-type(2) .time',
      text: 'B.Sc. in Computer Science, Electrical Engineering and Applied Physics (triple degree program) - Sep 2024 - Jun 2028'
    },
    {
      selector: '.footer p',
      text: '© 2026 Weiping Yan. Built with GitHub Pages.'
    }
  ];

  replacements.forEach(({ selector, text }) => {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = text;
    }
  });

  const footer = document.querySelector('.footer p');
  if (footer) {
    footer.textContent = 'Copyright 2026 Weiping Yan. Built with GitHub Pages.';
  }
}

// Page initialization
(async function initHomepage() {
  let scene = null;
  try {
    // Wait for DOM to be ready
    await waitForDomReady();
    cleanVisibleCopy();
    
    // Initialize Canvas
    const heroCanvas = document.getElementById('heroCanvas');
    if (!heroCanvas) {
      throw new Error('Canvas element (#heroCanvas) not found!');
    }
    
    // Set Canvas size
    measureCanvas(heroCanvas);
    
    // Import animation system
    console.log('Loading background animation system...');
    const HeroSceneModule = await import('./src/core/HeroSceneOptimized.js');
    const HeroScene = HeroSceneModule.default;
    
    // Initialize scene
    console.log('Initializing animation engine...');
    scene = new HeroScene(heroCanvas);
    
    // Save global reference for debugging
    window.__HERO_SCENE__ = scene;
    window.__DEBUG_HERO_SCENE__ = false;
    
    console.log('✅ Background animation initialized');
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
    console.error('❌ Failed to initialize HeroScene:', error);
    console.error(error.stack);
    showFallbackMessage(
      'Background animation is unavailable right now, but the page content is still fully accessible.'
    );
  }
})();

console.log('✅ Homepage loaded successfully.');
