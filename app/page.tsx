'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState, useEffect, useRef, memo } from 'react';
import { motion, animate, useInView, useScroll } from 'framer-motion';

const CursorEffect     = dynamic(() => import('@/components/CursorEffect'),     { ssr: false });
const ChatWidget       = dynamic(() => import('@/components/ChatWidget'),        { ssr: false });
const ScrollReveal     = dynamic(() => import('@/components/ScrollReveal'),      { ssr: false });
const CardModal        = dynamic(() => import('@/components/CardModal'),         { ssr: false });
const VideoModal       = dynamic(() => import('@/components/VideoModal'),        { ssr: false });
import type { ModalPayload } from '@/components/CardModal';

const tools = [
  { icon: '🤖', name: 'OpenAI' }, { icon: '⚡', name: 'Groq' },
  { icon: '🔗', name: 'LangChain' }, { icon: '🔧', name: 'Make.com' },
  { icon: '🌐', name: 'n8n' }, { icon: '⚙️', name: 'Zapier' },
  { icon: '🚀', name: 'Next.js' }, { icon: '⚛️', name: 'React' },
  { icon: '🐍', name: 'Python' }, { icon: '🗄️', name: 'Supabase' },
  { icon: '💾', name: 'PostgreSQL' }, { icon: '📞', name: 'VAPI' },
  { icon: '🌿', name: 'Django' }, { icon: '📊', name: 'Airtable' },
  { icon: '💬', name: 'Slack' }, { icon: '☁️', name: 'Vercel' },
  { icon: '🐙', name: 'GitHub' }, { icon: '🔐', name: 'Webhooks' },
  { icon: '🗃️', name: 'pgvector' }, { icon: '📋', name: 'Notion' },
];

