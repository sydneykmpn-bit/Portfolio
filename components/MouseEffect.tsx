'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Splash {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  hue: number;
}

export default function MouseEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const hue = useRef(0);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gradientAlpha = useRef(0);
  const splashes = useRef<Splash[]>([]);
  const rafId = useRef<number>(0);
  const targetAlpha = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    targetAlpha.current = 1;

    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      targetAlpha.current = 0;
    }, 2500);
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    const burstHue = hue.current;
    for (let i = 0; i < 3; i++) {
      splashes.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 60 + i * 30,
        alpha: 0.55 - i * 0.12,
        hue: (burstHue + i * 30) % 360,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lerp gradient alpha toward target
      gradientAlpha.current += (targetAlpha.current - gradientAlpha.current) * 0.06;
      hue.current = (hue.current + 0.6) % 360;

      if (gradientAlpha.current > 0.005) {
        const grad = ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, 0,
          mouse.current.x, mouse.current.y, 240
        );
        const a = gradientAlpha.current * 0.18;
        grad.addColorStop(0, `hsla(${hue.current}, 90%, 65%, ${a})`);
        grad.addColorStop(0.4, `hsla(${(hue.current + 40) % 360}, 85%, 60%, ${a * 0.6})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw splashes
      splashes.current = splashes.current.filter((s) => s.alpha > 0.01);
      for (const s of splashes.current) {
        s.radius += (s.maxRadius - s.radius) * 0.12;
        s.alpha *= 0.88;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${s.hue}, 90%, 70%, ${s.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      rafId.current = requestAnimationFrame(draw);
    };

    rafId.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [handleMouseMove, handleClick]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
}
