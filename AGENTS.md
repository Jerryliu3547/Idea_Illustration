<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Context & Engineering Rules (`AGENTS.md`)

## 1. Project Overview

**AI Term Visualizer (`ai-concepts-visualizer`)** is an interactive educational web application that explains core concepts in Large Language Models (LLMs), Reinforcement Learning Alignment (RLHF, PPO, DPO, GRPO, KL Divergence), Parameter-Efficient Fine-Tuning (LoRA/QLoRA), Training Optimization (MoE), Reasoning (CoT, ToT, ReAct), Self-Improvement (STaR), Test-Time Adaptation (PERK, Learning Paradigms), Agentic Evaluation, Context Engineering, and AI Philosophy (The Bitter Lesson).

Every concept module combines:
- Mathematical formulations & derivations rendered with **KaTeX**
- Interactive **sandboxes, simulators, and step-by-step trace players**
- High-resolution **architectural diagrams & figures** with fullscreen zoom modals
- Empirical **benchmark visualizations**
- Embedded **author lectures (YouTube)** and **original research paper (arXiv)** references

---

## 2. Tech Stack & Environment

- **Framework**: Next.js `16.3.2` (App Router) with React `19.2.8` and TypeScript `5` (`strict: true`)
- **Build & Deployment**: Static HTML export (`output: "export"` in `next.config.ts`) deployed automatically to GitHub Pages (`https://<username>.github.io/Idea_Illustration`) via `.github/workflows/deploy.yml` on pushes to `master`.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`, `@import "tailwindcss"` in `app/globals.css`) with custom dark-mode glassmorphism utilities (`.glass-panel`, `.glass-panel-hover`, `.glow-text-*`, `.glow-box-*`).
- **Math Rendering**: `katex` via `<MathFormula />` (`components/ui/MathFormula.tsx`).
- **Icons**: `lucide-react`.
- **Charts & Motion**: `recharts`, `framer-motion`, and custom interactive SVG/Tailwind components.
- **Path Alias**: `@/*` resolves to the repository root (`./*`).
- **Python Tooling Rule**: If running any auxiliary Python scripts (e.g., for image/asset processing), always use `uv` instead of `pip` (`uv run`, `uv pip install`, etc.).

---

## 3. Repository Architecture

```text
.
├── app/
│   ├── layout.tsx                        # Root dark layout: sticky <Sidebar />, scrollable <main>, <BackToTop />
│   ├── globals.css                       # Tailwind v4, KaTeX CSS, dark theme variables, readability font-size upgrades
│   ├── page.tsx                          # Overview Dashboard displaying all domain categories & concept cards
│   └── <domain-or-concept>/              # Route directories (e.g., /llm-basics/transformer, /ppo, /context-engineering/...)
│       └── page.tsx                      # Thin Server Component exporting Next.js metadata & rendering a Visualizer
├── components/
│   ├── navigation/
│   │   └── Sidebar.tsx                   # Collapsible folder-tree sidebar navigation
│   ├── ui/
│   │   ├── MathFormula.tsx               # KaTeX inline & block formula component
│   │   └── BackToTop.tsx                 # Floating scroll-to-top button (scrolls both window & <main>)
│   └── visualizers/
│       └── *Visualizer.tsx               # Self-contained interactive Client Components ("use client")
├── lib/
│   └── asset.ts                          # getAssetPath() helper for GitHub Pages basePath compatibility
├── public/
│   └── images/                           # Static diagrams, schematics, and lecture/paper figures
└── next.config.ts                        # Static export config + conditional basePath ("/Idea_Illustration" in prod)
```

---

## 4. Mandatory Rules for Adding or Updating Content

### Rule 1: 3-Place Registration Checklist for New Concepts/Pages
Whenever you add a new concept page, tab, or domain category, you **MUST** update all three locations to keep navigation synchronized:
1. **App Route (`app/.../page.tsx`)**:
   - Create the route file as a Server Component exporting `metadata` (`title`, `description`) and rendering the target component from `@/components/visualizers/...`.
2. **Sidebar Navigation (`components/navigation/Sidebar.tsx`)**:
   - Add the route item (with `name`, `href`, `icon`, `badge`, `color`) to `treeNavigation`.
   - If adding a new top-level category folder, also add its `id` to the `expandedCategories` initial state object in `Sidebar.tsx` set to `false` (**all sidebar categories must default to closed** and only auto-expand when `pathname` matches a child route).
3. **Overview Dashboard (`app/page.tsx`)**:
   - Add a `ConceptItem` card (with `id`, `title`, `subtitle`, `href`, `icon`, `color`, `badge`, `formula`, `desc`) to the `categories` array so the home page reflects the new module.
   - Update hero/sidebar summary counts if total domains or visualizers change.

### Rule 2: Static Export & Asset Paths (`getAssetPath`)
Because the site is exported statically (`output: "export"`) and served under `/Idea_Illustration` in production:
- **NEVER** pass raw `/images/...` strings directly to `src` attributes on `<Image />` or `<img />`.
- **ALWAYS** wrap local asset paths with `getAssetPath('/images/your_image.png')` imported from `@/lib/asset`.
- When using `next/image` (`<Image />`), always include the `unoptimized` prop and explicit `width` and `height` attributes.

### Rule 3: Mathematical Equations (`<MathFormula />`)
- Always render mathematical notation and equations using `<MathFormula math="..." />` (inline) or `<MathFormula math="..." block />` (display block) from `@/components/ui/MathFormula`.
- Ensure backslashes are properly escaped (`\\frac`, `\\mathcal`, `\\theta`) when defined inside TypeScript string literals (such as in `app/page.tsx`).

### Rule 4: Multi-Tab Domain Modules
For multi-page domains (such as **Agentic Evaluation** or **Context Engineering**):
- Provide a **Top Tab Navigation Bar** at the top of the visualizer (`Tab 1: ...`, `Tab 2: ...`, etc.) so users can switch seamlessly between sibling pages within the domain as well as via the left sidebar.
- Include a hero overview banner summarizing the active tab's core badge, title, subtitle, description, and numbered key topic pills.

---

## 5. Visualizer Page Structure & UX Conventions

Every visualizer in `components/visualizers/*Visualizer.tsx` must be a rich, interactive Client Component (`"use client"`) following these layout and UX patterns:

1. **Page Container**:
   - Use `<div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">` (or `space-y-10`).
2. **Header Block**:
   - Uppercase domain eyebrow with icon (`text-xs` or `text-sm font-semibold uppercase tracking-wider`), bold `h1` (`text-3xl font-extrabold text-white tracking-tight`), and a concise conceptual overview paragraph (`text-slate-400`).
3. **Sticky Quick Section Bookmarks Bar**:
   - Include a sticky navigation bar (`sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border ... rounded-2xl p-4 shadow-2xl`) with numbered bookmark buttons (`1. ...`, `2. ...`) that smoothly scroll to section IDs via `document.getElementById('section-...')?.scrollIntoView({ behavior: 'smooth' })`.
4. **Interactive Sandboxes & Simulators**:
   - Do not build static-only text pages. Include interactive learning tools such as:
     - Preset scenario switchers (e.g., valid vs. failure modes, token routing contexts)
     - Sliders (`input[type="range"]`) for hyperparameters ($\beta$, $\epsilon$, temperature $T$, rank $r$, noise)
     - Step-by-step trace/execution players (`Next Step`, `Reset`, live state inspection)
     - Side-by-side comparison cards (e.g., Brittle vs. Robust, Standard vs. CoT, RAG vs. Agentic Search, Scratchpad vs. Memory)
5. **Diagrams, Figures & Fullscreen Zoom Modal**:
   - **Layout & Sizing**: Place diagrams in readable 1-column or 2-column layouts (`grid-cols-1 md:grid-cols-2 gap-6`), **never** in cramped 4-column thumbnail grids. Use generous max heights (`max-h-80` to `max-h-[420px]`, `object-contain`).
   - **Light-Background Figures**: Wrap white-background diagrams in a light container (`bg-white/95 p-2 rounded-xl`) inside the dark card so diagrams remain crisp and high-contrast.
   - **Click-to-Expand Modal**: Use the `FigureCard` + `modalImage` state pattern with a `<Maximize2 /> Fullscreen` button and a fixed backdrop modal (`z-50 bg-black/80 backdrop-blur-sm`) so users can inspect every figure at full resolution.
6. **Author Video Walkthrough Section (When Applicable)**:
   - Embed the YouTube player in a responsive `aspect-video` container (`https://www.youtube.com/embed/<VIDEO_ID>` or with `?start=<SECONDS>`).
   - **Always include a "Backup Direct Link" bar** immediately below the embedded `<iframe>` with an `<ExternalLink />` link to the full `https://www.youtube.com/watch?v=...` URL.
7. **Original Research Paper Reference Section (When Applicable)**:
   - Include a dedicated card with the paper title, authors, publication venue/year, an italicized key quote/abstract box, and two action buttons:
     - **ArXiv Abstract** (`https://arxiv.org/abs/<ID>`)
     - **Open PDF** (`https://arxiv.org/pdf/<ID>`)
8. **Back-to-Top Scrolling**:
   - Because `<main>` is an independent scroll container on desktop (`overflow-y-auto`), any custom "Back to Top" button must scroll both `window.scrollTo({ top: 0, behavior: 'smooth' })` and `document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })`.

---

## 6. Styling, Color System & Typography Preferences

- **Dark Mode Palette**:
  - App background: `#090d16` with subtle radial gradients (`app/globals.css`)
  - Primary card surface: `bg-slate-900/60` or `bg-slate-950/70` with `border-slate-800` and `.glass-panel`
  - Code / terminal blocks: `bg-slate-950` with `border-slate-800` and `font-mono`
- **Semantic Accent Colors**:
  - **Indigo (`indigo-400`/`500`)**: PPO, Context Engineering foundations, Post-Training, primary interactive controls
  - **Purple (`purple-400`/`500`)**: GRPO, Chain-of-Thought, Agentic Memory, Learning Paradigms
  - **Cyan (`cyan-400`/`500`)**: Transformer Attention, KL Divergence, Tree of Thoughts, PERK, Agentic Search, Agent Trajectory Evaluation
  - **Emerald (`emerald-400`/`500`)**: DPO, LoRA/QLoRA, Code & LLM Judges, passing checks / ground-truth verification
  - **Amber / Orange (`amber-400`/`500`, `orange-400`)**: Softmax, RLHF Pipeline, Mixture of Experts (MoE), ReAct, STaR, Context Management, Production Flywheel
  - **Rose (`rose-400`/`500`)**: Knowledge Distillation, The Bitter Lesson, error/failure states, author lecture sections
- **Typography & Global Font-Size Rules**:
  - `app/globals.css` intentionally upgrades small Tailwind utility classes (`.text-[10px]`, `.text-[11px]`, `.text-xs`, `.text-sm`) to slightly larger rem values for readability on high-DPI dark screens. **Do not remove or override these rules in `app/globals.css`.**
  - Use `font-mono` (`JetBrains_Mono`) for badges, section numbers, code snippets, JSON schemas, trace logs, and formulas.
  - Use sans-serif (`Inter`) for headings and conceptual explanations.

---

## 7. Build & Quality Verification

Before completing any feature or modification:
1. Run `npm run build` to verify TypeScript types, Next.js App Router metadata/routes, and static export generation (`./out`).
2. Run `npm run lint` to ensure zero ESLint or React hooks/JSX warnings (e.g., properly escape quotes `&quot;` or `&apos;` in JSX text).
