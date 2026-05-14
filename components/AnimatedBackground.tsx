'use client';

import { memo } from 'react';

export default memo(function AnimatedBackground() {
  return (
    <div className="anim-bg" aria-hidden="true">
      <div className="anim-blob anim-blob-1" />
      <div className="anim-blob anim-blob-2" />
      <div className="anim-blob anim-blob-3" />
    </div>
  );
});
