---
name: brand-revamp
description: Tracks and applies brand design tokens, visual references, pixel-perfect layout conventions, and front-end component guidelines for the Auto-City website revamp.
---

# Auto-City Brand Revamp Skill

This skill guides the design, development, and maintenance of the Auto-City front-end website revamp.

## Core Brand Standards

### 1. Color Palette Architecture (70 / 20 / 10 Rule)
- **70% White / Light Clean Space**:
  - Foundation canvas (`#ffffff`), light surface elevations (`#f8fafc`), and subtle borders (`#e2e8f0`).
  - Dark mode option uses Obsidian neutral scale (`#090d16`, `#0d1322`, `#131c31`, `#1e293b`).
- **20% Darkened Cobalt Blue Structure**:
  - Signature Darkened Cobalt Blue: `#1d4ed8` (`var(--color-blue-600)` / `var(--color-brand-blue)`).
  - Complete 11-step scale: `#f0f6ff` (50) to `#061226` (950).
  - Used for navigation framing, structural badges, secondary buttons, icons, and focus outlines.
- **10% Racing Red Accent**:
  - Official Accent Red: `#e10021` (`var(--color-accent-red)`).
  - Hover: `#c5001d`, Active: `#a80018`, Glow: `rgba(225, 0, 33, 0.25)`.
  - Reserved strictly for primary action CTAs (`.btn-primary`), urgent status indicators, and energetic accents.

### 2. Typography Rules (Single Source of Truth & Zero Monospace)
- **Single Source of Truth (SSoT)**: All typography imports and font variables are strictly governed by `css/brand-tokens.css`. Any future font change in `css/brand-tokens.css` automatically updates the entire project.
- **Display Headings**: **Creato Display** (`font-weight: 400, 500, 700`).
- **Body & Subtitles**: **Switzer** from Fontshare (`font-weight: 400, 500, 600, 700`).
- **STRICT RULE - Weight Ceiling**: Never go past **Bold (700 max)** anywhere in the project. Weights 800 and 900 are prohibited.
- **Data / Numeric Specimens**: Use Switzer with `font-variant-numeric: tabular-nums; font-feature-settings: 'tnum', 'zero';`.
- **STRICT RULE - Zero Monospace**: Do NOT use `JetBrains Mono` or ANY monospace font throughout the website.

### 3. Official Vector Logo Insignia
- Extracted and traced from authentic brand assets with the `(R)` symbol omitted:
  - `Graphic/auto-city-logo.svg` : Primary `#e10021` Red vector mark with transparent counter cutouts.
  - `Graphic/auto-city-logo-white.svg` : Pure white inverted vector mark for dark/cobalt backgrounds.
  - `Graphic/auto-city-logo-mono.svg` : Dynamic `currentColor` vector mark.
  - `Graphic/auto-city-logo.png` : High-resolution rendered preview.
- Minimum clear space clearance: 1.0x Capital "A" height (minimum 32px on all sides).

## Responsibilities

1. **Pixel-Perfect Implementation**:
   - Translate visual mockups, screenshots, and live URL references into clean HTML5/CSS3.
   - Use fluid responsive sizing (`clamp()`, flexbox, CSS grid).
   - Ensure visual consistency across viewports (Mobile: 375px–430px, Tablet: 768px–1024px, Desktop: 1280px–1920px).

2. **Living Documentation**:
   - Maintain `brand-guidelines.html` with color palettes, typography scale, buttons, form controls, and cards.
   - Maintain `research.html` with data matrices, competitor research, and market insights.
   - Update `index.html` showcase portal whenever new HTML templates or pages are created.

3. **Component Architecture**:
   - Store reusable component modules in `components/`.
   - Store shared stylesheet tokens in `css/main.css` and `css/header.css`.
   - Keep JavaScript interactions lightweight and vanilla in `js/main.js`.

### 4. Floating Pill Navigation Standards (Habitline Reference)
- **3-Island Architecture**:
  - Left: Brand pill (18px compact logo, zero subtags, no "Penang").
  - Center: Single-line menu row (strict `white-space: nowrap !important;`, 0 breaks).
  - Right: Action card (circular map button + Racing Red `#e10021` CTA pill inside a full border-radius `9999px` stadium capsule).
- **Modern Radii & Button Standard**:
  - Outer containers: `12px` (`--hl-radius-outer`) for Brand and Center Nav.
  - Action Card (Map & Plan Your Visit): **Full border radius** (`border-radius: 9999px !important;`) stadium capsule.
  - Inner menu links: `8px` (`--hl-radius-inner`).
  - **Universal Button Standard**: All action buttons (`.btn`, `.island-cta-btn`, `.island-squircle-btn`, `.ac-social-btn`, `.events-all-btn`, `.banner-cta-btn`, etc.) MUST use full border radius (`border-radius: 9999px` / `var(--radius-pill)` or `50%` for circular icon buttons) instead of squarish borders.
  - **Dark Gray Hover Rule**: Whenever a button uses a dark gray / charcoal / dark navy background (`#0f172a`, `#1e293b`, `rgba(18, 22, 32)`, `rgba(10, 31, 68)`), on `:hover` it MUST dynamically transition to Racing Red (`var(--color-accent-red, #e10021)`) with calibrated red shadow glow.
- **Inward-Closing Motion Physics**:
  - Duration: `1.15s` (`--hl-motion-duration`).
  - Curve: `cubic-bezier(0.32, 0.72, 0, 1)` (feathered Apple/Framer deceleration, zero abrupt jumps).
  - Scrolled contraction: `1260px` -> `1070px` numeric `max-width` with GPU layer promotion (`transform: translate3d(0, 0, 0);`), centering all 3 islands with exact balanced 12px gaps.
  - Scroll hysteresis buffer: trigger closed at `scrollY > 45px`, expand at `scrollY < 15px`.

