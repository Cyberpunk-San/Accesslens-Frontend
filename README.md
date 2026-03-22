# AccessLens: Frontend Hub

The AccessLens frontend is a high-performance, **Next.js 14** application designed with a **"Cyber HUD"** (Heads-Up Display) aesthetic. It prioritizes real-time data visualization, spatial awareness, and accessibility remediation.

---

## Architecture

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) | Utilizing **App Router** for optimized server-side rendering and routing. |
| **State Management** | [TanStack Query](https://tanstack.com/query/v5) | Full-scale data orchestration with intelligent caching and background updates. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | A cutting-edge utility-first engine for high-density, performant UI logic. |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth, physics-based micro-interactions for reports and data maps. |
| **Visual Library** | [Lucide React](https://lucide.dev/) | Consistent, semantic iconography for accessibility indicators. |

---

## Design System: The "Cyber HUD"

The AccessLens UI is built on a **High-Contrast Nordic Cyber Palette**. It's designed to be both visually stunning and conform to the very accessibility standards it audits.

### Core Features:
- **Glassmorphism**: Backdrop blur and frosted glass surfaces for deep layering.
- **HUD Command Panels**: Space-optimized layouts for dense audit telemetry.
- **Spatial Mapping**: Direct visual overlays on the Accessibility Tree.
- **Vivid Status Colors**: Critical (Rose-500), Serious (Orange-500), Healthy (Emerald-500).

---

## Key Modules

### 1. Intelligence Hub (`src/app/audit/[id]`)
The core results dashboard. It maps issues spatially over the viewport and presents the "Accessibility Tree" in an interactive visualizer.

### 2. Shell Navigation (`src/components/layout/Shell`)
A standardized navigation layer featuring our custom **3D isometric logo** and a fully responsive sidebar.

### 3. Gauge Ecosystem (`src/components/charts`)
Custom charts for **Confidence Gauges**, **Severity Distributions**, and **Engine Breakdowns**.

---

## Development & Optimization

- **Standalone Output**: Optimized for Docker with `output: 'standalone'` in `next.config.js`.
- **Image Intelligence**: Integrated with `sharp` for high-speed image optimization.
- **Strict Typing**: 100% **TypeScript** coverage for robust data handling.

*Empowering developers to build a more accessible web, one pixel at a time.*
