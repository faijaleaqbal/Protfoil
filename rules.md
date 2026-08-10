# Rules & Boundaries — 3D UI Upgrade

## 🛠️ Allowed Libraries & Technologies
- **Three.js** (WebGL 3D scene, geometries, particle systems, lighting)
- **GSAP + ScrollTrigger** (Hardware-accelerated scroll timeline & 3D camera animations)
- **Vanilla CSS 3D Transforms** (`perspective`, `transform-style: preserve-3d`, `rotateX/Y`, `translateZ`)
- **Semantic HTML5 & Vanilla JavaScript** (Zero bundler/build tool changes)

## 🚫 Avoid / Prohibited
- No heavy 3D physics engines (e.g. Cannon.js, Ammo.js) that degrade mobile FPS
- No complete framework rewrites (do not convert to React/Vite/Next.js — keep static HTML/CSS/JS architecture)
- No deletion or altering of existing portfolio text, URLs, project details, or mailto links
- No heavy high-poly 3D models that cause long initial page load times

## ⚡ Performance & Mobile Rules
- Must maintain smooth 60 FPS performance on desktop and mobile
- Must include automatic FPS monitoring & responsive fallback to simplified low-poly or 2D/CSS-only mode on mobile viewports (`max-width: 768px`) or low-end GPUs
- Must lazy-load / defer non-critical WebGL initializations

## 🔒 Boundaries
- Do not deploy or push to any GitHub repo without explicit user approval
- Do not modify files outside the `/portfolio` folder