### 5. Editorial Statement & Inline Capsule Pills (Habitline Reference)
- **Typographic Scale**: Fluid display heading in `Plus Jakarta Sans` (`font-weight: 600`, `clamp(2rem, 3.6vw, 3.125rem)`), `line-height: 1.32`, `letter-spacing: -0.025em`, zero monospace.
- **Capsule Anatomy**:
  - Avatar Pill: `clamp(66px, 6.2vw, 82px)` width, `clamp(34px, 3.2vw, 42px)` height, `border-radius: 9999px`, `vertical-align: -0.22em`, smooth image crossfading stack.
  - Weather Pill: `clamp(54px, 5vw, 68px)` width, `#e0f2fe` sky tint, 3D sun/cloud vector, playful spring hover tilt.
- **Supporting Narrative**: Secondary subtitle (`Switzer`, `clamp(1.05rem, 1.4vw, 1.25rem)`), accompanied by interactive hashtag pill chips (`#Founders`, `#ThemeParkRides`, etc.).
- **Dual Mode**: Light mode `#ffffff` / `#131515`, Dark mode `#090d16` / `#f8fafc`.
### 6. Prototype-First Principles (Core Mandate)
- **Scope Restriction**: This codebase is exclusively a visual and interactive front-end prototype.
- **Do Not Over-Engineer**: Avoid diving deep into back-end architectures, complex mock API layers, or deep business logic abstractions.
- **Top Execution Priorities**:
  1. **Visual Design**: High-end craft, crisp typography, clean token adherence, pixel-perfect alignment.
  2. **Animation & Motion**: Fluid micro-interactions, responsive hover/active tactile states, smooth scroll dynamics.
  3. **Layout & Cleanliness**: Resilient responsive layouts (mobile to desktop), neat modular components, and immediate presentation-readiness.

### 7. Social Video & Reels Carousel Standards ("Join in the fun")
- **Layout & Visual Canvas**:
  - Dark blueprint background (`#07090e`) with subtle linear grid pattern (`rgba(255, 255, 255, 0.035)`), cyan radial glow accents, and wide container padding.
  - Section title: "JOIN IN THE FUN", subtitle: "Explore viral bites, festival highlights, and live nightlife moments straight from our Penang community."
- **Reel Card Specs**:
  - 9:16 portrait ratio (`aspect-ratio: 9/16`), default width `290px`, `border-radius: 20px`, dark glass overlay.
  - Floating top category tag (vivid neon pills: `STREET BITES`, `ENTERTAINMENT`, `NIGHT FESTIVAL`, `CARNIVAL`, `CULINARY`, `HOTPOT DINING`, `PENANG FLAVORS`, `VIRAL GUIDE`).
  - View count indicator with Lucide eye icon and bottom overlay title.
  - Frosted glass play circle button centered (`backdrop-filter: blur(10px)`).
- **Video & Autoplay Engine**:
  - Authentic 4-second seamless looping MP4 video clips (`assets/videos/reels/*.mp4`) paired with fallback JPG posters (`assets/images/reels/*.jpg`).
  - `IntersectionObserver` autoplay controller: plays muted video on viewport entry, pauses when scrolled away to conserve battery and CPU.
  - Interactive track: drag-to-scroll cursor, tactile hover lifts (`translateY(-6px)`), and carousel arrow buttons with auto boundary disabling.

### 8. Enclosed Island Footer Standards (Orchid Security Reference)
- **Architecture & Canvas**:
  - Enclosed floating island card (`.ac-footer-shell`) with large `32px` rounded curvature (`border-radius: clamp(24px, 3.2vw, 36px)`), resting on a subtle cool ground (`#f8fafc` to `#f1f5f9`).
  - Elevated card surface (`#ffffff`) with subtle 1px border (`rgba(226, 232, 240, 0.95)`), inner white glow, and soft multi-tier drop shadows (`0 24px 60px -12px rgba(15, 23, 42, 0.06)`).
- **Brand & Social Geometry**:
  - Left column features official vector brandmark, township description, and 38px circular full-radius social buttons (LinkedIn, Facebook, X, YouTube, Instagram, TikTok) with 2.5px spring hover lift and Cobalt Blue glow.
- **Structured Destination Navigation**:
  - Headings in `Creato Display` (Bold 700 max), links in `Switzer` with 3px horizontal glide on hover (`color: #1d4ed8`).
- **3x2 Authentic Brand Badge Grid (Frameless & Static)**:
  - Six authentic brand marks sourced directly from Wikipedia/Wikimedia Commons and official government portals (stored in `Graphic/badges/`):
    1. Tourism Malaysia (*Malaysia Truly Asia* vector, Wikimedia Commons)
    2. Penang State Government (*Coat of Arms of Penang* vector, Wikimedia Commons)
    3. Penang Global Tourism (*PGT* official state logo, `mypenang.gov.my`)
    4. Tripadvisor (*Tripadvisor* stacked owl mark, Wikimedia Commons)
    5. Halal Malaysia (*MS 1500* official certification seal, `halal.gov.my`)
    6. Majlis Bandaraya Seberang Perai (*MBSP* municipal council crest, Wikimedia Commons)
  - Presented frameless (no container boxes, no borders, no drop shadows) directly on the white footer surface with zero hover shifts.
- **Hairline Divider & Legal Strip**:
  - Subtle gradient divider spanning 100% width, followed by copyright statement and legal policy links separated by bullets (`•`).

