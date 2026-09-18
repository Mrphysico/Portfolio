# 🌌 ARTH JADAV: THE DIMENSIONAL PORTFOLIO

> An immersive, cinematic, Awwwards-level interactive portfolio that takes the visitor on a journey across dimensions: **0D**, **1D**, **2D**, **3D**, and **4D**, returning through a **Contact Singularity**.

---

## 🌟 Executive Summary

- **Creator**: **Arth Jadav**, Frontend Developer & Creative Coder
- **Verified GitHub**: [https://github.com/Mrphysico](https://github.com/Mrphysico)
- **Verified LinkedIn**: [https://www.linkedin.com/in/arth-jadav-05221435b](https://www.linkedin.com/in/arth-jadav-05221435b)
- **Identity & Integrity Rule**: All personal content resides in `web/src/data/content.ts`. No phone numbers, UPI IDs, passwords, or secrets are ever included. Unverified personal details feature explicit `TODO` placeholders.

---

## 📐 The Dimensional Chapters

| Chapter | Dimension | Coordinates | Featured Project / Milestone | Technology Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **0D: The Point** | 0D | `(0, 0, 0, 0)` | Quantum Singularity Origin | Black screen, pulsing photon, preloader counter, big-bang expansion into ARTH JADAV |
| **1D: The Line** | 1D | `(X)` | [Amazon Clone](https://github.com/Mrphysico/Amazon-clone) | Pure HTML/CSS, "my first project, learning from YouTube", laser line divider, CRT wireframe |
| **2D: The Plane** | 2D | `(X, Y)` | [Minor Project Demo](https://github.com/Mrphysico/MINOR-PROJECT-DEMO) | 6th-semester minor project, flat CSS-art plane folding like origami into 3D |
| **3D: The World** | 3D | `(X, Y, Z)` | [Smart Accident Detection System](https://github.com/Mrphysico/SMART-ACCIDENT-DETCETION-SYSTEM) | FastAPI telematics server, real-time accident simulator, web dashboard, Expo responder app |
| **4D: The Hyperspace** | 4D | `(X, Y, Z, W)` | [RigForge](https://github.com/Mrphysico/RigForge) *(Flagship)* | Full-stack PC parts e-commerce & Battle Rig builder, 3D exploded-to-assembled rig, compatibility engine, TDP calculator, FPS benchmark, 30-min auto-logout |
| **Singularity** | $\Omega$ | `(∞, ∞, ∞, ∞)` | Contact Singularity | Gravitational lensing black hole, accretion disk shader, glassmorphic contact & guestbook transmission |

---

## 🏗️ Polyglot Monorepo Architecture

```
Protfolio/
├── web/                       # React 18 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── data/content.ts    # Single source of truth for all factual content & TODOs
│   │   ├── components/
│   │   │   ├── canvas/        # Three.js Canvas, GPU Particle System, RigModel, Shaders
│   │   │   ├── chapters/      # 0D, 1D, 2D, 3D, 4D, and Singularity scenes
│   │   │   ├── hud/           # Dimension Meter, Navbar, Quality Tier Switcher
│   │   │   ├── tesseract/     # 4D Tesseract & Polytopes Wireframe Scene
│   │   │   ├── galaxy/        # 40+ Language Galaxy with Honesty Color-Coding
│   │   │   ├── terminal/      # Ctrl+K Command Palette / Terminal Emulator
│   │   │   └── audio/         # Tone.js Generative Ambient Synthesizer
│   │   ├── hooks/             # useTierDetection, useDimensionScroll
│   │   └── wasm/              # TypeScript 4D Math & WASM Bridge
├── wasm-core/                 # Rust Crate (4D Rotations, Polytopes, Julia Raymarching, Physics)
├── realtime-go/               # Go WebSocket Presence & Live Visitor Orbs
├── api-python/                # FastAPI Guestbook, Cached GitHub Stats, Ask Arth RAG
├── docker-compose.yml         # Multi-container local orchestration
└── .github/workflows/ci.yml   # Automated GitHub Actions CI/CD
```

---

## ⚡ Quick Start

### 1. Frontend Development (`web/`)

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Python Backend (`api-python/`)

```bash
cd api-python
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. All Services with Docker

```bash
docker-compose up --build
```

---

## 🎛️ Quality Tiers & Performance Architecture

The portfolio features adaptive GPU tiering, real-time performance governance with hysteresis, and a highly optimized rendering pipeline:

- **ULTRA**: 250,000 GPU particles, full PBR reflections, bloom, ACES tone mapping, DPR 2.0.
- **HIGH**: 120,000 GPU particles, bloom, chromatic aberration, DPR 1.5.
- **BALANCED**: 50,000 GPU particles, lightweight bloom, DPR 1.0.
- **LITE**: 15,000 GPU particles, zero post-processing, optimized for mobile battery life.
- **STATIC**: 1,500 particles, reduced motion, WCAG AA compliant.

### 🚀 Production Performance Benchmarks (Before vs After)

Measured on the production build (`npm run preview`) via Chrome DevTools Protocol & Playwright across 5 scenarios:

| Metric | Baseline (Pre-Optimization) | Optimized (Post-Verification) | Improvement |
| :--- | :--- | :--- | :--- |
| **Initial JS Bundle (raw)** | `1,452.4 kB` | **`51.8 kB`** | **-96.4% reduction** |
| **Initial JS Bundle (gzipped)** | `406.3 kB` | **`16.8 kB`** | **-95.9% reduction** |
| **Desktop Scroll FPS (avg)** | `12.5 FPS` | **`101.7 FPS`** | **+89.2 FPS** |
| **Desktop Scroll 1% Low FPS** | `10.9 FPS` | **`40.0 FPS`** | **+29.1 FPS** |
| **Desktop Dropped Frames** | `100.0%` | **`9.9%`** | **-90.1% reduction in jank** |
| **Mobile Scroll FPS (avg)** | `18.7 FPS` | **`120.0 FPS`** | **+101.3 FPS (Max Refresh)** |
| **Mobile Scroll 1% Low FPS** | `15.0 FPS` | **`117.6 FPS`** | **+102.6 FPS** |
| **Total Blocking Time (TBT)** | `2,034 ms` | **`43 ms`** | **-97.9% reduction** |
| **Long Tasks (>50ms)** | `37 tasks` | **`1 task`** | **-36 fewer long tasks** |
| **Workshop 360 Drag FPS** | `38.8 FPS` | **`69.0 FPS`** | **Solid 60+ FPS** |

### 🛠️ Key Architectural Optimizations Applied

1. **GPU Vertex Shader Particle System (`ParticleSystem.tsx`)**:
   - Replaced heavy CPU `for` loop (500k iterations/frame) and continuous `posAttr.needsUpdate = true` buffer uploads with a custom Three.js `ShaderMaterial`.
   - Morphing between all dimensional targets (0D point, 1D laser, 2D origami plane, 3D space, 4D hypercube, Singularity spiral) and mouse gravity well are computed on the GPU in parallel at zero CPU cost.
   - Point size calibrated to eliminate GPU fill-rate overdraw.
2. **Dual-Canvas Culling & Visibility Lifecycle**:
   - `DimensionCanvas` render loop maintains continuous lightweight background animation (`frameloop="always"`) across all chapters including Singularity, managed by a robust visibility state machine that pauses on background tabs (`document.hidden`) and restores on focus.
   - Paused `WorkshopCanvas` (`frameloop={isInView ? 'always' : 'never'}`) via `IntersectionObserver` when scrolled away from the Workshop.
3. **Route-Level Code-Splitting & Vendor Chunking**:
   - Split chapters into lazy chunks with `React.lazy()` and `Suspense`.
   - Isolated `three-vendor`, `motion-vendor`, `ui-vendor`, and lazy-loaded `ToneAudio` on demand.
   - Reduced initial entry JavaScript bundle to just **16.8 kB gzipped** (well under the 200 kB budget).
4. **Eliminated 60Hz React Re-render Thrashing**:
   - Throttled FPS state updates in `useTierDetection.ts` to 3Hz.
   - Implemented real-time Auto-Quality Governor with hysteresis (downgrade after 2s of <40 FPS; upgrade after 10s of sustained >=58 FPS).
   - Replaced `setCameraYaw` React state inside `WorkshopCanvas.tsx`'s frame loop with direct DOM ref updates for the compass gizmo.
5. **Mobile Fill Rate & Containment**:
   - Replaced heavy `backdrop-filter: blur(24px)` with `blur(8px)` on mobile viewports.
   - Applied CSS `content-visibility: auto` to offscreen chapters to skip layout and painting until scrolled near.

---

## 🛡️ License & Attribution

Designed and engineered by **Arth Jadav**. Released under the MIT License.
