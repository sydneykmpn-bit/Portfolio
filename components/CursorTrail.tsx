'use client';

import { useEffect, useRef, memo } from 'react';

// ─── Tuning — adjust here without touching logic ──────────────────────────────
const POOL_SIZE   = 60;    // hard ceiling on simultaneous particles
const SPRITE_R    = 22;    // px — half-size of the pre-rendered glow sprite
const LERP        = 0.12;  // spawn-head lag (0.06 = very laggy, 0.22 = snappy)
const SPAWN_EVERY = 3.5;   // px of head travel between particle emissions
const BASE_DECAY  = 0.020; // life lost per frame (~830ms lifetime @ 60fps)
const RAND_DECAY  = 0.014; // ± variation so particles don't all die together
const MAX_ALPHA   = 0.52;  // global opacity ceiling — keep subtle
// ─────────────────────────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number;
  life: number;     // 1 → 0
  decay: number;    // life consumed per frame
  r: number;        // rendered half-size
  active: boolean;
}

/**
 * Builds the glow texture once on an offscreen canvas.
 * Every frame we blit this via drawImage — far cheaper than
 * re-computing a radial gradient for each particle each frame.
 */
function buildSprite(radius: number): HTMLCanvasElement {
  const size = radius * 2;
  const c    = document.createElement('canvas');
  c.width    = c.height = size;
  const ctx  = c.getContext('2d')!;
  const g    = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
  g.addColorStop(0,    'rgba(220,235,255,1)');   // bright white-blue core
  g.addColorStop(0.2,  'rgba(147,197,253,0.85)');// blue-300
  g.addColorStop(0.55, 'rgba(96,165,250,0.4)');  // blue-400
  g.addColorStop(1,    'rgba(59,130,246,0)');    // transparent edge
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}

export default memo(function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    // Completely skip on touch / stylus — saves battery, makes no visual sense
    if (window.matchMedia('(pointer:coarse)').matches) return;

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    // Pre-render glow sprite — this is the most expensive part, done once
    const sprite = buildSprite(SPRITE_R);

    // ── Viewport ──────────────────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ── Raw mouse position ────────────────────────────────────────────────────
    const mouse         = { x: -300, y: -300 };
    let   headReady     = false;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // Teleport head on first move — prevents a trail shooting from off-screen
      if (!headReady) {
        head.x = prev.x = e.clientX;
        head.y = prev.y = e.clientY;
        headReady = true;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // ── Lerping spawn head ─────────────────────────────────────────────────────
    // Particles emit from `head`, which itself chases `mouse` with LERP easing.
    // This is what creates the "liquid" trailing feel — the emission origin lags.
    const head = { x: -300, y: -300 };
    const prev = { x: -300, y: -300 }; // head position last frame

    // ── Particle pool ─────────────────────────────────────────────────────────
    const pool: Particle[] = Array.from({ length: POOL_SIZE }, () => ({
      x: 0, y: 0, life: 0, decay: 0, r: 0, active: false,
    }));
    let activeCount = 0;

    function emit(x: number, y: number, speed: number) {
      if (activeCount >= POOL_SIZE) return;
      const p = pool.find(p => !p.active);
      if (!p) return;

      // Faster cursor movement → slightly larger particles
      const boost = Math.min(speed / 12, 1);

      p.x      = x + (Math.random() - 0.5) * 4;
      p.y      = y + (Math.random() - 0.5) * 4;
      p.life   = 1;
      p.decay  = BASE_DECAY + (Math.random() - 0.5) * RAND_DECAY;
      p.r      = SPRITE_R * (0.4 + boost * 0.6) * (0.7 + Math.random() * 0.3);
      p.active = true;
      activeCount++;
    }

    // ── Hover state (checked every 4 frames — elementFromPoint is not free) ──
    let hoverTick  = 0;
    let isHovering = false;

    // ── Draw loop ─────────────────────────────────────────────────────────────
    let spawnDebt  = 0;  // accumulated head travel (px) between emissions
    let wasDrawing = false;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);

      // 1. Move spawn head toward raw cursor
      head.x += (mouse.x - head.x) * LERP;
      head.y += (mouse.y - head.y) * LERP;

      // 2. Measure head displacement this frame
      const dx    = head.x - prev.x;
      const dy    = head.y - prev.y;
      const speed = Math.sqrt(dx * dx + dy * dy); // px/frame ≈ velocity proxy
      prev.x = head.x;
      prev.y = head.y;

      // 3. Emit particles proportionally to distance travelled
      spawnDebt += speed;
      while (spawnDebt >= SPAWN_EVERY) {
        spawnDebt -= SPAWN_EVERY;
        emit(head.x, head.y, speed);
      }

      // 4. Throttled hover detection
      if (++hoverTick % 4 === 0) {
        const el   = document.elementFromPoint(mouse.x, mouse.y);
        isHovering = !!(el?.closest('a, button, [role="button"]'));
      }

      // 5. Update all active particles
      for (const p of pool) {
        if (!p.active) continue;
        p.life -= p.decay;
        if (p.life <= 0) {
          p.active = false;
          activeCount--;
        }
      }

      // 6. Nothing to draw — one final clear then skip until next movement
      if (activeCount === 0) {
        if (wasDrawing) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          wasDrawing = false;
        }
        return;
      }

      // 7. Render frame
      wasDrawing = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Hover: slightly enlarge particles over interactive elements
      const hoverScale = isHovering ? 1.4 : 1.0;

      for (const p of pool) {
        if (!p.active) continue;

        // Fade-in: ramp from 0→full over first 15% of particle existence
        // (elapsed = 1 - life because life starts at 1)
        const elapsed = 1 - p.life;
        const fadeIn  = Math.min(elapsed / 0.15, 1);
        const alpha   = fadeIn * p.life * MAX_ALPHA;

        if (alpha <= 0.005) continue; // skip near-invisible particles

        const r = p.r * hoverScale;
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
      }

      // Reset composite state
      ctx.globalAlpha = 1;
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
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
        zIndex:        9997,   // below curGlow (9998) and curDot (9999)
        pointerEvents: 'none',
      }}
    />
  );
});
