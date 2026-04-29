'use client';

import { useEffect, memo } from 'react';

// Add your YouTube video IDs to the videoId fields below.
// Leave videoId empty ('') to show a "coming soon" placeholder.
const DEMOS = [
  { title: 'AI Content Automation Pipeline', videoId: '' },
  { title: 'CRM & Lead Processing System',   videoId: '' },
  { title: 'n8n AI Agent — Facebook Messenger', videoId: '' },
  { title: 'RAG Knowledge Base Demo',        videoId: '' },
];

export default memo(function VideoModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="video-modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="video-modal-head">
          <div className="s-label">Demos</div>
          <h2 className="video-modal-title">Workflow Demos</h2>
          <p className="video-modal-sub">Live recordings of AI &amp; automation systems built for real use cases.</p>
        </div>
        <div className="video-grid">
          {DEMOS.map(d => (
            <div key={d.title} className="video-card">
              {d.videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${d.videoId}?modestbranding=1&rel=0`}
                  title={d.title}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="video-placeholder">
                  <span>Demo coming soon</span>
                </div>
              )}
              <p className="video-card-label">{d.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
