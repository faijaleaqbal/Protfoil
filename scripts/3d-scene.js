/**
 * 3D Scene Controller for Portfolio Website
 * Handles WebGL Canvas Setup, Three.js Hero Scene, Interactive Mouse Parallax,
 * IntersectionObserver Pausing & Performance Safeguards.
 */

(function () {
  'use strict';

  // Check if Three.js is available
  if (typeof THREE === 'undefined') {
    console.warn('Three.js library not loaded. WebGL 3D scene disabled.');
    return;
  }

  let canvas, renderer, scene, camera, clock;
  let heroGroup, coreMesh, outerWireframe, particleSystem;
  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0, targetRotationY = 0;
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let isMobile = windowWidth <= 768;
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  let isCanvasVisible = !document.hidden;
  let animFrameId = null;
  let lastRenderTime = 0;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    canvas = document.getElementById('webgl-canvas');

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'webgl-canvas';
      document.body.insertBefore(canvas, document.body.firstChild);
    } else if (canvas.parentElement !== document.body) {
      // The background must not be clipped or unmounted with the hero.
      document.body.insertBefore(canvas, document.body.firstChild);
    }

    clock = new THREE.Clock();

    // Renderer setup with mobile-optimized resolution limit
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile, // Disable anti-aliasing on mobile for high performance
      powerPreference: 'high-performance'
    });

    // Mobile pixel ratio capped to 1.0x to eliminate GPU fill-rate lag, max 1.5x on desktop
    const pixelRatio = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(windowWidth, windowHeight);

    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 2, 50); // Indigo glow
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 50); // Cyan glow
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Hero Object Group
    heroGroup = new THREE.Group();
    scene.add(heroGroup);

    buildHeroTechCore();
    buildParticleField();

    // Attach pointer listeners ONLY on desktop/non-touch devices to avoid scroll jitter & touch conflict
    if (!isTouchDevice && !isMobile) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }
    window.addEventListener('resize', onWindowResize, { passive: true });

    // Keep the background alive while scrolling; only pause in a hidden tab.
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Start Render Loop
    animate();
  }

  /**
   * Build 3D Hero Tech Core Object (Inner Glowing Core + Outer Wireframe Geometry)
   */
  function buildHeroTechCore() {
    // Inner Solid Core (detail level 0 on mobile, 1 on desktop)
    const innerGeometry = new THREE.IcosahedronGeometry(isMobile ? 1.6 : 2.2, isMobile ? 0 : 1);
    const innerMaterial = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      emissive: 0x1e1b4b,
      roughness: 0.2,
      metalness: 0.8,
      flatShading: true,
      transparent: true,
      opacity: 0.85
    });
    coreMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    heroGroup.add(coreMesh);

    // Outer Tech Wireframe Shell (subdivision detail 0 on mobile [lowest level], 1 on desktop)
    const outerGeometry = new THREE.IcosahedronGeometry(isMobile ? 2.2 : 3.2, isMobile ? 0 : 1);
    const outerMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    outerWireframe = new THREE.Mesh(outerGeometry, outerMaterial);
    heroGroup.add(outerWireframe);

    // Position Hero Group slightly offset to align with Hero Visual section on Desktop
    updateGroupPosition();
  }

  function updateGroupPosition() {
    if (window.innerWidth > 992) {
      heroGroup.position.set(3.2, 0, 0);
    } else {
      heroGroup.position.set(0, -0.5, 0);
    }
  }

  /**
   * Build Responsive WebGL Particle Starfield / Cloud
   * Low particle count on mobile (120 particles < 150 limit)
   */
  function buildParticleField() {
    const particleCount = isMobile ? 120 : 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x6366f1); // Indigo
    const color2 = new THREE.Color(0x06b6d4); // Cyan
    const color3 = new THREE.Color(0x10b981); // Emerald accent

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 35;
      positions[i3 + 1] = (Math.random() - 0.5) * 35;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;

      const mixedColor = Math.random() < 0.5 ? color1 : Math.random() < 0.8 ? color2 : color3;
      colors[i3]     = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
  }

  function onVisibilityChange() {
    isCanvasVisible = !document.hidden;
    if (!isCanvasVisible && animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    } else if (isCanvasVisible && !animFrameId) {
      clock.start();
      animate();
    }
  }

  /**
   * Pointer Move Event Listener (Desktop Only)
   */
  function onPointerMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  /**
   * Window Resize Event Listener (Caches dimensions, no per-frame DOM reads)
   */
  function onWindowResize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    isMobile = windowWidth <= 768;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    const pixelRatio = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(windowWidth, windowHeight);

    updateGroupPosition();
  }

  /**
   * Animation & Render Loop (Frame-rate independent via THREE.Clock getElapsedTime)
   * Zero heavy per-frame DOM reads (like getBoundingClientRect) inside loop.
   */
  function animate(timestamp) {
    if (!isCanvasVisible) {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      return;
    }

    if (reducedMotion) {
      renderer.render(scene, camera);
      animFrameId = null;
      return;
    }

    animFrameId = requestAnimationFrame(animate);

    // Limit mobile redraws to 30 FPS while the persistent background is visible.
    if (isMobile && timestamp - lastRenderTime < 1000 / 30) return;
    lastRenderTime = timestamp;

    // Frame-rate independent timing via Three.js Clock
    const elapsedTime = clock.getElapsedTime();

    // Smooth rotation lerp for mouse interaction on desktop only
    if (!isTouchDevice && !isMobile) {
      targetRotationY += (mouseX * 0.6 - targetRotationY) * 0.04;
      targetRotationX += (mouseY * 0.6 - targetRotationX) * 0.04;
    } else {
      targetRotationX = 0;
      targetRotationY = 0;
    }

    if (coreMesh) {
      coreMesh.rotation.y = elapsedTime * 0.25 + targetRotationY;
      coreMesh.rotation.x = elapsedTime * 0.15 + targetRotationX;
      // Smooth sinusoidal float using THREE.Clock getElapsedTime
      coreMesh.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
    }

    if (outerWireframe) {
      outerWireframe.rotation.y = -elapsedTime * 0.2;
      outerWireframe.rotation.z = elapsedTime * 0.1;
    }

    if (particleSystem) {
      particleSystem.rotation.y = elapsedTime * 0.02;
      particleSystem.rotation.x = -elapsedTime * 0.01;
    }

    renderer.render(scene, camera);
  }

  // Initialize WebGL Scene when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
