'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

export default memo(function AnimatedBackground() {
  return (
    <div className="anim-bg" aria-hidden="true">
      <motion.div
        className="anim-blob anim-blob-1"
        animate={{ x: [0, 70, -45, 25, 0], y: [0, 55, 30, -40, 0], scale: [1, 1.07, 0.96, 1.04, 1] }}
        transition={{ duration: 22, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
      />
      <motion.div
        className="anim-blob anim-blob-2"
        animate={{ x: [0, -80, 40, -20, 0], y: [0, 40, -55, 25, 0], scale: [1, 0.94, 1.06, 0.98, 1] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
      />
      <motion.div
        className="anim-blob anim-blob-3"
        animate={{ x: [0, 40, -60, 15, 0], y: [0, -45, 25, 55, 0], scale: [1, 1.04, 0.95, 1.05, 1] }}
        transition={{ duration: 25, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
      />
    </div>
  );
});
