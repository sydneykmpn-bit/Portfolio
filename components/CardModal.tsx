'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
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

const MIN_SCALE = 0.75;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.5;

export default function CardModal({ modal, onClose }: { modal: ModalPayload; onClose: () => void }) {
  const [scale, setScale]     = useState(1);
  const [pan, setPan]         = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const viewerRef   = useRef<HTMLDivElement>(null);
  const dragStart   = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);
  const pinchRef    = useRef<number | null>(null);

  // Lock body scroll + ESC key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Non-passive wheel listener so we can call preventDefault
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setScale(s => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s - e.deltaY * 0.0012)));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const resetView = useCallback(() => { setScale(1); setPan({ x: 0, y: 0 }); }, []);
  const zoomIn    = useCallback(() => setScale(s => Math.min(MAX_SCALE, +(s + ZOOM_STEP).toFixed(2))), []);
  const zoomOut   = useCallback(() => {
    setScale(s => {
      const next = +(s - ZOOM_STEP).toFixed(2);
      if (next <= 1) { setPan({ x: 0, y: 0 }); }
      return Math.max(MIN_SCALE, next);
    });
  }, []);

  // Mouse drag
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
    setDragging(true);
  }, [scale, pan]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !dragStart.current) return;
    setPan({
      x: dragStart.current.px + e.clientX - dragStart.current.mx,
      y: dragStart.current.py + e.clientY - dragStart.current.my,
    });
  }, [dragging]);

  const onMouseUp = useCallback(() => {
    setDragging(false);
    dragStart.current = null;
  }, []);

  // Touch: single-finger pan + pinch zoom
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1 && scale > 1) {
      dragStart.current = { mx: e.touches[0].clientX, my: e.touches[0].clientY, px: pan.x, py: pan.y };
      setDragging(true);
    }
  }, [scale, pan]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / pinchRef.current;
      pinchRef.current = dist;
      setScale(s => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s * ratio)));
    } else if (e.touches.length === 1 && dragging && dragStart.current) {
      setPan({
        x: dragStart.current.px + e.touches[0].clientX - dragStart.current.mx,
        y: dragStart.current.py + e.touches[0].clientY - dragStart.current.my,
      });
    }
  }, [dragging]);

  const onTouchEnd = useCallback(() => {
    pinchRef.current = null;
    setDragging(false);
    dragStart.current = null;
  }, []);

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
  const isZoomed = scale !== 1 || pan.x !== 0 || pan.y !== 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box proj-modal" onClick={stopProp}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {p.img ? (
          <div
            ref={viewerRef}
            className="modal-img-viewer"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
          >
            <div
              className="modal-img-inner"
              style={{
                transform: `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)`,
                transition: dragging ? 'none' : 'transform .18s ease',
              }}
            >
              <Image
                src={p.img}
                alt={p.title}
                width={860}
                height={540}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                sizes="(max-width:900px) 100vw, 860px"
              />
            </div>

            <div className="zoom-controls" onClick={e => e.stopPropagation()}>
              <button className="zoom-btn" onClick={zoomIn} title="Zoom in">+</button>
              <span className="zoom-level">{Math.round(scale * 100)}%</span>
              <button className="zoom-btn" onClick={zoomOut} title="Zoom out">−</button>
              {isZoomed && (
                <button className="zoom-btn zoom-reset" onClick={resetView} title="Reset view">
                  Reset
                </button>
              )}
            </div>

            {scale === 1 && (
              <span className="zoom-hint">Scroll or pinch to zoom · drag to pan</span>
            )}
          </div>
        ) : (
          <div className="modal-thumb">
            <div className="modal-ph-icon">{p.icon}</div>
            <span className="modal-ph-label">Screenshot coming soon</span>
          </div>
        )}

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