const allProjects = [
  // ── Featured (has screenshot) ──────────────────────────────────
  {
    category: 'n8n',
    icon: '💬', tags: ['n8n', 'Facebook Messenger', 'OpenAI', 'AI'], title: 'Facebook AI Agent Chatbot',
    problem: "Client's Facebook Page was getting 80+ messages/day. Team spending 3 hours daily copy-pasting the same answers.",
    desc: 'Built a production AI chatbot on n8n that reads each Messenger message, understands intent, pulls product info from a knowledge base, and replies instantly — escalating to a human only when genuinely needed.',
    metrics: [{ val: '24/7', label: 'Available' }, { val: '0', label: 'Human needed' }],
    img: '/AI_Agent.png',
  },
  {
    category: 'Zapier',
    icon: '🤖', tags: ['Zapier', 'OpenAI'], title: 'AI Content Automation',
    problem: 'Social media manager spending 30+ hours/week manually writing posts, resizing for each platform, and scheduling individually.',
    desc: 'Built a Zapier + OpenAI pipeline: source brief goes in, AI generates platform-optimised copy for each channel, content publishes to Facebook and Instagram automatically — zero manual steps.',
    metrics: [{ val: '30hrs', label: 'Saved/week' }, { val: '3×', label: 'Output volume' }],
    img: '/ai-content-repurposing.png',
  },
  {
    category: 'Zapier',
    icon: '⚡', tags: ['Zapier', 'CRM', 'Asana'], title: 'CRM & Lead Pipeline',
    problem: 'Sales team manually moving leads through stages, writing follow-up emails, and creating Asana tasks by hand — leads were slipping through.',
    desc: 'Every CRM stage change now triggers the correct email sequence and creates an Asana task in real time. No manual effort, no missed handoffs, no forgotten follow-ups.',
    metrics: [{ val: '4×', label: 'Faster follow-up' }, { val: '0', label: 'Missed leads' }],
    img: '/zapier-expert-for-asana.png',
  },
  {
    category: 'Zapier',
    icon: '🎯', tags: ['Zapier', 'CRM', 'Gmail', 'Webhooks'], title: 'Leads Enrichment & Routing',
    problem: 'High-value leads were getting the same slow, generic response as low-intent inquiries. Hot leads were going cold.',
    desc: 'Webhook pipeline that scores each submission on entry, routes hot leads to a priority Sheet, and fires a personalised Gmail follow-up — under 60 seconds from form submit to inbox.',
    metrics: [{ val: '<60s', label: 'Response time' }, { val: '100%', label: 'Auto-routed' }],
    img: '/leads-enrichment.png',
  },
  {
    category: 'Make',
    icon: '🗂️', tags: ['Make', 'Google Drive', 'AI Analysis', 'Gmail'], title: 'Smart Drive Auto-Sorter',
    problem: 'Team spending hours each week downloading email attachments, renaming them manually, and filing them into the right Drive folders.',
    desc: 'Make scenario intercepts every incoming attachment, uses AI to read content and assign the correct filename, sorts it into the right Drive folder, and logs the entry to a Sheet — automatically.',
    metrics: [{ val: '0', label: 'Manual sorting' }, { val: 'AI', label: 'File naming' }],
    img: '/Auto_Sort_Gmail_Attachments_on_Drive.png',
  },
  // ── Archive (screenshots pending) ─────────────────────────────
  {
    category: 'Dev',
    icon: '🎓', tags: ['React', 'Django', 'PostgreSQL', 'REST API'], title: 'Academic Repository System',
    desc: 'Full-stack institutional document management platform — students submit research papers and theses, faculty review and approve, and administrators manage the repository with granular role-based access control and audit trails.',
    metrics: [{ val: 'Full-stack', label: 'React + Django' }, { val: 'RBAC', label: 'Role-based access' }],
  },
  {
    category: 'Dev',
    icon: '🏪', tags: ['React', 'Python', 'PostgreSQL', 'REST API'], title: 'Point-of-Sale (POS) Interface',
    desc: 'Custom POS system for a retail client — real-time inventory tracking, barcode scanning, order processing, receipt generation, and a daily sales dashboard built into a touch-optimised React interface.',
    metrics: [{ val: 'Real-time', label: 'Inventory sync' }, { val: 'Touch UI', label: 'Optimised' }],
  },
  {
    category: 'Make',
    icon: '📈', tags: ['Make', 'Xero', 'Asana'], title: 'Financial Data Automation',
    desc: 'Automated financial reporting pipeline — Xero extraction, CSV transformation, and Asana task injection.',
    metrics: [{ val: '15hrs', label: 'Saved/week' }, { val: '100%', label: 'Accuracy' }],
  },
  {
    category: 'n8n',
    icon: '📊', tags: ['n8n', 'Webhooks', 'OpenAI'], title: 'AI Lead Outreach System',
    desc: 'Real-time webhook lead intake with AI scoring, enrichment, and personalised outreach message generation.',
    metrics: [{ val: 'Live', label: 'Processing' }, { val: 'AI', label: 'Personalised' }],
  },
  {
    category: 'n8n',
    icon: '🎬', tags: ['n8n', 'Content APIs'], title: 'Short-Form Content Pipeline',
    desc: 'Full automated pipeline from AI content generation to publishing YouTube Shorts and Facebook Reels.',
    metrics: [{ val: '100%', label: 'Automated' }, { val: '0', label: 'Manual posts' }],
  },
  {
    category: 'n8n',
    icon: '🧠', tags: ['RAG', 'Supabase', 'OpenAI'], title: 'RAG Knowledge Base Agent',
    desc: 'Semantic search system — documents chunked, embedded into Supabase pgvector, and retrieved via OpenAI for accurate, source-grounded answers.',
    metrics: [{ val: '<1s', label: 'Response time' }, { val: '95%+', label: 'Accuracy' }],
  },
];

const TOOL_TABS = ['Make', 'n8n', 'Zapier'];

