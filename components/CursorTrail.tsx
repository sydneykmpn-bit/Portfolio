'use client';

import { useEffect, useRef, memo } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — mirrors the original vanilla-JS / CSS values exactly
// Changing COUNT / SIZE / EASE changes the animation feel;
// the colour arrays and theme logic are the only intentional additions.
// ─────────────────────────────────────────────────────────────────────────────
const COUNT = 20;    // 20 circle divs  (matches original HTML)
const SIZE  = 24;    // px              (matches original CSS)
const HALF  = SIZE / 2;
const EASE  = 0.3;   // lerp factor     (matches original JS — do NOT change)

// ─────────────────────────────────────────────────────────────────────────────
// COLOUR PALETTES
// 22 stops per palette → index wraps via (i % palette.length), matching the
// original `colors[index % colors.length]` pattern.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * LIGHT MODE — deep navy at the lead, fading toward near-invisible sky at the tail.
 * High-contrast on white / light-grey backgrounds.
 */
const LIGHT_COLORS: readonly string[] = [
  '#0F172A', // slate-950  ← circle 0  (lead — darkest, max contrast)
  '#0F172A', // slate-950  ← circle 1
  '#1E3A8A', // blue-900
  '#1E40AF', // blue-800
  '#1D4ED8', // blue-700
  '#2563EB', // blue-600
  '#2563EB', // blue-600   (reinforced mid-point for a richer gradient)
  '#3B82F6', // blue-500
  '#3B82F6', // blue-500
  '#60A5FA', // blue-400
  '#60A5FA', // blue-400
  '#93C5FD', // blue-300
  '#93C5FD', // blue-300
  '#BAE6FD', // sky-200
  '#BFDBFE', // blue-200
  '#DBEAFE', // blue-100
  '#DBEAFE', // blue-100
  '#EFF6FF', // blue-50
  '#EFF6FF', // blue-50
  '#F0F9FF', // sky-50    (tail — barely visible on white)
  '#F0F9FF', // sky-50
  '#F0F9FF', // sky-50
];

/**
 * DARK MODE — bright cyan at the lead, sinking to deep navy at the tail.
 * The lead circles glow; the tail dissolves naturally into the dark background.
 */
const DARK_COLORS: readonly string[] = [
  '#E0F2FE', // sky-100    ← circle 0  (lead — brightest/glowing)
  '#BAE6FD', // sky-200    ← circle 1
  '#7DD3FC', // sky-300
  '#7DD3FC', // sky-300    (reinforced)
  '#38BDF8', // sky-400
  '#38BDF8', // sky-400
  '#0EA5E9', // sky-500
  '#0EA5E9', // sky-500
  '#0284C7', // sky-600
  '#0369A1', // sky-700
  '#0369A1', // sky-700
  '#075985', // sky-800
  '#60A5FA', // blue-400   (blend into blue family)
  '#3B82F6', // blue-500
  '#2563EB', // blue-600
  '#1D4ED8', // blue-700
  '#1D4ED8', // blue-700
  '#1E40AF', // blue-800
  '#1E3A8A', // blue-900
  '#1E3A8A', // blue-900
  '#172554', // blue-950   (tail — sinks into dark background)
  '#172554', // blue-950
];

// ─────────────────────────────────────────────────────────────────────────────
// THEME HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Three-level detection — picks up your ThemeToggle (data-theme attr),
 * Tailwind dark-mode classes, and the OS prefers-color-scheme fallback.
 */
