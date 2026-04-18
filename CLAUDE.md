# Portfolio — Project Guidelines

## Project Overview
Personal tech VA portfolio website. Goal: visually striking, production-grade, non-generic.

## Tech Stack (Default)
- **Framework:** Next.js (App Router, React Server Components by default)
- **Styling:** Tailwind CSS v4 — use `@tailwindcss/postcss` in postcss config, NOT the `tailwindcss` plugin
- **Animation:** Framer Motion for UI/Bento interactions; GSAP/ThreeJS ONLY for isolated full-page scrolltelling
- **Icons:** `@phosphor-icons/react` — `strokeWidth={1.5}` globally. No Lucide. No emoji.
- **Fonts:** `Geist`, `Satoshi`, `Cabinet Grotesk`, or `Outfit`. `Inter` is **banned**.

## Design Baseline (Global Dials)
| Dial | Value | Meaning |
|---|---|---|
| DESIGN_VARIANCE | 8 | Asymmetric layouts, fractional CSS Grid, massive negative space zones |
| MOTION_INTENSITY | 6 | Fluid CSS transitions + Framer Motion spring physics; no scroll-hijack |
| VISUAL_DENSITY | 4 | Daily-app spacing — comfortable, not airy, not packed |

## Architecture Rules

### Components
- Default to **Server Components**. Wrap interactive leaf nodes with `"use client"` — never hoist it up.
- Perpetual animations and infinite loops **must** be isolated in their own micro Client Components (`React.memo`).
- Never use `useState` for magnetic hover or continuous animations — use `useMotionValue` / `useTransform`.

### Layout
- Full-height sections: `min-h-[100dvh]` — **never** `h-screen` (iOS Safari bug).
- Page containers: `max-w-[1400px] mx-auto` or `max-w-7xl`.
- Structure: CSS Grid (`grid grid-cols-1 md:grid-cols-3 gap-6`). No flexbox percentage math.
- On mobile (`< 768px`): all asymmetric layouts **must** collapse to single-column (`w-full px-4`).

### Forbidden Patterns
- No centered Hero sections (DESIGN_VARIANCE = 8 → use Split Screen or Asymmetric Left/Right)
- No 3-equal-card horizontal rows → use 2-col zig-zag or asymmetric Bento grid
- No `h-screen`, no `box-shadow` neon glows, no pure `#000000`
- No gradient text on large headers
- No Inter, Roboto, Arial, or system-ui fonts
- No AI-purple/neon color schemes — use Zinc/Slate neutrals + one accent (Emerald, Electric Blue, or Deep Rose, saturation < 80%)
- No emoji anywhere in code or markup
- No generic placeholder data ("John Doe", "99.99%", "Acme Corp")

## Motion Rules
- All spring animations: `type: "spring", stiffness: 100, damping: 20`
- Animate only `transform` and `opacity` — never `top`, `left`, `width`, `height`
- List/grid reveals: stagger via `staggerChildren` or `animation-delay: calc(var(--index) * 100ms)`
- `useEffect` animations **must** include cleanup functions
- Never use `window.addEventListener('scroll')` — use Framer Motion scroll hooks

## UI States (Mandatory)
Every interactive component must implement:
- **Loading:** Skeletal loaders matching layout geometry (no generic spinners)
- **Empty:** Composed empty state showing how to populate
- **Error:** Inline error text below the relevant input
- **Active/Tactile:** `-translate-y-[1px]` or `scale-[0.98]` on `:active`

## Dependency Verification
Before importing any third-party package, check `package.json`. If missing, output the install command before the code.

## Design Arsenal (Reference Concepts to Pull From)
- **Bento 2.0:** `rounded-[2.5rem]`, `shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]`, labels outside/below cards
- **Glassmorphism:** `backdrop-blur` + `border-white/10` + `shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`
- **Magnetic Buttons:** `useMotionValue` + `useTransform` — never `useState`
- **Stagger Reveals:** `staggerChildren` in a unified Client Component tree
- **Asymmetric Hero:** Text left-aligned; background image with directional fade into page color
- Spotlight Border Cards, Parallax Tilt, Skeleton Shimmer, Mesh Gradient Backgrounds

## Pre-Flight Checklist
Before delivering any component:
- [ ] `min-h-[100dvh]` on full-height sections?
- [ ] Mobile collapse guaranteed for asymmetric layouts?
- [ ] Perpetual animations isolated in their own `React.memo` Client Component?
- [ ] `useEffect` cleanup present?
- [ ] Loading, empty, and error states implemented?
- [ ] No Inter font, no emoji, no 3-equal-card row?
- [ ] All third-party imports verified against `package.json`?
