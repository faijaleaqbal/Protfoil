/**
 * 3D Scene Controller for Portfolio Website
 * Handles WebGL Canvas Setup, Three.js Hero Scene, Interactive Mouse Parallax,
 * GSAP ScrollTrigger 3D Camera Transitions & Performance Safeguards.
 */

(function () {
  'use strict';

  // Check if Three.js is available
  if (typeof THREE === 'undefined') {
    console.warn('Three.js library not loaded. WebGL 3D scene disabled.');
    return;
  }

  let canvas, renderer, scene, camera;
  let heroGroup, coreMesh, outerWireframe, particleSystem;
  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0, targetRotationY = 0;
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let isMobile = windowWidth <= 768;
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 60;

  function init() {
    canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'webgl-canvas';
      document.body.insertBefore(canvas, document.body.firstChild);
    }

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile, // antialias on desktop, disabled on mobile for max FPS
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
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

    // Mouse Pointer Listener
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onWindowResize, { passive: true });

    // Setup GSAP ScrollTrigger Camera Transitions
    setupScrollTriggers();

    // Start Render Loop
    animate();
  }

  /**
   * Build 3D Hero Tech Core Object (Inner Glowing Core + Outer Wireframe Geometry)
   */
  function buildHeroTechCore() {
    // Inner Solid Core
    const innerGeometry = new THREE.IcosahedronGeometry(isMobile ? 1.6 : 2.2, 1);
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

    // Outer Tech Wireframe Shell
    const outerGeometry = new THREE.IcosahedronGeometry(isMobile ? 2.4 : 3.2, 2);
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
   */
  function buildParticleField() {
    const particleCount = isMobile ? 350 : 1200;
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

  /**
   * Setup GSAP ScrollTrigger 3D Camera & Object Animations
   */
  function setupScrollTriggers() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded. Scroll-based 3D animation disabled.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Skip heavy scroll camera movement on mobile to preserve 60 FPS
    if (window.innerWidth <= 768) return;

    // Timeline 1: Hero -> About
    gsap.timeline({
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end: 'top center',
        scrub: 1
      }
    })
    .to(heroGroup.position, { x: -3.2, y: 0.3, z: 1.5 }, 0)
    .to(heroGroup.rotation, { z: 0.5 }, 0)
    .to(camera.position, { z: 13 }, 0);

    // Timeline 2: About -> Skills
    gsap.timeline({
      scrollTrigger: {
        trigger: '#skills',
        start: 'top bottom',
        end: 'top center',
        scrub: 1
      }
    })
    .to(heroGroup.position, { x: 0, y: -0.8, z: 4.0 }, 0)
    .to(heroGroup.scale, { x: 1.3, y: 1.3, z: 1.3 }, 0)
    .to(camera.position, { z: 11 }, 0);

    // Timeline 3: Skills -> Projects
    gsap.timeline({
      scrollTrigger: {
        trigger: '#projects',
        start: 'top bottom',
        end: 'top center',
        scrub: 1
      }
    })
    .to(heroGroup.position, { x: 3.5, y: 0.5, z: 0.5 }, 0)
    .to(heroGroup.scale, { x: 0.95, y: 0.95, z: 0.95 }, 0)
    .to(camera.position, { z: 14 }, 0);

    // Timeline 4: Projects -> Contact
    gsap.timeline({
      scrollTrigger: {
        trigger: '#contact',
        start: 'top bottom',
        end: 'top center',
        scrub: 1
      }
    })
    .to(heroGroup.position, { x: 0, y: 0, z: -2.0 }, 0)
    .to(heroGroup.scale, { x: 1.1, y: 1.1, z: 1.1 }, 0)
    .to(camera.position, { z: 16 }, 0);
  }

  /**
   * Pointer Move Event Listener
   */
  function onPointerMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  /**
   * Window Resize Event Listener
   */
  function onWindowResize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    isMobile = windowWidth <= 768;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(windowWidth, windowHeight);

    updateGroupPosition();
    ScrollTrigger.refresh();
  }

  /**
   * Animation & Render Loop (60 FPS Target)
   */
  function animate() {
    requestAnimationFrame(animate);

    // Smooth rotation lerp for mouse interaction
    targetRotationY += (mouseX * 0.6 - targetRotationY) * 0.04;
    targetRotationX += (mouseY * 0.6 - targetRotationX) * 0.04;

    if (heroGroup) {
      heroGroup.rotation.y += 0.005 + targetRotationY * 0.02;
      heroGroup.rotation.x += 0.003 + targetRotationX * 0.02;
      // Gentle floating oscillation
      heroGroup.position.y += Math.sin(Date.now() * 0.0015) * 0.003;
    }

    if (outerWireframe) {
      outerWireframe.rotation.y -= 0.007;
      outerWireframe.rotation.z += 0.004;
    }

    if (particleSystem) {
      particleSystem.rotation.y += 0.0008;
      particleSystem.rotation.x -= 0.0004;
    }

    renderer.render(scene, camera);

    // FPS Monitoring & Fallback safeguard
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (now - lastTime));
      frameCount = 0;
      lastTime = now;

      // Dynamic quality throttling if FPS drops below 30 on weak devices
      if (fps < 30 && renderer.getPixelRatio() > 1) {
        renderer.setPixelRatio(1);
      }
    }
  }

  // Initialize WebGL Scene when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
