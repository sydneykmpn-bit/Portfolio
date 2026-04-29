'use client';

import { useRef, useEffect, memo } from 'react';

interface Tool { icon: string; name: string; }

// Auto-scrolls via JS-controlled scrollLeft (not CSS animation) so users can
// also drag or touch-swipe without conflicting with the movement.
export default memo(function DraggableMarquee({ tools }: { tools: Tool[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const SPEED = 0.65;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let rafId: number;

    const tick = () => {
      if (!isPaused.current) {
        track.scrollLeft += SPEED;
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onEnter = () => { isPaused.current = true; };
    const onLeave = () => { if (!isDragging.current) isPaused.current = false; };

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      isPaused.current = true;
      startX.current = e.clientX;
      startScroll.current = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
      track.style.cursor = 'grabbing';
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      track.scrollLeft = startScroll.current - (e.clientX - startX.current);
    };
    const onPointerUp = () => {
      isDragging.current = false;
      isPaused.current = false;
      track.style.cursor = 'grab';
    };

    const onTouchStart = () => { isPaused.current = true; };
    const onTouchEnd = () => { setTimeout(() => { isPaused.current = false; }, 600); };

    track.addEventListener('mouseenter', onEnter);
    track.addEventListener('mouseleave', onLeave);
    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);
    track.addEventListener('touchstart', onTouchStart, { passive: true });
    track.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      track.removeEventListener('mouseenter', onEnter);
      track.removeEventListener('mouseleave', onLeave);
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerup', onPointerUp);
      track.removeEventListener('pointercancel', onPointerUp);
      track.removeEventListener('touchstart', onTouchStart);
      track.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const doubled = [...tools, ...tools];

  return (
    <div ref={trackRef} className="marquee-drag-track">
      {doubled.map((t, i) => (
        <div className="tool-pill" key={`${t.name}-${i}`}>
          <div className="tool-icon">{t.icon}</div>
          <span className="tool-name">{t.name}</span>
        </div>
      ))}
    </div>
  );
});
