'use client';

import { useEffect, memo } from 'react';

export default memo(function ScrollReveal() {
  useEffect(() => {
    // Duplicate marquee for seamless loop
    const track = document.getElementById('marqueeTrack');
    if (track && !track.dataset.duped) {
      track.append(...Array.from(track.children).map(child => child.cloneNode(true)));
      track.dataset.duped = '1';
    }

    // Scroll reveal
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 }
    );
    document.querySelectorAll('.skill-card, .proj-card, .contact-item').forEach(el => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
});
