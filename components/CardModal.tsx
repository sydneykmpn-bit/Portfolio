'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

export type ProjectData = {
  category: string;
  icon: string;
  tags: string[];
  title: string;
  desc: string;
  metrics: { val: string; label: string }[];
  img?: string;
};

export type SkillData = {
  icon: string;
  title: string;
  desc: string;
  tags: string[];
};

export type ModalPayload =
  | { type: 'project'; data: ProjectData }
  | { type: 'skill'; data: SkillData };

export default function CardModal({ modal, onClose }: { modal: ModalPayload; onClose: () => void }) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const stopProp = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  if (modal.type === 'skill') {
    const s = modal.data;
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box skill-modal" onClick={stopProp}>
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="modal-sk-body">
            <div className="modal-sk-icon">{s.icon}</div>
            <h2 className="modal-title">{s.title}</h2>
            <p className="modal-desc">{s.desc}</p>
            <div className="skill-tags modal-tags">
              {s.tags.map(t => <span className="stag" key={t}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const p = modal.data;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box proj-modal" onClick={stopProp}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div
          className={`modal-thumb${zoomed ? ' zoomed' : ''}`}
          onClick={() => p.img ? setZoomed(z => !z) : undefined}
          style={{ cursor: p.img ? (zoomed ? 'zoom-out' : 'zoom-in') : 'default' }}
        >
          {p.img ? (
            <Image src={p.img} alt={p.title} fill style={{ objectFit: 'cover', transition: 'transform .35s ease' }} />
          ) : (
            <>
              <div className="modal-ph-icon">{p.icon}</div>
              <span className="modal-ph-label">Screenshot coming soon</span>
            </>
          )}
          {p.img && (
            <span className="modal-zoom-hint">{zoomed ? 'Click to zoom out' : 'Click to zoom in'}</span>
          )}
        </div>

        <div className="modal-body">
          <div className="proj-tags" style={{ marginBottom: '.75rem' }}>
            {p.tags.map(t => <span className="ptag" key={t}>{t}</span>)}
          </div>
          <h2 className="modal-title">{p.title}</h2>
          <p className="modal-desc">{p.desc}</p>
          <div className="proj-metrics" style={{ marginTop: '1.1rem' }}>
            {p.metrics.map(m => (
              <div className="metric" key={m.label}>
                <strong>{m.val}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
