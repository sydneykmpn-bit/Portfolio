'use client';

import { useEffect, useRef, memo } from 'react';

// ── Tuning ────────────────────────────────────────────────────────────────────
const COUNT      = 18;   // total particles (including lead)
const LEAD_LERP  = 0.20; // lead dot lag (higher = snappier)
const LERP_DECAY = 0.010; // each subsequent dot lerps this much slower
const MIN_LERP   = 0.042; // floor so the tail never stops completely
// ─────────────────────────────────────────────────────────────────────────────

// ── Blue gradient palette (lead → tail) ──────────────────────────────────────
// 18 steps: bright sky-blue at the front, deep navy at the back
const COLORS: string[] = [
  '#E0F2FE', // sky-100   — brightest lead
  '#BAE6FD', // sky-200
  '#7DD3FC', // sky-300
  '#38BDF8', // sky-400
  '#0EA5E9', // sky-500
  '#0284C7', // sky-600
  '#0369A1', // sky-700
  '#075985', // sky-800
  '#0C4A6E', // sky-900
  '#BFDBFE', // blue-200
  '#93C5FD', // blue-300
  '#60A5FA', // blue-400
  '#3B82F6', // blue-500
  '#2563EB', // blue-600
  '#1D4ED8', // blue-700
  '#1E40AF', // blue-800
  '#1E3A8A', // blue-900
  '#172554', // blue-950  — darkest tail
];
// ─────────────────────────────────────────────────────────────────────────────

interface Cfg { w: number; h: number; ox: number; oy: number; }

export default memo(function CursorTrail() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── Touch / stylus: skip — saves battery, makes no sense visually ────────
    if (window.matchMedia('(pointer:coarse)').matches) return;

    const root = rootRef.current!;
    const cfgs:  Cfg[]          = [];
    const nodes: HTMLDivElement[] = [];

    // ── Build DOM nodes once ──────────────────────────────────────────────────
    for (let i = 0; i < COUNT; i++) {
      const t = i / (COUNT - 1); // 0 = lead, 1 = tail

      // Size: lead is largest, tail is smallest
      const w = Math.max(3.5, 12 - t * 8.5);   // 12 → 3.5 px
      const h = w * 1.55;                        // ~1.55:1 height:width ratio

      // Opacity: lead fully visible, trail fades
      const opacity = Math.max(0.05, 1 - t * 0.95);

      // Color: map linearly across the COLORS array
      const ci    = Math.min(Math.floor(t * COLORS.length), COLORS.length - 1);
      const color = COLORS[ci];

      // Blur: lead is sharp, trailing particles get a slight blur (depth cue)
      // — skip filter on the first 3 dots to keep the lead crisp
      const blur = i < 3 ? 0 : Math.min((t - 0.15) * 1.8, 1.4);

      // Glow box-shadow: only on lead particles, fades out quickly
      const glowPx    = Math.round(Math.max(0, 10 - t * 14));
      const glowAlpha = Math.max(0, 0.65 - t * 0.9);
      const glow      =
        glowAlpha > 0.04
          ? `0 0 ${glowPx}px rgba(56,189,248,${glowAlpha.toFixed(2)}),0 0 ${glowPx * 2}px rgba(14,165,233,${(glowAlpha * 0.4).toFixed(2)})`
          : 'none';

      cfgs.push({ w, h, ox: w / 2, oy: h / 2 });

      const parts = [
        'position:absolute',
        `width:${w.toFixed(2)}px`,
        `height:${h.toFixed(2)}px`,
        // ── Teardrop shape ──
        // border-radius: horizontal-radii / vertical-radii (per corner: TL TR BR BL)
        // Top corners: 50% horizontal, 12% vertical → almost-flat/pointed top
        // Bottom corners: 50% / 50%                  → fully rounded bottom
        'border-radius:50% 50% 50% 50% / 12% 12% 50% 50%',
        `background:${color}`,
        `opacity:${opacity.toFixed(3)}`,
        // Start off-screen so there's no flash from (0,0)
        'transform:translate3d(-9999px,-9999px,0)',
        'pointer-events:none',
        'will-change:transform',
      ];

      // Only write filter / box-shadow when non-trivial (avoids pointless GPU layers)
      if (blur > 0.05) parts.push(`filter:blur(${blur.toFixed(2)}px)`);
      if (glow !== 'none') parts.push(`box-shadow:${glow}`);

      const el = document.createElement('div');
      el.style.cssText = parts.join(';');
      root.appendChild(el);
      nodes.push(el);
    }

    // ── State ─────────────────────────────────────────────────────────────────
    // pos[i] tracks each dot's current position and facing angle (degrees)
    const pos  = Array.from({ length: COUNT }, () => ({ x: -9999, y: -9999, angle: -90 }));
    const prev = Array.from({ length: COUNT }, () => ({ x: -9999, y: -9999 }));
    const mouse = { x: -9999, y: -9999 };
    let rafId  = 0;
    let active = false;

    const onMove = (e: MouseEvent) => {
      if (!active) {
        // Teleport all dots on first interaction — prevents trail from (0,0)
        pos.forEach(p  => { p.x = e.clientX; p.y = e.clientY; });
        prev.forEach(p => { p.x = e.clientX; p.y = e.clientY; });
        active = true;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    // ── RAF loop ──────────────────────────────────────────────────────────────
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!active) return;

      // — Lead dot —
      prev[0].x = pos[0].x;
      prev[0].y = pos[0].y;
      pos[0].x += (mouse.x - pos[0].x) * LEAD_LERP;
      pos[0].y += (mouse.y - pos[0].y) * LEAD_LERP;

      // Angle: atan2 of velocity; +90° because the teardrop's point faces "up" (−Y) by default
      const dx0 = pos[0].x - prev[0].x;
      const dy0 = pos[0].y - prev[0].y;
      if (dx0 * dx0 + dy0 * dy0 > 0.04) {
        pos[0].angle = Math.atan2(dy0, dx0) * (180 / Math.PI) + 90;
      }

      // — Trailing dots —
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

      // — Write transforms (single style write per node, zero layout reads) —
      // translate3d centres the teardrop at (pos.x, pos.y); rotate orients the tip
      for (let i = 0; i < COUNT; i++) {
        const { ox, oy } = cfgs[i];
        nodes[i].style.transform =
          `translate3d(${(pos[i].x - ox).toFixed(2)}px,${(pos[i].y - oy).toFixed(2)}px,0) rotate(${pos[i].angle.toFixed(2)}deg)`;
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
