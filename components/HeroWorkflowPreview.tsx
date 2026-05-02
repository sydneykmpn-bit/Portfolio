'use client';
import { memo } from 'react';

const steps = [
  { label: 'Form submitted',          meta: 'webhook · instant',   s: 'done'    },
  { label: 'AI scores & enriches',    meta: 'OpenAI · 820ms',      s: 'done'    },
  { label: 'Priority route triggered',meta: 'n8n · <1s',           s: 'done'    },
  { label: 'Personalised email sent', meta: 'Gmail · 58s total',   s: 'active'  },
  { label: 'CRM updated & task set',  meta: 'queued',               s: 'pending' },
] as const;

export default memo(function HeroWorkflowPreview() {
  return (
    <div className="hpc">
      <div className="hpc-header">
        <div className="hpc-live-dot" />
        <span>Automation Running</span>
        <span className="hpc-live-badge">LIVE</span>
      </div>
      <div className="hpc-pipe-label">Lead → Email → CRM Pipeline</div>

      <div className="hpc-steps">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className={`hpc-step hpc-step-${step.s}`}
            style={{ '--hpc-i': i } as React.CSSProperties}
          >
            <div className="hpc-step-icon">
              {step.s === 'done' && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
              {step.s === 'active'  && <div className="hpc-spin" />}
              {step.s === 'pending' && <div className="hpc-dot-sm" />}
            </div>
            <div className="hpc-step-body">
              <span className="hpc-step-lbl">{step.label}</span>
              <span className="hpc-step-meta">{step.meta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="hpc-bar-wrap">
        <div className="hpc-bar" />
      </div>

      <div className="hpc-footer">
        <span>+127 runs today</span>
        <span className="hpc-uptime">99.9% uptime</span>
      </div>
    </div>
  );
});
