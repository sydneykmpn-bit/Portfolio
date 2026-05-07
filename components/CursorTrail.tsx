'use client';

import { useEffect, useRef, memo } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TUNING
// ─────────────────────────────────────────────────────────────────────────────
const COUNT = 20;
const SIZE = 24;
const HALF = SIZE / 2;

// 0.30 = original floaty trail
// 0.38 = smoother + more responsive (recommended)
// 0.55 = very tight/snappy
const EASE = 0.38;

// ─────────────────────────────────────────────────────────────────────────────
// COLOUR PALETTES
// ─────────────────────────────────────────────────────────────────────────────

const LIGHT: readonly string[] = [
  '#0F172A',
  '#1E3A8A',
  '#1E3A8A',
  '#1E40AF',
  '#1D4ED8',
  '#2563EB',
  '#2563EB',
  '#3B82F6',
  '#3B82F6',
  '#60A5FA',
  '#60A5FA',
  '#93C5FD',
  '#93C5FD',
  '#BAE6FD',
  '#BAE6FD',
  '#BFDBFE',
  '#DBEAFE',
  '#EFF6FF',
  '#F0F9FF',
  '#F0F9FF',
];

const DARK: readonly string[] = [
  '#E0F2FE',
  '#BAE6FD',
  '#7DD3FC',
  '#7DD3FC',
  '#38BDF8',
  '#38BDF8',
  '#0EA5E9',
  '#0EA5E9',
  '#0284C7',
  '#0369A1',
  '#0369A1',
  '#075985',
  '#3B82F6',
  '#2563EB',
  '#1D4ED8',
  '#1E40AF',
  '#1E40AF',
  '#1E3A8A',
  '#172554',
  '#172554',
];

// ─────────────────────────────────────────────────────────────────────────────
// THEME HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isDark(): boolean {
  const attr = document.documentElement.getAttribute('data-theme');

  if (attr === 'dark') return true;
  if (attr === 'light') return false;

  if (document.documentElement.classList.contains('dark')) return true;
  if (document.documentElement.classList.contains('light')) return false;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyColors(nodes: HTMLDivElement[], dark: boolean): void {
  const palette = dark ? DARK : LIGHT;

  nodes.forEach((node, i) => {
    node.style.backgroundColor = palette[i];

    if (dark) {
      const glowPx = [14, 11, 8, 5][i] ?? 0;
      const glowA = [0.72, 0.55, 0.38, 0.22][i] ?? 0;

      node.style.boxShadow =
        glowA > 0
          ? `0 0 ${glowPx}px rgba(56,189,248,${glowA}),
             0 0 ${glowPx * 2}px rgba(14,165,233,${(
               glowA * 0.35
             ).toFixed(2)})`
          : 'none';
    } else {
      const sA = Math.max(0, 0.18 - (i / COUNT) * 0.22);

      node.style.boxShadow =
        sA > 0.02
          ? `0 2px 6px rgba(30,58,138,${sA.toFixed(2)})`
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
    // Disable on touch devices
    if (window.matchMedia('(pointer:coarse)').matches) return;

    const root = rootRef.current!;
    const nodes: HTMLDivElement[] = [];

    // ─────────────────────────────────────────────────────────────────────────
    // CREATE CIRCLES
    // ─────────────────────────────────────────────────────────────────────────

    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('div');

      el.style.cssText = [
        'position:absolute',
        `width:${SIZE}px`,
        `height:${SIZE}px`,
        'border-radius:50%',
        'filter:blur(1px)',
        'pointer-events:none',
        'will-change:transform',
        'backface-visibility:hidden',
        'contain:layout style paint',
        'transform:translate3d(-9999px,-9999px,0)',
        'transition:background-color 0.4s ease, box-shadow 0.4s ease',
      ].join(';');

      root.appendChild(el);
      nodes.push(el);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // INITIAL COLORS
    // ─────────────────────────────────────────────────────────────────────────

    applyColors(nodes, isDark());

    // ─────────────────────────────────────────────────────────────────────────
    // THEME OBSERVER
    // ─────────────────────────────────────────────────────────────────────────

    const themeObserver = new MutationObserver(() => {
      applyColors(nodes, isDark());
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    // ─────────────────────────────────────────────────────────────────────────
    // POSITION DATA
    // ─────────────────────────────────────────────────────────────────────────

    const coords = { x: 0, y: 0 };

    type CircleData = {
      x: number;
      y: number;
    };

    const circleData: CircleData[] = Array.from(
      { length: COUNT },
      () => ({
        x: 0,
        y: 0,
      })
    );

    let rafId = 0;
    let initialized = false;

    // ─────────────────────────────────────────────────────────────────────────
    // MOUSE TRACKING
    // ─────────────────────────────────────────────────────────────────────────

    const onMove = (e: MouseEvent) => {
      coords.x = e.clientX;
      coords.y = e.clientY;

      // Prevent trail from appearing from top-left corner
      if (!initialized) {
        circleData.forEach(circle => {
          circle.x = e.clientX;
          circle.y = e.clientY;
        });

        initialized = true;
      }
    };

    window.addEventListener('mousemove', onMove, {
      passive: true,
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ANIMATION LOOP
    // ─────────────────────────────────────────────────────────────────────────

    const animateCircles = () => {
      rafId = requestAnimationFrame(animateCircles);

      if (!initialized) return;

      let x = coords.x;
      let y = coords.y;

      for (let i = 0; i < COUNT; i++) {
        const node = nodes[i];

        const scale = (COUNT - i) / COUNT;

        node.style.transform = `
          translate3d(${x - HALF}px, ${y - HALF}px, 0)
          scale(${scale})
        `;

        // Store current position
        circleData[i].x = x;
        circleData[i].y = y;

        // Next circle
        const nextCircle =
          circleData[i + 1] || circleData[0];

        // Original trailing interpolation
        x += (nextCircle.x - x) * EASE;
        y += (nextCircle.y - y) * EASE;
      }
    };

    rafId = requestAnimationFrame(animateCircles);

    // ─────────────────────────────────────────────────────────────────────────
    // CLEANUP
    // ─────────────────────────────────────────────────────────────────────────

    return () => {
      cancelAnimationFrame(rafId);

      window.removeEventListener('mousemove', onMove);

      themeObserver.disconnect();

      nodes.forEach(node => node.remove());
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        overflow: 'hidden',
      }}
    />
  );
});