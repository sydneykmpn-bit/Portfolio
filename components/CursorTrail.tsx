'use client';

import { useEffect, useRef, memo } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TUNING — change these without touching the animation logic
// ─────────────────────────────────────────────────────────────────────────────
const COUNT      = 18;   // total trail particles
const LEAD_LERP  = 0.20; // lead dot lag factor (1 = instant snap)
const LERP_DECAY = 0.010; // how much slower each subsequent dot is
const MIN_LERP   = 0.042; // floor so the tail never fully stops

// ─────────────────────────────────────────────────────────────────────────────
// COLOR PALETTES  (18 stops — index 0 = lead / front, index 17 = tail / back)
// ─────────────────────────────────────────────────────────────────────────────

// DARK MODE: bright glowing cyan/sky → deep navy
// The lead particles pop on dark backgrounds; the trail sinks into shadow.
const DARK: readonly string[] = [
  '#E0F2FE', // sky-100  ← lead (brightest)
  '#BAE6FD', // sky-200
  '#7DD3FC', // sky-300
  '#38BDF8', // sky-400
  '#0EA5E9', // sky-500
  '#38BDF8', // sky-400  (doubles back for a softer mid-gradient)
  '#0EA5E9', // sky-500
  '#0284C7', // sky-600
  '#0369A1', // sky-700
  '#075985', // sky-800
  '#60A5FA', // blue-400
  '#3B82F6', // blue-500
  '#2563EB', // blue-600
  '#1D4ED8', // blue-700
  '#1E40AF', // blue-800
  '#1E3A8A', // blue-900
  '#1E3A8A', // blue-900
  '#172554', // blue-950 ← tail (deepest)
];

// LIGHT MODE: deep saturated navy → medium sky-blue
// The lead particles are the darkest so they stand out on white backgrounds;
// the tail fades toward lighter, almost-invisible blues.
const LIGHT: readonly string[] = [
  '#1E3A8A', // blue-900 ← lead (most visible on white)
  '#1E40AF', // blue-800
  '#1D4ED8', // blue-700
  '#2563EB', // blue-600
  '#2563EB', // blue-600
  '#1D4ED8', // blue-700 (reinforcing the deep section)
  '#3B82F6', // blue-500
  '#2563EB', // blue-600
  '#3B82F6', // blue-500
  '#3B82F6', // blue-500
  '#60A5FA', // blue-400
  '#60A5FA', // blue-400
  '#93C5FD', // blue-300
  '#60A5FA', // blue-400
  '#93C5FD', // blue-300
  '#BAE6FD', // sky-200
  '#BFDBFE', // blue-200
  '#E0F2FE', // sky-100  ← tail (fades into white background)
];

// ─────────────────────────────────────────────────────────────────────────────
// THEME HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function isDarkTheme(): boolean {
  // 1. Check data-theme attribute (our ThemeToggle uses this)
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark')  return true;
  if (attr === 'light') return false;
  // 2. Fallback to class-based check
  if (document.documentElement.classList.contains('dark'))  return true;
  if (document.documentElement.classList.contains('light')) return false;
  // 3. Final fallback: OS preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Apply the correct color palette + glow/shadow to every trail node.
