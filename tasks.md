# 3D UI Transformation Tasks Checklist

## Phase 1: 3D Hero / Landing Section
- [x] Add Three.js canvas container to `index.html` hero section
- [x] Create `scripts/3d-scene.js` for WebGL scene, camera, renderer setup
- [x] Implement interactive 3D Cyber Tech Core / Polyhedron geometry with glowing particle ring
- [x] Connect pointer move event listeners for subtle 3D parallax tracking
- [x] Match ambient & point lighting to dark teal/indigo theme

## Phase 2: Scroll-Based 3D Camera & Scene Transitions
- [x] Integrate GSAP and ScrollTrigger scripts
- [x] Map scroll progress to 3D camera position and object rotation per section
- [x] Add smooth section-to-section camera zoom, tilt, and pan transitions
- [x] Synchronize particle field density & colors with section scrolling

## Phase 3: 3D Cards & Spatial Tilt Effects
- [x] Add 3D card tilt & parallax depth script in `scripts/main.js`
- [x] Add CSS `perspective` and `transform-style: preserve-3d` to `.project-card`, `.skill-card`, and `.hero-card-glass`
- [x] Implement mouse position tracking for smooth `rotateX`, `rotateY`, and dynamic glare reflections
- [x] Add 3D element elevation on hover for icons and buttons

## Phase 4: Performance Optimization & Mobile Fallback Engine
- [x] Implement FPS monitor and device capability check
- [x] Add automatic mobile fallback (`< 768px`) reducing WebGL workload and utilizing CSS 3D transforms
- [x] Audit Core Web Vitals and ensure 60 FPS scrolling performance
- [x] Create/update `memory.md` with session progress

## Phase 5: EmailJS Contact Form Integration
- [x] Create `scripts/email-config.js` with `PUBLIC_KEY`, `SERVICE_ID`, `TEMPLATE_ID` credentials object
- [x] Add EmailJS SDK CDN (`email.min.js`) and `scripts/email-config.js` script tag to `index.html`
- [x] Integrate `emailjs.send()` dispatch inside `initContactForm()` in `scripts/main.js`
- [x] Implement button loading state (`Sending...`), green success message, red error message, and automatic form reset