const faqsLeft = [
  { q: 'How much do your services cost?', a: "I keep pricing flexible based on scope and complexity. The discovery call is free — that's where we figure out what makes sense. Scroll to Connect to book it." },
  { q: 'How long does it take to build an automation?', a: "Most workflows are live within 3–5 business days after our discovery call. Complex multi-system builds may take up to 2 weeks — I'll give you a clear timeline before any work begins." },
  { q: 'Do I need to know how to code?', a: "Not at all. I build systems you can run, monitor, and manage without writing a single line of code. I document everything and walk you through it at handoff." },
  { q: 'What if something breaks after delivery?', a: "Post-launch support is included. I monitor the system and fix any issues that come up — if your tools update or your workflow changes, I'm on it." },
  { q: 'Which tools and platforms do you work with?', a: "Make.com, n8n, Zapier, OpenAI, Supabase, React, Python, Webhooks, and more. If you're using it, I've most likely integrated it before." },
];

const faqsRight = [
  { q: 'Can you work with my existing systems?', a: "Yes — I integrate with the tools you already use. No need to rip and replace your current stack. I build on top of what you have." },
  { q: 'Do you offer ongoing support after the project?', a: "Yes — retainer packages are available for businesses that want continuous updates, monitoring, and new automations built over time." },
  { q: 'How do we get started?', a: "Book a free 30-minute audit call via the Connect section. I'll map your current workflow and show you exactly what's worth automating — and what that's worth." },
  { q: "What if I have a tool or platform you haven't mentioned?", a: "I work with almost any tool or platform. Just tell me what you're currently using — most likely I can integrate it seamlessly." },
  { q: 'How quickly can you build and deploy an automation?', a: "Simple workflows can go live in as little as 24–48 hours. Multi-system builds are typically done within a week. Speed depends on complexity and your tool access." },
];

const processSteps = [
  { num: '01', icon: '🔍', title: 'Discovery', desc: 'We map your existing workflow in one call — every manual step, every tool, every bottleneck. Full clarity before anything is built.' },
  { num: '02', icon: '📐', title: 'Design', desc: 'I architect the automation end-to-end: tools, triggers, logic, edge cases, error handling — all planned before a single step is wired.' },
  { num: '03', icon: '⚙️', title: 'Build', desc: 'Production-grade system built and tested in isolation. You review a working demo before it touches live data or real workflows.' },
  { num: '04', icon: '🚀', title: 'Deploy', desc: "Live in your environment, monitored, and fully documented. No black boxes — you own it and understand how it works." },
  { num: '05', icon: '🛡️', title: 'Support', desc: 'Post-launch support included. If it breaks, needs updating, or your tools change — I\'m on it.' },
];

const testimonials = [
  {
    initials: 'VC', name: 'Vincent C.', role: 'Local Gym Business Owner', company: 'Velocity Fitness',
    text: 'Every inquiry used to sit in my inbox until I had time to reply — sometimes days. Sydney built a system that responds the moment someone reaches out, qualifies them, and books a trial automatically. Our show-up rate improved and I stopped losing leads to gyms that responded faster. It paid for itself within the first two weeks.',
  },
  {
    initials: 'KC', name: 'Kacie C.', role: 'Local Cafe Owner', company: 'Mori Cafe',
    text: 'I used to struggle a lot with scheduling content. Sydney automated everything and made my life so much easier.',
  },
];

// Animated counter — isolated component per CLAUDE.md perf guidelines
const AnimatedCounter = memo(function AnimatedCounter({
  to, suffix = '', prefix = '',
}: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const ctrl = animate(0, to, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: v => setDisplay(Math.round(v)),
    });
    return ctrl.stop;
  }, [isInView, to]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
});

// Back-to-top — isolated, uses Framer Motion scroll hook (no window.addEventListener)
const ScrollToTop = memo(function ScrollToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return scrollY.on('change', v => setVisible(v > 500));
  }, [scrollY]);

  if (!visible) return null;
  return (
    <button
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
});

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

