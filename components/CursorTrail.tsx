'use client';

import { useEffect, useRef, memo } from 'react';

const COUNT = 20;
const SIZE  = 24;
const HALF  = SIZE / 2;

// 0.30 = original floaty trail · 0.38 = smooth & responsive · 0.55 = snappy
const EASE  = 0.38;

// ─── Colour palettes ──────────────────────────────────────────────────────────

const LIGHT: readonly string[] = [
  '#0F172A', '#1E3A8A', '#1E3A8A', '#1E40AF', '#1D4ED8',
  '#2563EB', '#2563EB', '#3B82F6', '#3B82F6', '#60A5FA',
  '#60A5FA', '#93C5FD', '#93C5FD', '#BAE6FD', '#BAE6FD',
  '#BFDBFE', '#DBEAFE', '#EFF6FF', '#F0F9FF', '#F0F9FF',
];

const DARK: readonly string[] = [
  '#E0F2FE', '#BAE6FD', '#7DD3FC', '#7DD3FC', '#38BDF8',
  '#38BDF8', '#0EA5E9', '#0EA5E9', '#0284C7', '#0369A1',
  '#0369A1', '#075985', '#3B82F6', '#2563EB', '#1D4ED8',
  '#1E40AF', '#1E40AF', '#1E3A8A', '#172554', '#172554',
];

// ─── Theme helpers ────────────────────────────────────────────────────────────

function isDark(): boolean {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark')  return true;
  if (attr === 'light') return false;
  if (document.documentElement.classList.contains('dark'))  return true;
  if (document.documentElement.classList.contains('light')) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyColors(nodes: HTMLDivElement[], dark: boolean): void {
  const palette = dark ? DARK : LIGHT;
  nodes.forEach((node, i) => {
    node.style.backgroundColor = palette[i];
    if (dark) {
      const glowPx = [14, 11, 8, 5][i] ?? 0;
      const glowA  = [0.72, 0.55, 0.38, 0.22][i] ?? 0;
      node.style.boxShadow = glowA > 0
        ? `0 0 ${glowPx}px rgba(56,189,248,${glowA}),0 0 ${glowPx * 2}px rgba(14,165,233,${(glowA * 0.35).toFixed(2)})`
        : 'none';
    } else {
      const sA = Math.max(0, 0.18 - (i / COUNT) * 0.22);
      node.style.boxShadow = sA > 0.02
        ? `0 2px 6px rgba(30,58,138,${sA.toFixed(2)})`
        : 'none';
    }
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default memo(function CursorTrail() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer:coarse)').matches) return;

    const root  = rootRef.current!;
    const nodes: HTMLDivElement[] = [];

    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('div');
      el.style.cssText = [
        'position:absolute',
        `width:${SIZE}px`,
        `height:${SIZE}px`,
        'border-radius:50%',
        'pointer-events:none',
        // will-change promotes each circle to its own GPU layer so that
        // transform updates are compositor-only (no repaint, no reflow).
        'will-change:transform',
        'transform:translate3d(-9999px,-9999px,0)',
        'transition:background-color 0.4s ease,box-shadow 0.4s ease',
      ].join(';');
      root.appendChild(el);
      nodes.push(el);
    }

    applyColors(nodes, isDark());

    const themeObserver = new MutationObserver(() => applyColors(nodes, isDark()));
    themeObserver.observe(document.documentElement, {
      attributes:      true,
      attributeFilter: ['data-theme', 'class'],
    });

    const coords = { x: 0, y: 0 };

    // Float64Arrays are more cache-friendly than an array of {x,y} objects
    // for tight numeric loops.
    const cx = new Float64Array(COUNT);
    const cy = new Float64Array(COUNT);

    let rafId       = 0;
    let initialized = false;

    const onMove = (e: MouseEvent) => {
      coords.x = e.clientX;
      coords.y = e.clientY;
      if (!initialized) {
        cx.fill(e.clientX);
        cy.fill(e.clientY);
        initialized = true;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const animateCircles = () => {
      rafId = requestAnimationFrame(animateCircles);
      if (!initialized) return;

      let x = coords.x;
      let y = coords.y;

      for (let i = 0; i < COUNT; i++) {
        // Single-line transform string — avoids whitespace parsing overhead
        nodes[i].style.transform =
          `translate3d(${x - HALF}px,${y - HALF}px,0) scale(${(COUNT - i) / COUNT})`;

        cx[i] = x;
        cy[i] = y;

        // Lerp toward the next circle's position from the previous frame.
        // For the last circle, wrap back to circle 0 (always the cursor).
        const ni = i + 1 < COUNT ? i + 1 : 0;
        x += (cx[ni] - x) * EASE;
        y += (cy[ni] - y) * EASE;
      }
    };

    rafId = requestAnimationFrame(animateCircles);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      themeObserver.disconnect();
      nodes.forEach(n => n.remove());
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
        zIndex:        999999,
        overflow:      'hidden',
      }}
    />
  );
});
