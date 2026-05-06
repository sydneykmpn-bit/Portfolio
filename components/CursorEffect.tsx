'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default memo(function CursorEffect() {
  const rawX = useMotionValue(-400);
  const rawY = useMotionValue(-400);

  // Tight spring — follows closely, still fluid, not elastic
  const springX = useSpring(rawX, { stiffness: 500, damping: 28, mass: 0.5 });
  const springY = useSpring(rawY, { stiffness: 500, damping: 28, mass: 0.5 });

  const [isMoving, setIsMoving] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);

      setIsMoving(true);

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIsMoving(false), 150);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [rawX, rawY]);

  return (
    <>
      {/* Outer glow — trails via spring, fades out when idle */}
      <motion.div
        id="curGlow"
        style={{ x: springX, y: springY }}
        animate={{ opacity: isMoving ? 1 : 0, scale: isMoving ? 1 : 0.6 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      {/* Inner dot — always visible, snaps to cursor instantly */}
      <motion.div id="curDot" style={{ x: rawX, y: rawY }} />
    </>
  );
});