// Called once on mount and again whenever the theme changes.
function applyPalette(nodes: HTMLDivElement[], dark: boolean): void {
  const palette = dark ? DARK : LIGHT;
  nodes.forEach((el, i) => {
    const t  = i / (COUNT - 1); // 0 = lead, 1 = tail
    const ci = Math.min(i, palette.length - 1);
    el.style.background = palette[ci];

    if (dark) {
      // Glowing outer halo — only meaningful on the first ~5 dots
      const glowPx    = Math.round(Math.max(0, 12 - t * 16));
      const glowAlpha = Math.max(0, 0.70 - t * 0.95);
      el.style.boxShadow =
        glowAlpha > 0.04
          ? `0 0 ${glowPx}px rgba(56,189,248,${glowAlpha.toFixed(2)}),` +
            `0 0 ${glowPx * 2}px rgba(14,165,233,${(glowAlpha * 0.35).toFixed(2)})`
          : 'none';
    } else {
      // Subtle downward shadow helps the trail stay legible on very light pages
      const sAlpha = Math.max(0, 0.28 - t * 0.32);
      const sPx    = Math.round(Math.max(0, 6 - t * 7));
      el.style.boxShadow =
        sAlpha > 0.02
          ? `0 1px ${sPx}px rgba(30,58,138,${sAlpha.toFixed(2)})`
          : 'none';
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface Cfg { ox: number; oy: number; }

export default memo(function CursorTrail() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip entirely on touch / stylus — no mouse to follow, saves battery
    if (window.matchMedia('(pointer:coarse)').matches) return;

    const root = rootRef.current!;
    const cfgs:  Cfg[]           = [];
    const nodes: HTMLDivElement[] = [];

    // ── Build DOM nodes (once) ──────────────────────────────────────────────
    for (let i = 0; i < COUNT; i++) {
      const t = i / (COUNT - 1);

      // Size: lead is largest (12 px wide), tail is smallest (3.5 px wide)
      const w = Math.max(3.5, 12 - t * 8.5);
      const h = w * 1.55; // ~1.55:1 ratio gives the teardrop proportions

      // Opacity: fully opaque lead → nearly invisible tail
      const opacity = Math.max(0.05, 1 - t * 0.95);

      // Blur: the first 3 dots stay crisp; trailing ones get up to 1.4 px blur
      // This creates a subtle depth-of-field feel without hurting perf
      const blur = i < 3 ? 0 : Math.min((t - 0.15) * 1.8, 1.4);

      cfgs.push({ ox: w / 2, oy: h / 2 });

      const styles = [
        'position:absolute',
        `width:${w.toFixed(2)}px`,
        `height:${h.toFixed(2)}px`,
        // Teardrop shape:
        //   horizontal radii   — 50% on all four corners (makes it oval)
        //   vertical radii     — 12% on top corners (nearly-flat → looks pointed)
        //                        50% on bottom corners (full half-circle)
        'border-radius:50% 50% 50% 50% / 12% 12% 50% 50%',
        `opacity:${opacity.toFixed(3)}`,
        // Start far off-screen so there's no flash before the first mousemove
        'transform:translate3d(-9999px,-9999px,0)',
        'pointer-events:none',
        'will-change:transform',
        // Smooth crossfade when the user switches themes
        'transition:background 0.45s ease, box-shadow 0.45s ease',
      ];
      if (blur > 0.05) styles.push(`filter:blur(${blur.toFixed(2)}px)`);

      const el = document.createElement('div');
      el.style.cssText = styles.join(';');
      root.appendChild(el);
      nodes.push(el);
    }

    // ── Apply initial theme colors ──────────────────────────────────────────
    applyPalette(nodes, isDarkTheme());

    // ── Watch for theme changes (MutationObserver — zero cost when idle) ────
    // Fires whenever data-theme or class attributes change on <html>
    const themeObserver = new MutationObserver(() => {
      applyPalette(nodes, isDarkTheme());
    });
    themeObserver.observe(document.documentElement, {
      attributes:      true,
      attributeFilter: ['data-theme', 'class'],
    });

    // ── Position & angle state ──────────────────────────────────────────────
    const pos  = Array.from({ length: COUNT }, () => ({ x: -9999, y: -9999, angle: -90 }));
    const prev = Array.from({ length: COUNT }, () => ({ x: -9999, y: -9999 }));
    const mouse = { x: -9999, y: -9999 };
    let rafId  = 0;
    let active = false;

    // ── Mouse tracking ──────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      if (!active) {
        // Teleport all particles to cursor on first move.
        // Without this, the trail would shoot from off-screen on init.
        pos.forEach(p  => { p.x = e.clientX; p.y = e.clientY; });
        prev.forEach(p => { p.x = e.clientX; p.y = e.clientY; });
        active = true;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // ── Animation loop ──────────────────────────────────────────────────────
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!active) return;

      // Lead dot: lerps toward raw mouse position
      prev[0].x = pos[0].x;
      prev[0].y = pos[0].y;
      pos[0].x += (mouse.x - pos[0].x) * LEAD_LERP;
      pos[0].y += (mouse.y - pos[0].y) * LEAD_LERP;

      // Rotation: atan2(velocity) + 90° because the shape's point faces −Y by default.
      // We only update the angle when speed² > threshold to avoid jitter at rest.
      const dx0 = pos[0].x - prev[0].x;
      const dy0 = pos[0].y - prev[0].y;
      if (dx0 * dx0 + dy0 * dy0 > 0.04) {
        pos[0].angle = Math.atan2(dy0, dx0) * (180 / Math.PI) + 90;
      }

      // Trailing dots: each chases the one ahead with progressively less speed
      for (let i = 1; i < COUNT; i++) {
        prev[i].x = pos[i].x;
        prev[i].y = pos[i].y;

        const lerp = Math.max(MIN_LERP, LEAD_LERP - i * LERP_DECAY);
        pos[i].x += (pos[i - 1].x - pos[i].x) * lerp;
        pos[i].y += (pos[i - 1].y - pos[i].y) * lerp;

        const dxi = pos[i].x - prev[i].x;
        const dyi = pos[i].y - prev[i].y;
        if (dxi * dxi + dyi * dyi > 0.04) {
          pos[i].angle = Math.atan2(dyi, dxi) * (180 / Math.PI) + 90;
        }
      }

      // Write transforms — single style mutation per node, zero layout reads
      // translate3d centres the teardrop at (pos.x, pos.y); rotate orients the tip
      for (let i = 0; i < COUNT; i++) {
        const { ox, oy } = cfgs[i];
        nodes[i].style.transform =
          `translate3d(${(pos[i].x - ox).toFixed(2)}px,${(pos[i].y - oy).toFixed(2)}px,0)` +
          ` rotate(${pos[i].angle.toFixed(2)}deg)`;
      }
    };

    rafId = requestAnimationFrame(tick);

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        9999,
        overflow:      'hidden',
      }}
    />
  );
});
