'use client';
import { memo } from 'react';

const items = [
  { val: '30hrs/week saved',      tag: 'AI Content Automation · Zapier' },
  { val: '<60s lead response',    tag: 'Routing Pipeline · n8n'         },
  { val: '24/7 chatbot live',     tag: 'Facebook AI Agent · n8n'        },
  { val: 'Zero manual filing',    tag: 'Smart Drive Sorter · Make'      },
  { val: '4× faster follow-up',   tag: 'CRM Pipeline · Zapier'          },
  { val: '3× content output',     tag: 'Content Automation · Zapier'    },
  { val: '0 missed leads',        tag: 'Lead Pipeline · Zapier'         },
];

export default memo(function ResultsTicker() {
  const doubled = [...items, ...items];
  return (
    <div className="rticker" aria-hidden="true">
      <div className="rticker-track">
        {doubled.map((r, i) => (
          <div key={i} className="rticker-item">
            <strong>{r.val}</strong>
            <span>{r.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
