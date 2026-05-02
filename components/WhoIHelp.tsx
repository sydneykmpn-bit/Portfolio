'use client';

import { memo } from 'react';
import { Briefcase, Building2, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const cards = [
  {
    Icon: Briefcase,
    title: 'Small Business Owners',
    subtitle: 'Tired of repetitive tasks',
  },
  {
    Icon: Building2,
    title: 'Agencies',
    subtitle: 'Needing scalable workflows',
  },
  {
    Icon: Rocket,
    title: 'Founders',
    subtitle: 'Who want to reclaim 10+ hours/week',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const WhoIHelp = memo(function WhoIHelp() {
  return (
    <section className="section" id="who-i-help" style={{ textAlign: 'center' }}>

      <h2
        style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
          fontWeight: 900,
          letterSpacing: '-.02em',
          color: 'var(--text)',
        }}
      >
        Who I Help
      </h2>

      <div
        style={{
          height: '4px',
          width: '72px',
          background: 'linear-gradient(to right, #22d3ee, #3b82f6)',
          borderRadius: '9999px',
          margin: '1rem auto 0',
        }}
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {cards.map(({ Icon, title, subtitle }) => (
          <motion.div
            key={title}
            variants={fadeUp}
            className="flex flex-col items-center rounded-2xl p-8"
            style={{
              background: 'rgba(8,13,26,.92)',
              border: '1px solid rgba(59,130,246,.14)',
              boxShadow:
                '0 20px 40px -15px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.04)',
            }}
          >
            <Icon
              size={32}
              strokeWidth={1.5}
              style={{ color: '#22d3ee', marginBottom: '1rem', flexShrink: 0 }}
            />
            <h3
              style={{
                color: 'var(--text)',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {title}
            </h3>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: '.84rem',
                marginTop: '.5rem',
                lineHeight: 1.65,
              }}
            >
              {subtitle}
            </p>
          </motion.div>
        ))}
      </motion.div>

    </section>
  );
});

export default WhoIHelp;
