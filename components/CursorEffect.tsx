'use client';

import { useEffect, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default memo(function CursorEffect() {
  const rawX = useMotionValue(-400);
  const rawY = useMotionValue(-400);

  // Outer glow springs behind the cursor for a fluid trail
  const springX = useSpring(rawX, { mass: 0.2, stiffness: 100, damping: 15 });
  const springY = useSpring(rawY, { mass: 0.2, stiffness: 100, damping: 15 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, [rawX, rawY]);

  return (
    <>
      {/* Outer glow — trails behind via spring */}
      <motion.div id="curGlow" style={{ x: springX, y: springY }} />
      {/* Inner dot — snaps to cursor instantly */}
      <motion.div id="curDot" style={{ x: rawX, y: rawY }} />
    </>
  );
});
