'use client';

import { useEffect, useRef, memo } from 'react';

export default memo(function CursorEffect() {
  const glowRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -600, y: -600 });
  const pos = useRef({ x: -600, y: -600 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener('mousemove', onMove);

    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.22;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.22;
      if (glowRef.current) {
        glowRef.current.style.left = pos.current.x + 'px';
        glowRef.current.style.top = pos.current.y + 'px';
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return <div ref={glowRef} id="curGlow" />;
});
