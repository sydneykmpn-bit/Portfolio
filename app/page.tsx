'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const CursorEffect = dynamic(() => import('@/components/CursorEffect'), { ssr: false });
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });
const ScrollReveal = dynamic(() => import('@/components/ScrollReveal'), { ssr: false });
const CardModal = dynamic(() => import('@/components/CardModal'), { ssr: false });

import type { ModalPayload } from '@/components/CardModal';

const tools = [
  { icon: '🤖', name: 'OpenAI' }, { icon: '⚡', name: 'Groq' },
  { icon: '🔗', name: 'LangChain' }, { icon: '🔧', name: 'Make.com' },
  { icon: '🌐', name: 'n8n' }, { icon: '⚙️', name: 'Zapier' },
  { icon: '🚀', name: 'Next.js' }, { icon: '⚛️', name: 'React' },
  { icon: '🐍', name: 'Python' }, { icon: '🗄️', name: 'Supabase' },
  { icon: '📊', name: 'Airtable' }, { icon: '💬', name: 'Slack' },
  { icon: '📋', name: 'Notion' }, { icon: '🎨', name: 'Canva' },
  { icon: '📅', name: 'Calendly' }, { icon: '☁️', name: 'Vercel' },
  { icon: '🐙', name: 'GitHub' }, { icon: '🔐', name: 'Webhooks' },
];

const allProjects = [
  {
    category: 'Zapier',
    icon: '🤖', tags: ['Zapier', 'OpenAI'], title: 'AI Content Automation',
    desc: 'Generates content from source files and auto-publishes across Facebook, LinkedIn, and Instagram — zero manual work.',
    metrics: [{ val: '30hrs', label: 'Saved/week' }, { val: '3×', label: 'Platforms' }],
  },
  {
    category: 'Zapier',
    icon: '⚡', tags: ['Zapier', 'CRM', 'Asana'], title: 'CRM & Lead Pipeline',
    desc: 'Full lead lifecycle automation with stage-based triggers, email sequences, and real-time Asana task creation.',
    metrics: [{ val: '4×', label: 'Faster follow-up' }, { val: '0', label: 'Missed leads' }],
  },
  {
    category: 'Make',
    icon: '📈', tags: ['Make', 'Xero', 'Asana'], title: 'Financial Data Automation',
    desc: 'Automated financial reporting pipeline — Xero extraction, CSV transformation, and Asana task injection.',
    metrics: [{ val: '15hrs', label: 'Saved/week' }, { val: '100%', label: 'Accuracy' }],
  },
  {
    category: 'Make',
    icon: '📧', tags: ['Make', 'Gmail', 'Drive'], title: 'Email & File Automation',
    desc: 'Intelligent email attachment router — incoming emails parsed, attachments sorted, and files routed automatically.',
    metrics: [{ val: '90%', label: 'Less manual work' }, { val: '0', label: 'Manual sorting' }],
  },
  {
    category: 'n8n',
    icon: '📊', tags: ['n8n', 'Webhooks', 'OpenAI'], title: 'AI Lead Outreach System',
    desc: 'Real-time webhook lead intake with AI scoring, enrichment, and personalised outreach message generation.',
    metrics: [{ val: 'Live', label: 'Processing' }, { val: 'AI', label: 'Personalised' }],
  },
  {
    category: 'n8n',
    icon: '💬', tags: ['n8n', 'Facebook', 'AI'], title: 'AI Facebook Messenger Bot',
    desc: 'Production-ready AI chatbot for Facebook Messenger with context memory, tool access, and 24/7 availability.',
    metrics: [{ val: '24/7', label: 'Available' }, { val: '0', label: 'Human needed' }],
  },
  {
    category: 'n8n',
    icon: '🎬', tags: ['n8n', 'Content APIs'], title: 'Short-Form Content Pipeline',
    desc: 'Full automated pipeline from AI content generation to publishing YouTube Shorts and Facebook Reels.',
    metrics: [{ val: '100%', label: 'Automated' }, { val: '0', label: 'Manual posts' }],
  },
  {
    category: 'HighLevel',
    icon: '📅', tags: ['HighLevel', 'n8n', 'AI'], title: 'AI Appointment Setter',
    desc: 'Automated inquiry handling and appointment booking with intelligent scheduling logic and instant responses.',
    metrics: [{ val: '24/7', label: 'Booking' }, { val: '100%', label: 'Auto-response' }],
  },
];

