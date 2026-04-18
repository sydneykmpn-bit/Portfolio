'use client';

import { useEffect, memo } from 'react';

export default memo(function ScrollReveal() {
  useEffect(() => {
    // Duplicate marquee for seamless loop
    const track = document.getElementById('marqueeTrack');
    if (track && !track.dataset.duped) {
      track.innerHTML += track.innerHTML;
      track.dataset.duped = '1';
    }

    // Scroll reveal
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.skill-card, .proj-card, .contact-item').forEach(el => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
});
