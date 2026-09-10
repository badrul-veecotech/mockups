# Auto-City Website Revamp : Project Guidelines & Agent Instructions

This repository contains the front-end design revamp for **Auto-City**.

## 1. Directory Structure

```
Auto-City/
├── index.html              # Central showcase & review portal (visual previews of all pages)
├── research.html           # Brand & competitor research, market data & audit findings
├── brand-guidelines.html   # Living design system (colors, typography, UI components, tone)
├── pages/                  # Revamped subpages and templates
├── components/             # Reusable UI components (header, footer, cards, modals)
├── css/                    # Shared styles and design tokens
├── js/                     # Shared scripts and interactivity
├── Graphic/                # Graphic design assets, logos, and reference visuals
└── .agents/
    ├── AGENTS.md           # Master agent configuration & rules (this file)
    └── skills/
        └── brand-revamp/   # Custom skill for maintaining tokens, pages & research
```

## 2. Core Agent Protocols

### A. Pixel-Perfect Execution
- Always inspect reference images, dimensions, and URLs thoroughly before generating layout code.
- Match typography weights, line-heights, letter-spacing, padding, and drop shadows exactly to references.
- Utilize CSS flexbox and grid with modern responsive standards (`rem`, clamp, CSS custom properties).

### B. Showcase Portal Updates
- Whenever a new page or section is added in `pages/` or elsewhere, register it immediately in `index.html` so it appears in the visual showcase grid with preview thumbnails and status badges.

### C. Living Brand Guidelines
- Keep `brand-guidelines.html` updated with every new design token, button state, typography style, and color variable introduced during the design process.

### D. Research Dossier
- Record online research, competitive analysis, SEO audits, and content matrices into `research.html`.

### E. Skill & Agent Management
- Keep `.agents/skills/brand-revamp/SKILL.md` updated as new design conventions and section patterns emerge.
- Install and configure new skills immediately when requested.

## 3. Prototype-First Directives (Mandatory)

This project is strictly a **high-fidelity front-end prototype**. All future coding and design iterations must adhere to these directives:

1. **Avoid Over-Engineering**:
   - Do not dive deep into complex backend logic, heavy state management, database abstractions, or unnecessary infrastructure layers.
   - Keep JavaScript lightweight, vanilla, modular, and directly executable without convoluted build pipelines.

2. **Top Priorities: Design, Animation & Layout**:
   - **Front-End Design**: Premium visual polish, precise typography weights, calibrated contrast, and brand compliance.
   - **Animation & Motion**: Smooth micro-interactions, tactile hover and push feedback, seamless transitions, and responsive scroll effects that feel alive.
   - **Layout Discipline**: Pixel-perfect alignment, clean responsive viewports (390px mobile up to 1920px desktop), and robust CSS Grid/Flexbox architecture.

3. **Neat, Self-Contained & Presentation-Ready**:
   - Keep code organized, readable, and immediately testable in the browser.
   - Ensure every page, component, and modal works cleanly for stakeholder demonstrations and live visual reviews.