export default function Page() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeTab, setActiveTab] = useState('Featured');
  const [modal, setModal] = useState<ModalPayload | null>(null);
  const [showVideos, setShowVideos] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [openFaqL, setOpenFaqL] = useState<number | null>(null);
  const [openFaqR, setOpenFaqR] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    let initial: 'dark' | 'light';
    if (saved === 'dark' || saved === 'light') {
      initial = saved;
    } else {
      initial = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const io = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.05 }
      );
      document.querySelectorAll('.proj-card').forEach(el => {
        el.classList.remove('visible');
        io.observe(el);
      });
      return () => io.disconnect();
    }, 80);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(false);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(e.currentTarget),
      });
      const data = await res.json();
      if (data.success) {
        setFormSent(true);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setFormSent(false), 8000);
      } else {
        setFormError(true);
      }
    } catch {
      setFormError(true);
    }
  };

  const visibleProjects =
    activeTab === 'Featured' ? allProjects.filter(p => p.img) :
    activeTab === 'All'      ? allProjects :
    allProjects.filter(p => p.category === activeTab);
  const archiveCount = allProjects.filter(p => !p.img).length;
  const calendlyUrl = 'https://calendly.com/sydneykmpn/30min?hide_gdpr_banner=1&primary_color=3b82f6';

  return (
    <>
      <CursorEffect />
      <ScrollReveal />
      <div className="bg-canvas" />

      {/* NAV */}
      <nav>
        <a className="logo" href="#"><span className="logo-mark">Sydney</span></a>
        <div className="nav-group">
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Connect</a></li>
          </ul>
          <div className="nav-right">
            <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mob-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mob-panel" onClick={e => e.stopPropagation()}>
            <button className="mob-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
            <p className="mob-label">Navigation</p>
            <ul className="mob-links">
              <li><a href="#about"    onClick={() => setMenuOpen(false)}>About<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a></li>
              <li><a href="#skills"   onClick={() => setMenuOpen(false)}>Skills<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a></li>
              <li><a href="#projects" onClick={() => setMenuOpen(false)}>Projects<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a></li>
              <li><a href="#contact"  onClick={() => setMenuOpen(false)}>Connect<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a></li>
            </ul>
          </div>
        </div>
      )}

      {/* HERO */}
      <section id="hero">
        <div className="hero-left">
          <div className="hero-tag">
            <span className="hero-tag-dot" />
            Open to work
          </div>
          <h1 className="hero-name">
            <span className="hero-word" style={{ animationDelay: '.08s' }}>Does your business</span>{' '}
            <span className="hero-word" style={{ animationDelay: '.2s' }}>run on</span>
            <br />
            <em className="hero-word" style={{ animationDelay: '.32s' }}>manual work?</em>
            <br />
            <span className="hero-word" style={{ animationDelay: '.44s' }}>Let&apos;s fix that.</span>
          </h1>
          <p className="hero-role">AI Automation Engineer · Sydney Pua Ng · Manila, PH</p>
          <p className="hero-desc">I use AI to automate your ops and follow-ups, giving your team their time back to focus on growth, not repetitive tasks.</p>

          <div className="hero-ctas">
            <a href="#contact" className="btn-primary">Get a Free Audit →</a>
            <a href="#projects" className="btn-outline">See Results ↓</a>
          </div>

          <div className="hero-trust">
            <span className="hero-trust-label">Automating with</span>
            {['n8n', 'Zapier', 'Make', 'OpenAI', 'VAPI'].map(t => (
              <span className="hero-trust-pill" key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-photo-wrap">
            <Image
              src="/2x2.png"
              alt="Sydney Pua Ng — AI Automation Engineer"
              fill
              priority
              style={{ objectFit: 'cover', objectPosition: 'center 12%' }}
            />
          </div>
        </div>

        <div className="scroll-cue" onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}>
          <span>Scroll</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* TOOLS GRID */}
      <div id="tools">
        <p className="marquee-label">Stack &amp; Integrations</p>
        <div className="tools-static">
          {tools.map(t => (
            <div className="tool-pill-s" key={t.name}>
              <span className="tool-icon-s">{t.icon}</span>
              <span className="tool-name-s">{t.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section className="section section-alt" id="about" style={{ textAlign: 'center' }}>
        <div className="s-label" style={{ textAlign: 'center' }}>About</div>
        <div className="about-solo">
          <h2 className="s-title">Manual work is your<br /><em>biggest bottleneck.</em></h2>
          <p className="about-lead">I help growing businesses and agencies cut the manual tasks eating their team&apos;s time — using AI and automation tools that connect to what you already use. <strong>No new software to learn. No engineers to hire.</strong></p>
          <p className="about-lead">Slow lead follow-up, content that needs scheduling by hand, reports pulled manually every week — these aren&apos;t just annoying. They&apos;re expensive. I build the system that <strong>fixes it permanently</strong> and keeps running after I&apos;m gone.</p>
          <motion.div
            className="about-stats"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <motion.div className="astat" variants={fadeUp}><strong><AnimatedCounter to={10} suffix="+" /></strong><span>Systems shipped</span></motion.div>
            <motion.div className="astat" variants={fadeUp}><strong><AnimatedCounter to={30} suffix="hrs+" /></strong><span>Saved per client/week</span></motion.div>
            <motion.div className="astat" variants={fadeUp}><strong><AnimatedCounter to={4} /></strong><span>Automation platforms</span></motion.div>
            <motion.div className="astat" variants={fadeUp}><strong>24/7</strong><span>Runs without you</span></motion.div>
          </motion.div>
          <a href="#contact" className="btn-primary">Start the conversation →</a>
        </div>
      </section>

      {/* SKILLS */}
      <section className="section" id="skills">
        <div className="s-label">Services</div>
        <h2 className="s-title">What I automate<br /><em>for you</em></h2>
        <motion.div
          className="skills-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {[
            {
              icon: '🎯', title: 'Lead Generation & Follow-Up',
              desc: 'Every lead gets a personalised reply in under 60 seconds — scored, routed to the right rep, and followed up automatically. No one falls through the cracks.',
              tags: ['Zapier', 'n8n', 'CRM', 'Webhooks'],
            },
            {
              icon: '📱', title: 'Social Media & Content',
              desc: 'Source content once. AI formats it for each platform, schedules it, and publishes — Facebook, Instagram, LinkedIn — without a single manual post.',
              tags: ['Zapier', 'OpenAI', 'Make.com', 'Buffer'],
            },
            {
              icon: '🤝', title: 'Client Onboarding',
              desc: 'New client signed? From contract to fully onboarded in minutes — welcome emails, task creation, tool access, and document delivery all happen automatically.',
              tags: ['n8n', 'Make.com', 'Notion', 'Webhooks'],
            },
            {
              icon: '⚙️', title: 'Internal Workflow Ops',
              desc: 'Recurring reports, file sorting, data entry, and approvals — all running on schedule without reminders, manual effort, or someone remembering to do it.',
              tags: ['Make.com', 'Google Drive', 'Airtable', 'Slack'],
            },
            {
              icon: '💬', title: 'AI Chatbots & Agents',
              desc: 'Deploy an AI agent on your website or Messenger that qualifies leads, answers questions, and books calls at 2am on a Sunday — no human needed.',
              tags: ['n8n', 'OpenAI', 'Facebook', 'Supabase'],
            },
            {
              icon: '🔗', title: 'Integrations & Custom APIs',
              desc: 'Make every tool in your stack talk to each other. No more copy-pasting between your CRM, email, spreadsheets, and apps — it flows automatically.',
              tags: ['REST APIs', 'Webhooks', 'PostgreSQL', 'Python'],
            },
          ].map((s) => (
            <motion.div className="skill-card clickable-card" key={s.title} variants={fadeUp} onClick={() => setModal({ type: 'skill', data: s })}>
              <div className="sk-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="skill-tags">{s.tags.map(t => <span className="stag" key={t}>{t}</span>)}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* PROCESS */}
      <section className="section section-alt" id="process">
        <div className="s-label">How I Work</div>
        <h2 className="s-title">From first call to<br /><em>live system.</em></h2>
        <motion.div
          className="process-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {processSteps.map((step) => (
            <motion.div className="process-step" key={step.num} variants={fadeUp}>
              <div className="process-num">{step.num}</div>
              <div className="process-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* PROJECTS */}
      <section className="section section-alt" id="projects">
        <div className="proj-section-header">
          <div className="s-label">Portfolio</div>
          <button className="btn-demo" onClick={() => setShowVideos(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Watch Video Demos
          </button>
        </div>
        <h2 className="s-title">
          {activeTab === 'Featured' ? 'Featured Work' : activeTab === 'All' ? 'All Projects' : `${activeTab} Projects`}
        </h2>
        <div className="proj-tabs">
          <button
            className={`ptab${activeTab === 'Featured' ? ' active' : ''}`}
            onClick={() => setActiveTab('Featured')}
          >
            Featured
          </button>
          <div className="ptab-sep" />
          {TOOL_TABS.map(tab => (
            <button key={tab} className={`ptab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
          <div className="ptab-sep" />
          <button
            className={`ptab ptab-secondary${activeTab === 'All' ? ' active' : ''}`}
            onClick={() => setActiveTab('All')}
          >
            All
          </button>
        </div>
        <div className="projects-grid">
          {visibleProjects.map((p) => (
            <div className="proj-card clickable-card" key={p.title} onClick={() => setModal({ type: 'project', data: p })}>
              <div className="proj-thumb">
                {p.img ? (
                  <Image src={p.img} alt={p.title} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <>
                    <div className="proj-ph-icon">{p.icon}</div>
                    <div className="proj-ph-label">Screenshot coming soon</div>
                  </>
                )}
              </div>
              <div className="proj-body">
                <div className="proj-tags">{p.tags.map(t => <span className="ptag" key={t}>{t}</span>)}</div>
                <h3>{p.title}</h3>
                {p.problem ? (
                  <>
                    <button
                      className={`proj-expand-btn${expandedProject === p.title ? ' open' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setExpandedProject(expandedProject === p.title ? null : p.title); }}
                    >
                      <span>{expandedProject === p.title ? 'Hide details' : 'View case study'}</span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                    <div className={`proj-accordion${expandedProject === p.title ? ' open' : ''}`}>
                      <div className="proj-block">
                        <span className="proj-block-label">Problem</span>
                        <p className="proj-block-text">{p.problem}</p>
                      </div>
                      <div className="proj-block">
                        <span className="proj-block-label">Solution</span>
                        <p className="proj-block-text">{p.desc}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="proj-block-text">{p.desc}</p>
                )}
                <div className="proj-metrics">
                  {p.problem && <span className="proj-result-label">Result</span>}
                  {p.metrics.map(m => (
                    <div className="metric" key={m.label}><strong>{m.val}</strong><span>{m.label}</span></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {activeTab === 'Featured' && archiveCount > 0 && (
          <div className="proj-archive-hint">
            {archiveCount} more project{archiveCount !== 1 ? 's' : ''} in archive —{' '}
            <button onClick={() => setActiveTab('All')}>View all</button>
          </div>
        )}
      </section>

      {/* TESTIMONIALS */}
      <section className="section" id="testimonials">
        <div className="s-label">Client Results</div>
        <h2 className="s-title">What clients<br /><em>actually say.</em></h2>
        <motion.div
          className="testimonials-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {testimonials.map((t) => (
            <motion.div className="testi-card" key={t.name} variants={fadeUp}>
              <div className="testi-quote-mark">&ldquo;</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-divider" />
              <div className="testi-author">
                <div className="testi-initials">{t.initials}</div>
                <div className="testi-author-info">
                  <strong>{t.name}</strong>
                  <span className="testi-role">{t.role}</span>
                  <span className="testi-company">{t.company}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="s-label">FAQ</div>
        <h2 className="s-title">Common questions<br /><em>answered.</em></h2>
        <div className="faq-cols">
          <div className="faq-col">
            {faqsLeft.map((item, i) => (
              <div
                key={i}
                className={`faq-item${openFaqL === i ? ' open' : ''}`}
                onClick={() => setOpenFaqL(openFaqL === i ? null : i)}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <div className="faq-toggle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <div className="faq-answer"><p>{item.a}</p></div>
              </div>
            ))}
          </div>
          <div className="faq-col">
            {faqsRight.map((item, i) => (
              <div
                key={i}
                className={`faq-item${openFaqR === i ? ' open' : ''}`}
                onClick={() => setOpenFaqR(openFaqR === i ? null : i)}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <div className="faq-toggle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <div className="faq-answer"><p>{item.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONNECT */}
      <section className="section section-alt" id="contact">
        <div className="s-label">Connect</div>
        <h2 className="s-title">Let&apos;s build something that<br /><em>pays for itself.</em></h2>
        <p className="connect-sub">Most clients recover the cost within the first week. If your team repeats a task more than twice a day — I can automate it. Book a free 30-minute call.</p>

        <div className="connect-grid">

          {/* LEFT — Calendly */}
          <div className="cal-card">
            <div className="cal-header">
              <div className="cal-icon">📅</div>
              <div>
                <h3>Book a Free Strategy Call</h3>
                <p>30 min</p>
              </div>
            </div>
            <div className="cal-body">
              <iframe
                src={calendlyUrl}
                width="100%"
                frameBorder="0"
                title="Book a call with Sydney"
              />
            </div>
          </div>

          {/* RIGHT — Form + Resume + Links */}
          <div className="connect-right">

            {/* Send a Message */}
            <div className="form-card">
              <h3 className="form-card-title">Send a Message</h3>
              {formSent ? (
                <div className="form-success">
                  Message sent — I&apos;ll get back to you soon!
                </div>
              ) : (
                <form
                  className="contact-form"
                  action="https://api.web3forms.com/submit"
                  method="POST"
                  onSubmit={handleContactSubmit}
                >
                  <input type="hidden" name="access_key" value="0a85b4ea-50ff-4176-8dc3-d87ec780911e" />
                  <input type="hidden" name="subject" value="New portfolio inquiry" />
                  <div className="form-field">
                    <label htmlFor="cf-name">Name</label>
                    <input id="cf-name" type="text" name="name" placeholder="Your name" required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cf-email">Email</label>
                    <input id="cf-email" type="email" name="email" placeholder="your@email.com" required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cf-msg">Message</label>
                    <textarea id="cf-msg" name="message" rows={4} placeholder="Tell me about your project..." required />
                  </div>
                  {formError && (
                    <p className="form-error">Something went wrong — please try again or email me directly.</p>
                  )}
                  <button type="submit" className="btn-primary form-submit">Send Message →</button>
                </form>
              )}
            </div>

            {/* Resume card */}
            <div className="resume-card">
              <div className="resume-icon">📄</div>
              <div className="resume-info">
                <strong>Resume</strong>
                <span>AI Automation Engineer &amp; Software Developer</span>
              </div>
              <a href="/resume.pdf" download="PuaNg_Resume" className="btn-download">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                Download PDF
              </a>
            </div>

            {/* Direct contact */}
            <div className="contact-ctas">
              <a href="mailto:sydneykmpn@gmail.com" className="email-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M2 7l10 7 10-7"/>
                </svg>
                sydneykmpn@gmail.com
              </a>
              <a href="https://wa.me/639177059448" target="_blank" rel="noreferrer" className="btn-contact btn-whatsapp">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <small>© 2026 Sydney Pua Ng</small>
      </footer>

      <ScrollToTop />
      {modal      && <CardModal modal={modal} onClose={() => setModal(null)} />}
      {showVideos && <VideoModal onClose={() => setShowVideos(false)} />}
      <ChatWidget />
    </>
  );
}