const TABS = ['All', 'Zapier', 'Make', 'n8n', 'HighLevel'];

export default function Page() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState('All');
  const [modal, setModal] = useState<ModalPayload | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initial = saved ?? 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  // Re-run observer when tab changes so cards in viewport become visible
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

  const visibleProjects = activeTab === 'All' ? allProjects : allProjects.filter(p => p.category === activeTab);

  const calendlyUrl = 'https://calendly.com/sydneykmpn/30min?hide_gdpr_banner=1&primary_color=a855f7';

  return (
    <>
      <CursorEffect />
      <ScrollReveal />

      {/* Animated background */}
      <div className="bg-canvas">
        <div className="bg-orb" />
        <div className="bg-orb" />
        <div className="bg-orb" />
      </div>

      {/* NAV */}
      <nav>
        <a className="logo" href="#"><span className="logo-mark">SP</span></a>
        <div className="nav-group">
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-right">
            <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
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
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="avatar-wrap">
          <div className="avatar-ring" />
          <div className="avatar-img">
            <Image
              src="/2x2.png"
              alt="Sydney"
              width={150}
              height={150}
              priority
              style={{ objectPosition: 'center 10%' }}
            />
          </div>
          <div className="status-dot" />
        </div>

        <div className="hero-tag">Open to work</div>
        <h1 className="hero-name">I&apos;m <em>Sydney</em></h1>
        <p className="hero-role">AI Automation Engineer · Manila, Philippines</p>
        <p className="hero-edu">BS Computer Science · University of the Philippines Manila</p>
        <p className="hero-desc">I build smart automation systems and AI tools that save businesses time and effort.</p>

        <div className="hero-ctas">
          <a href="#contact" className="btn-primary">Book a call →</a>
          <a href="#projects" className="btn-outline">See my work</a>
        </div>

        <div className="scroll-cue" onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}>
          <span>Scroll</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* TOOL MARQUEE */}
      <div id="tools">
        <p className="marquee-label">Tools &amp; Integrations</p>
        <div style={{ overflow: 'hidden', display: 'flex' }}>
          <div className="marquee-track" id="marqueeTrack">
            {tools.map((t) => (
              <div className="tool-pill" key={t.name}>
                <div className="tool-icon">{t.icon}</div>
                <span className="tool-name">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <section className="section section-alt" id="about" style={{ textAlign: 'center' }}>
        <div className="s-label" style={{ textAlign: 'center' }}>About</div>
        <div className="about-solo">
          <h2 className="s-title">Building systems that<br /><em>just work.</em></h2>
          <p className="about-lead">I&apos;m Sydney Pua Ng — an AI Automation Engineer and BS Computer Science student at the University of the Philippines Manila. I design workflows and intelligent tools that eliminate repetitive tasks and let teams focus on what actually matters.</p>
          <p className="about-lead">I&apos;m passionate about automation and actively looking for clients. If you have a process that needs automating or an idea you want to bring to life, I&apos;d love to help.</p>
          <div className="about-stats">
            <div className="astat"><strong>9+</strong><span>Projects built</span></div>
            <div className="astat"><strong>3</strong><span>Platforms mastered</span></div>
            <div className="astat"><strong>30hrs</strong><span>Saved per client/week</span></div>
            <div className="astat"><strong>24/7</strong><span>Automation uptime</span></div>
          </div>
          <a href="#contact" className="btn-primary">Get in touch →</a>
        </div>
      </section>

      {/* SKILLS */}
      <section className="section" id="skills">
        <div className="s-label">Skills</div>
        <h2 className="s-title">What I do</h2>
        <div className="skills-grid">
          {[
            { icon: '🤖', title: 'AI Integration', desc: 'Connecting LLMs and AI tools into real business workflows.', tags: ['OpenAI', 'Groq', 'LangChain'] },
            { icon: '⚡', title: 'Workflow Automation', desc: 'Eliminating manual tasks with smart, end-to-end pipelines.', tags: ['Make', 'n8n', 'Zapier'] },
            { icon: '🧠', title: 'Chatbot Development', desc: 'AI agents trained on your data for support and lead gen.', tags: ['RAG', 'Embeddings', 'Streaming'] },
            { icon: '🔗', title: 'API & Integrations', desc: 'Connecting your tools so everything talks to each other.', tags: ['REST', 'Webhooks', 'Node.js'] },
            { icon: '📊', title: 'Data Pipelines', desc: 'Collecting, cleaning, and surfacing data where it\'s needed.', tags: ['Supabase', 'PostgreSQL'] },
            { icon: '🚀', title: 'Web Apps', desc: 'Fast, modern frontends and client portals built to ship.', tags: ['Next.js 15', 'React', 'Tailwind'] },
          ].map((s) => (
            <div
              className="skill-card clickable-card"
              key={s.title}
              onClick={() => setModal({ type: 'skill', data: s })}
            >
              <div className="sk-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="skill-tags">{s.tags.map(t => <span className="stag" key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section section-alt" id="projects">
        <div className="s-label">Portfolio</div>
        <h2 className="s-title">Projects</h2>
        <div className="proj-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`ptab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="projects-grid">
          {visibleProjects.map((p) => (
            <div
              className="proj-card clickable-card"
              key={p.title}
              onClick={() => setModal({ type: 'project', data: p })}
            >
              <div className="proj-thumb">
                <div className="proj-ph-icon">{p.icon}</div>
                <div className="proj-ph-label">Screenshot coming soon</div>
              </div>
              <div className="proj-body">
                <div className="proj-tags">{p.tags.map(t => <span className="ptag" key={t}>{t}</span>)}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="proj-metrics">
                  {p.metrics.map(m => (
                    <div className="metric" key={m.label}><strong>{m.val}</strong><span>{m.label}</span></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact">
        <div className="s-label">Contact</div>
        <div className="contact-grid">
          <div>
            <h2 className="contact-tagline">Let&apos;s work<br /><em>together</em></h2>
            <p className="contact-desc">Open to freelance projects, collabs, and new opportunities. Drop a message or book a free 30-min call.</p>
            {[
              { icon: '✉️', label: 'Email', href: 'mailto:sydneykmpn@gmail.com', text: 'sydneykmpn@gmail.com' },
              { icon: '💬', label: 'WhatsApp', href: 'https://wa.me/639177059448', text: '+63 917 705 9448' },
              { icon: '💼', label: 'LinkedIn', href: 'https://www.linkedin.com/in/spuang/', text: 'linkedin.com/in/spuang' },
              { icon: '📍', label: 'Location', href: null, text: 'Manila, Philippines (UTC+8)' },
            ].map((c) => (
              <div className="contact-item" key={c.label}>
                <div className="c-icon">{c.icon}</div>
                <div className="c-info">
                  <small>{c.label}</small>
                  {c.href
                    ? <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{c.text}</a>
                    : <span>{c.text}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="cal-card">
            <div className="cal-header">
              <div className="cal-icon">📅</div>
              <div><h3>Book a Free Call</h3><p>30 minutes — no commitment</p></div>
            </div>
            <div className="cal-body">
              <iframe
                src={calendlyUrl}
                width="100%"
                height="600"
                frameBorder="0"
                title="Book a call with Sydney"
                style={{ display: 'block' }}
              />
            </div>
            <div className="cal-note">
              Need to cancel? Check your Calendly confirmation email for the reschedule link.
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <small>© 2026 Sydney Pua Ng</small>
        <div className="foot-links">
          <a href="mailto:sydneykmpn@gmail.com">Email</a>
          <a href="https://www.linkedin.com/in/spuang/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://wa.me/639177059448" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </footer>

      {/* Card modal */}
      {modal && <CardModal modal={modal} onClose={() => setModal(null)} />}

      {/* Floating chat widget */}
      <ChatWidget />
    </>
  );
}
