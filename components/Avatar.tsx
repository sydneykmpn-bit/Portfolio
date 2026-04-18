'use client';

import { useEffect, useRef, useState, useCallback, memo } from 'react';

const TOTAL_FRAMES = 192;
const DEFAULT_FRAME = 7; // frame_0007 — forward-facing
const LERP_SPEED = 0.08;

const frameSrc = (n: number) =>
  `/avatar-frames/frame_${String(n).padStart(4, '0')}.webp`;

interface Props {
  state?: 'idle' | 'thinking' | 'talking';
  size?: 'lg' | 'sm';
}

export default memo(function Avatar({ state = 'idle', size = 'lg' }: Props) {
  const dim = size === 'lg' ? 200 : 72;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(DEFAULT_FRAME - 1); // 0-indexed
  const targetFrame = useRef(DEFAULT_FRAME - 1);
  const rafId = useRef<number>(0);
  const [visible, setVisible] = useState(false);

  const drawFrame = useCallback(
    (idx: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = images.current[idx];
      if (!img?.complete || !img.naturalWidth) return;

      const d = canvas.width; // physical pixels (2× for retina)
      ctx.clearRect(0, 0, d, d);

      ctx.save();
      ctx.beginPath();
      ctx.arc(d / 2, d / 2, d / 2, 0, Math.PI * 2);
      ctx.clip();

      // Portrait crop: use full image width as square, crop from top (head)
      const sw = img.naturalWidth;
      const sh = img.naturalWidth; // square crop = width × width
      ctx.drawImage(img, 0, 0, sw, sh, 0, 0, d, d);
      ctx.restore();
    },
    []
  );

  // Preload all frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = frameSrc(i);
      img.onload = () => {
        if (i === DEFAULT_FRAME) {
          drawFrame(DEFAULT_FRAME - 1);
          setVisible(true);
        }
      };
      imgs.push(img);
    }

    images.current = imgs;
  }, [drawFrame]);

  // Mouse → target frame
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const norm = e.clientX / window.innerWidth;
      targetFrame.current = Math.round(norm * (TOTAL_FRAMES - 1));
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // RAF animation loop — lerp toward target frame
  useEffect(() => {
    const loop = () => {
      const diff = targetFrame.current - currentFrame.current;
      if (Math.abs(diff) > 0.1) {
        currentFrame.current += diff * LERP_SPEED;
        const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrame.current)));
        drawFrame(idx);
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [drawFrame]);

  return (
    <div className="relative" style={{ width: dim, height: dim, flexShrink: 0 }}>
      {/* Cyan glow ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: `0 0 0 1.5px var(--accent), 0 0 28px var(--accent-glow)`,
          zIndex: 2,
        }}
      />

      {/* Photo canvas */}
      <canvas
        ref={canvasRef}
        width={dim * 2}
        height={dim * 2}
        style={{
          width: dim,
          height: dim,
          borderRadius: '50%',
          display: 'block',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Skeleton shown until default frame loads */}
      {!visible && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{ background: 'var(--bg-3)' }}
        />
      )}

      {/* Thinking dots */}
      {state === 'thinking' && (
        <div
          className="absolute flex gap-1.5"
          style={{ bottom: size === 'lg' ? -28 : -20, left: '50%', transform: 'translateX(-50%)' }}
        >
          <span className="dot-1 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          <span className="dot-2 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          <span className="dot-3 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
        </div>
      )}
    </div>
  );
});
