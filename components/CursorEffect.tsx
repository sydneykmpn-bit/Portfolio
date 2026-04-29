'use client';

import { useEffect, useRef, memo } from 'react';

// No lerp/RAF loop — position syncs directly to mouse coords each event.
export default memo(function CursorEffect() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + 'px';
        glowRef.current.style.top = e.clientY + 'px';
      }
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  return <div ref={glowRef} id="curGlow" />;
});
