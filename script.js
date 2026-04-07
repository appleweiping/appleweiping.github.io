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

// Page initialization
(async function initHomepage() {
  let scene = null;
  try {
    // Wait for DOM to be ready
    await waitForDomReady();
    
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
