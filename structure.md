# App Flow & Architecture — 3D UI Experience

## 🛠️ Tech Stack
- **Frontend Core**: Vanilla HTML5, CSS3 (CSS Custom Properties, Glassmorphism, 3D Transforms), Vanilla JavaScript (ES6 Modules).
- **3D Graphics Engine**: Three.js (r128 / ES module build for WebGL rendering).
- **3D Animation & Scroll Sync**: GSAP (GreenSock Animation Platform) + ScrollTrigger for scroll-based 3D scene camera transitions.
- **Micro-Interactions**: Vanilla 3D Parallax & Gyro/Pointer Tilt Engine for interactive card depth.
- **Static Hosting Target**: GitHub Pages / Static HTTP server (Zero build tool re-configuration required).

## 📁 Folder Structure
```
/portfolio
├── index.html              # Main HTML markup (3D background canvas container & section anchors)
├── 404.html                # Custom 404 fallback page
├── PRD.md                  # Product Requirements Document
├── README.md               # Project Overview
├── structure.md            # Technical Architecture & 3D Stack Blueprint
├── rules.md                # Development Guardrails & Performance Constraints
├── phases.md               # 3D UI Transformation Roadmap
├── tasks.md                # Task Execution Checklist
├── memory.md               # Session Progress & Memory Continuity Log
├── scripts/
│   ├── main.js             # Application Controller & Event Coordinator
│   └── 3d-scene.js         # Three.js Scene Setup, Particle Field, Interactive 3D Objects & Scroll Trigger Logic
└── styles/
    └── main.css            # Base Styles, Glassmorphism & CSS 3D Card Tilt Effects
```

## 🔄 Page Flow & 3D Experience Map
- **Persistent WebGL Canvas**: Background 3D Canvas layer behind DOM content with interactive particle starfield & floating geometric polyhedra.
- **Phase 1 (Hero 3D Scene)**: Interactive 3D Developer Sphere / Cyber Tech Core in Hero section responding to mouse pointer movements.
- **Phase 2 (Scroll-Based 3D Scene Transitions)**: Smooth WebGL camera movement and object rotation driven by GSAP ScrollTrigger as user scrolls from Hero → About → Skills → Projects → Contact.
- **Phase 3 (3D Card Tilt & Holographic Hover)**: CSS 3D spatial tilt effect on Project cards, Skill badges, and developer.json card with dynamic lighting / glare highlights.
- **Phase 4 (Performance & Adaptive Mobile 2D/3D Engine)**: Automatic FPS monitor; fallback to low-poly / CSS 3D mode on devices under 60 FPS or mobile viewports (`max-width: 768px`).