function isDark(): boolean {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark')  return true;
  if (attr === 'light') return false;
  if (document.documentElement.classList.contains('dark'))  return true;
  if (document.documentElement.classList.contains('light')) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Writes background-color + box-shadow to every node in one pass.
 * Called once on mount and again whenever the theme attribute changes.
 * The CSS transition on each node (0.4s ease) handles the smooth crossfade.
 */
function applyColors(nodes: HTMLDivElement[], dark: boolean): void {
  const palette = dark ? DARK_COLORS : LIGHT_COLORS;

  nodes.forEach((node, i) => {
    // Colour — wraps via modulo, same as the original `colors[index % colors.length]`
    node.style.backgroundColor = palette[i % palette.length];

    // Glow box-shadow — dark mode only, fades out after the first 4 circles
    if (dark) {
      // Pre-computed glow values for circles 0–3; none beyond that
      const glowSizes  = [14, 11, 8, 5];
      const glowAlphas = [0.72, 0.55, 0.38, 0.22];
      if (i < 4) {
        const px = glowSizes[i];
        const a  = glowAlphas[i];
        node.style.boxShadow =
          `0 0 ${px}px rgba(56,189,248,${a}), ` +
          `0 0 ${px * 2}px rgba(14,165,233,${(a * 0.35).toFixed(2)})`;
      } else {
        node.style.boxShadow = 'none';
      }
    } else {
      // Light mode: very subtle inset shadow to lift circles off white pages
      const shadowAlpha = Math.max(0, 0.18 - (i / COUNT) * 0.2);
      node.style.boxShadow =
        shadowAlpha > 0.02
          ? `0 2px 6px rgba(30,58,138,${shadowAlpha.toFixed(2)})`
          : 'none';
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default memo(function CursorTrail() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch / stylus devices — mouse trail makes no sense there
    if (window.matchMedia('(pointer:coarse)').matches) return;

    const root = rootRef.current!;
    const nodes: HTMLDivElement[] = [];

    // ── Build 20 circle nodes ─────────────────────────────────────────────────
    // Mirrors the 20 <div class="circle"> in the vanilla HTML.
    // Static styles are set here once; only transform, background, and
    // box-shadow are written per-frame / per-theme-change.
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('div');
      el.style.cssText = [
        'position:absolute',
        `width:${SIZE}px`,
        `height:${SIZE}px`,
        'border-radius:50%',          // circle shape — matches original CSS
        'filter:blur(1px)',            // subtle blur for smoother appearance
        'pointer-events:none',
        'will-change:transform',
        // Start far off-screen to avoid the "shoot from corner" flash
        'transform:translate3d(-9999px,-9999px,0)',
        // Smooth crossfade when the user switches themes
        'transition:background-color 0.4s ease, box-shadow 0.4s ease',
      ].join(';');

      root.appendChild(el);
      nodes.push(el);
    }

    // ── Apply initial theme colours ───────────────────────────────────────────
    applyColors(nodes, isDark());

    // ── MutationObserver — react to theme changes in real-time ───────────────
    // Fires only when data-theme or class attributes change on <html>.
    // Zero cost when idle; no polling, no setInterval.
    const themeObserver = new MutationObserver(() => {
      applyColors(nodes, isDark());
    });
    themeObserver.observe(document.documentElement, {
      attributes:      true,
      attributeFilter: ['data-theme', 'class'],
    });

    // ── Position state ────────────────────────────────────────────────────────
    // `cPos` is the React equivalent of `circle.x` / `circle.y` in vanilla JS.
    // Each entry stores the position that circle was drawn to last frame.
    const cPos  = Array.from({ length: COUNT }, () => ({ x: 0, y: 0 }));
    const mouse = { x: 0, y: 0 };
    let rafId   = 0;
    let active  = false;

    // ── Mouse tracking ────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      if (!active) {
        // Teleport all circles to the cursor on the very first mousemove.
        // Without this the trail would shoot from the top-left corner (0,0).
        cPos.forEach(p => { p.x = e.clientX; p.y = e.clientY; });
        active = true;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // ── Animation loop ────────────────────────────────────────────────────────
    // This is a direct port of the original vanilla JS `animateCircles()`.
    // Variable names intentionally match the original for easy comparison:
    //
    //   ORIGINAL                          →   HERE
    //   ─────────────────────────────────────────────────────────────────
    //   let x = coords.x                  →   let x = mouse.x
    //   circle.style.left  = x - 12 + "px"→  (baked into translate3d)
    //   circle.style.top   = y - 12 + "px"→  (baked into translate3d)
    //   circle.style.scale = (n-i)/n       →  scale(…) in the same transform
    //   circle.x = x                      →   cPos[index].x = x
    //   nextCircle.x                      →   cPos[index+1].x  (prev-frame value)
    //   x += (nextCircle.x - x) * 0.3    →   x += (next.x - x) * EASE  (0.3)
    //
    // Performance note: translate3d replaces `left`/`top` to keep all painting
    // on the GPU compositor thread — same visual output, no reflow.
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!active) return;

      let x = mouse.x;
      let y = mouse.y;

      nodes.forEach((node, index) => {
        // ── Position + scale (unchanged logic, GPU-accelerated path) ──────────
        // translate3d(x - HALF, y - HALF, 0) centres the 24 px circle at (x, y).
        // scale() shrinks toward the transform-origin, which after the translate
        // is now at (x, y) — so the circle scales around the cursor point.
        const scale = (COUNT - index) / COUNT;  // 1.0 → 0.05
        node.style.transform =
          `translate3d(${x - HALF}px,${y - HALF}px,0) scale(${scale})`;

        // ── Store current position — equivalent to `circle.x = x` ────────────
        cPos[index].x = x;
        cPos[index].y = y;

        // ── Lerp toward the NEXT circle's position from last frame ────────────
        // `cPos[index+1]` has NOT been updated yet this iteration, so it still
        // holds last frame's value — exactly matching `nextCircle.x` in vanilla.
        const next = index + 1 < COUNT ? cPos[index + 1] : cPos[0];
        x += (next.x - x) * EASE;   // ← 0.3 easing, unchanged
        y += (next.y - y) * EASE;
      });
    };

    rafId = requestAnimationFrame(tick);

    // ── Cleanup ───────────────────────────────────────────────────────────────
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
        zIndex:        99999,
        overflow:      'hidden',
      }}
    />
  );
});
