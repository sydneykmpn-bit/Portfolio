'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const projects = [
  {
    title: 'AI Content Automation System',
    tech: 'Zapier + OpenAI',
    description:
      'End-to-end pipeline that generates content from source files and auto-publishes across Facebook, LinkedIn, and Instagram — zero manual work.',
    metrics: ['~30 hrs/week saved', '3 platforms', '100% automated'],
    image: 'https://picsum.photos/seed/content-automation/800/450',
    accent: '#22d3ee',
  },
  {
    title: 'CRM & Lead Automation Pipeline',
    tech: 'Zapier + Asana + CRM',
    description:
      'Full lead lifecycle automation with stage-based triggers, email sequences, and real-time Asana task creation for sales teams.',
    metrics: ['4× faster follow-up', 'Zero missed leads', '100% pipeline sync'],
    image: 'https://picsum.photos/seed/crm-pipeline/800/450',
    accent: '#34d399',
  },
  {
    title: 'AI Lead Processing & Outreach',
    tech: 'n8n + Webhooks + OpenAI',
    description:
      'Real-time webhook intake with AI-powered scoring, enrichment, and personalized outreach message generation for high-priority leads.',
    metrics: ['Real-time processing', 'AI personalization', 'Priority scoring'],
    image: 'https://picsum.photos/seed/lead-outreach/800/450',
    accent: '#f472b6',
  },
];

export default function ProjectCards() {
  return (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      <div className="grid grid-cols-1 gap-3">
        {projects.map((p) => (
          <motion.div
            key={p.title}
            className="project-card"
            variants={{
              hidden: { opacity: 0, y: 14, scale: 0.97 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          >
            {/* Screenshot */}
            <div className="relative w-full h-36 overflow-hidden">
              <Image
                src={p.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 600px) 100vw, 560px"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, transparent 40%, var(--bg-2) 100%)`,
                }}
              />
              {/* Tech badge */}
              <span
                className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(0,0,0,0.55)',
                  color: p.accent,
                  border: `1px solid ${p.accent}44`,
                  backdropFilter: 'blur(6px)',
                }}
              >
                {p.tech}
              </span>
            </div>

            {/* Content */}
            <div className="p-3 pt-2">
              <h3
                className="text-sm font-600 tracking-tight mb-1"
                style={{ color: 'var(--text)', fontWeight: 600 }}
              >
                {p.title}
              </h3>
              <p className="text-xs leading-relaxed mb-2.5" style={{ color: 'var(--text-2)' }}>
                {p.description}
              </p>

              {/* Metrics */}
              <div className="flex flex-wrap gap-1.5">
                {p.metrics.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: `${p.accent}14`,
                      color: p.accent,
                      border: `1px solid ${p.accent}28`,
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs mt-3" style={{ color: 'var(--text-3)' }}>
        Want to see full case studies? Just ask!
      </p>
    </motion.div>
  );
}
