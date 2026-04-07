/**
 * Main Entry Point
 * Initialize Canvas-based animated background system
 */

// Page initialization
(async function() {
  try {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
    }
    
    // Initialize Canvas
    const heroCanvas = document.getElementById('heroCanvas');
    if (!heroCanvas) {
      throw new Error('Canvas element (#heroCanvas) not found!');
    }
    
    // Set Canvas size
    const resizeCanvas = () => {
      const container = heroCanvas.parentElement;
      const rect = container.getBoundingClientRect();
      heroCanvas.width = rect.width;
      heroCanvas.height = rect.height;
    };
    
    resizeCanvas();
    
    // Import animation system
    console.log('Loading background animation system...');
    const HeroSceneModule = await import('./src/core/HeroScene.js');
    const HeroScene = HeroSceneModule.default;
    
    // Initialize scene
    console.log('Initializing animation engine...');
    const scene = new HeroScene(heroCanvas);
    
    // Save global reference for debugging
    window.__HERO_SCENE__ = scene;
    window.__DEBUG_HERO_SCENE__ = true;
    
    console.log('✅ Background animation initialized');
    console.log('Scene state:', scene.getState());
    
    // Handle window resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      scene.onWindowResize();
    });
    
  } catch (error) {
    console.error('❌ Failed to initialize HeroScene:', error);
    console.error(error.stack);
  }
})();

console.log('✅ Homepage loaded successfully.');