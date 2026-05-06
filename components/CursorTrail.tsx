'use client';

import { useEffect, useRef, memo } from 'react';

// ─── Tuning constants ─────────────────────────────────────────────────────────
const MAX_POINTS = 20;    // ring-buffer cap — controls how long the tail is
const FADE_MS    = 500;   // ms until a point reaches full transparency
const MAX_RADIUS = 3.5;   // px radius of the freshest dot
const MAX_ALPHA  = 0.42;  // peak opacity (keep ≤ 0.5 for "barely there" feel)
// ─────────────────────────────────────────────────────────────────────────────

interface Pt { x: number; y: number; t: number; }

export default memo(function CursorTrail() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const pts        = useRef<Pt[]>([]);
  const raf        = useRef<number>(0);
  // Tracks whether the previous frame drew anything — lets us do one final
  // clearRect when the last point expires instead of clearing every idle frame.
  const wasDrawing = useRef(false);

  useEffect(() => {
    // No-op on touch / stylus devices — pointer trail is meaningless there
    if (window.matchMedia('(pointer:coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas to full viewport; re-sync on resize
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Push each mouse position into the ring buffer with a timestamp
    const onMove = (e: MouseEvent) => {
      pts.current.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      // Drop oldest entry once we exceed the cap
      if (pts.current.length > MAX_POINTS) pts.current.shift();
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const draw = () => {
      raf.current = requestAnimationFrame(draw);

      const now = performance.now();

      // Evict any points that have fully faded
      while (pts.current.length > 0 && now - pts.current[0].t >= FADE_MS) {
        pts.current.shift();
      }

      // If nothing left to draw, do one cleanup clear then idle cheaply
      if (pts.current.length === 0) {
        if (wasDrawing.current) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          wasDrawing.current = false;
        }
        return;
      }

      wasDrawing.current = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pts.current.forEach(p => {
        // life: 1 = just created, 0 = about to expire
        const life   = 1 - (now - p.t) / FADE_MS;
        const radius = MAX_RADIUS * life;
        const alpha  = MAX_ALPHA  * life;

        if (radius <= 0) return;

        // Soft outer halo — drawn first so the solid dot sits on top
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${alpha * 0.18})`;
        ctx.fill();

        // Solid inner dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${alpha})`;
        ctx.fill();
      });
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize',    resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        9997,   // behind curGlow (9998) and curDot (9999)
        pointerEvents: 'none',
      }}
    />
  );
});
