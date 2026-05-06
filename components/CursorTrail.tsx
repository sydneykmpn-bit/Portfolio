'use client';

import { useEffect, useRef, memo } from 'react';

// ── Tuning ────────────────────────────────────────────────────────────────────
const COUNT      = 12;   // number of trailing dots (including lead)
const LEAD_LERP  = 0.22; // lead dot lag (1.0 = instant snap)
const LERP_DECAY = 0.013; // how much slower each subsequent dot is
const LEAD_SIZE  = 5;    // px — lead dot diameter
const TAIL_SIZE  = 2.5;  // px — last dot diameter
// ─────────────────────────────────────────────────────────────────────────────

export default memo(function CursorTrail() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer:coarse)').matches) return;

    const root = rootRef.current!;

    // Pre-compute per-dot constants
    const sizes:    number[] = [];
    const alphas:   number[] = [];
    const offsets:  number[] = [];

    for (let i = 0; i < COUNT; i++) {
      const t       = i / (COUNT - 1);          // 0 = lead, 1 = tail
      const size    = LEAD_SIZE - t * (LEAD_SIZE - TAIL_SIZE);
      sizes[i]      = size;
      alphas[i]     = 1 - t * 0.88;             // 1.0 → ~0.12
      offsets[i]    = size / 2;                  // centre-align offset
    }

    // Build DOM nodes once
    const nodes: HTMLDivElement[] = sizes.map((size, i) => {
      const el = document.createElement('div');
      el.style.cssText = [
        'position:absolute',
        `width:${size}px`,
        `height:${size}px`,
        'border-radius:50%',
        `background:rgba(210,225,255,${alphas[i].toFixed(3)})`,
        'pointer-events:none',
        'will-change:transform',
        // Start off-screen — avoids a flash from (0,0) before first move
        'transform:translate3d(-9999px,-9999px,0)',
      ].join(';');
      root.appendChild(el);
      return el;
    });

    const pos   = Array.from({ length: COUNT }, () => ({ x: -9999, y: -9999 }));
    const mouse = { x: -9999, y: -9999 };
    let rafId   = 0;
    let active  = false;

    const onMove = (e: MouseEvent) => {
      if (!active) {
        // Teleport all dots on first move — no trail shooting from off-screen
        pos.forEach(p => { p.x = e.clientX; p.y = e.clientY; });
        active = true;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!active) return;

      // Lead dot: tight lerp toward raw cursor
      pos[0].x += (mouse.x - pos[0].x) * LEAD_LERP;
      pos[0].y += (mouse.y - pos[0].y) * LEAD_LERP;

      // Each subsequent dot chases the one ahead with decreasing speed
      for (let i = 1; i < COUNT; i++) {
        const lerp = Math.max(0.05, LEAD_LERP - i * LERP_DECAY);
        pos[i].x  += (pos[i - 1].x - pos[i].x) * lerp;
        pos[i].y  += (pos[i - 1].y - pos[i].y) * lerp;
      }

      // Write transforms — single style mutation per dot, no layout reads
      for (let i = 0; i < COUNT; i++) {
        nodes[i].style.transform =
          `translate3d(${pos[i].x - offsets[i]}px,${pos[i].y - offsets[i]}px,0)`;
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
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
