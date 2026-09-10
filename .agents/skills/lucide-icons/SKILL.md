---
name: lucide-icons
description: Standardized icon system using Lucide Icons for the Auto-City website revamp. Provides naming conventions, responsive sizing classes, stroke width standards, and dynamic rendering protocols.
---

# Lucide Icons System for Auto-City

This skill guides the usage of **Lucide Icons** across the Auto-City web revamp.

## Architecture

* **Library File:** `js/lucide.min.js` (vendored local UMD build for fast offline loading) with CDN fallback.
* **Initialization:** Automated in `js/main.js` via `lucide.createIcons()` with standardized `stroke-width: 1.85`.
* **Markup Convention:**
  ```html
  <i data-lucide="layers" class="icon-md"></i>
  ```

## Sizing Classes

Class | Dimensions | Best For
:--- | :--- | :---
`.icon-sm` | 14px x 14px | Micro-badges, status pills, table metadata
`.icon-md` | 18px x 18px | Standard button icons, navigation links, list items
`.icon-lg` | 24px x 24px | Feature card headers, hero highlights, avatar boxes
`.icon-xl` | 32px x 32px | Empty states, focal visual blocks

## Guidelines

1. **Global Stroke Standardization:**
   Keep icon stroke weights calibrated to `1.85` or `2.0` across all pages. Never mix hair-thin icons with chunky icons.
2. **Semantic Usage:**
   Ensure decorative icons are paired with text or carry an `aria-hidden="true"` attribute; icon-only buttons must include an `aria-label`.
3. **Dynamic Elements:**
   If HTML is injected dynamically (e.g., directory filtering or modal injection), call `lucide.createIcons()` immediately after updating the DOM.
