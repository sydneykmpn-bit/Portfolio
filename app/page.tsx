'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const CursorEffect     = dynamic(() => import('@/components/CursorEffect'),     { ssr: false });
const ChatWidget       = dynamic(() => import('@/components/ChatWidget'),        { ssr: false });
const ScrollReveal     = dynamic(() => import('@/components/ScrollReveal'),      { ssr: false });
const CardModal        = dynamic(() => import('@/components/CardModal'),         { ssr: false });
const DraggableMarquee = dynamic(() => import('@/components/DraggableMarquee'), { ssr: false });
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
  {
    category: 'Zapier',
    icon: '🤖', tags: ['Zapier', 'OpenAI'], title: 'AI Content Automation',
    desc: 'Client was manually writing and scheduling posts daily. Now source files flow into AI, get formatted as platform-specific content, and publish to Facebook and Instagram automatically — zero human touch.',
    metrics: [{ val: '30hrs', label: 'Saved/week' }, { val: '3×', label: 'Output volume' }],
    img: '/ai-content-repurposing.png',
  },
  {
    category: 'Zapier',
    icon: '⚡', tags: ['Zapier', 'CRM', 'Asana'], title: 'CRM & Lead Pipeline',
    desc: 'Sales team was manually moving leads through stages, writing follow-up emails, and creating tasks by hand. Built a pipeline where every CRM stage change triggers the right email sequence and creates Asana tasks in real time — no one falls through the cracks.',
    metrics: [{ val: '4×', label: 'Faster follow-up' }, { val: '0', label: 'Missed leads' }],
    img: '/zapier-expert-for-asana.png',
  },
  {
    category: 'Zapier',
    icon: '🎯', tags: ['Zapier', 'CRM', 'Gmail', 'Webhooks'], title: 'Leads Enrichment & Routing Pipeline',
    desc: 'High-value leads were getting the same generic response as low-intent inquiries. Built a webhook pipeline that scores each submission, routes hot leads to a priority Sheet, and fires a personalised Gmail follow-up — under 60 seconds from form submission.',
    metrics: [{ val: '<60s', label: 'Response time' }, { val: '100%', label: 'Auto-routed' }],
    img: '/leads-enrichment.png',
  },
  /* TODO: add thumbnail before uncommenting
  {
    category: 'Make',
    icon: '📈', tags: ['Make', 'Xero', 'Asana'], title: 'Financial Data Automation',
    desc: 'Automated financial reporting pipeline — Xero extraction, CSV transformation, and Asana task injection.',
    metrics: [{ val: '15hrs', label: 'Saved/week' }, { val: '100%', label: 'Accuracy' }],
  },
  */
  {
    category: 'Make',
    icon: '🗂️', tags: ['Make', 'Google Drive', 'AI Analysis', 'Gmail'], title: 'Smart Drive Auto-Sorter',
    desc: 'Team was spending hours a week downloading, renaming, and filing email attachments by hand. Now every incoming attachment is caught, renamed by AI based on content, sorted into the correct Drive folder, logged to a spreadsheet, and confirmed — automatically.',
    metrics: [{ val: '0', label: 'Manual sorting' }, { val: 'AI', label: 'File naming' }],
    img: '/Auto_Sort_Gmail_Attachments_on_Drive.png',
  },
  /* TODO: add thumbnail before uncommenting
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
    category: 'RAG',
    icon: '🧠', tags: ['RAG', 'Supabase', 'OpenAI'], title: 'RAG Knowledge Base Agent',
    desc: 'Semantic search system — documents chunked, embedded into Supabase pgvector, and retrieved via OpenAI for accurate, source-grounded answers.',
    metrics: [{ val: '<1s', label: 'Response time' }, { val: '95%+', label: 'Accuracy' }],
  },
  {
    category: 'RAG',
    icon: '🔍', tags: ['n8n', 'RAG', 'LangChain'], title: 'Multi-Source Research Agent',
    desc: 'Autonomous AI agent combining web search, RAG retrieval, and LangChain reasoning to produce structured research reports on demand.',
    metrics: [{ val: '100%', label: 'Automated' }, { val: 'Multi-source', label: 'Retrieval' }],
  },
  */
];

const TABS = ['All', 'Zapier', 'Make', 'n8n', 'RAG'];

export default function Page() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeTab, setActiveTab] = useState('All');
  const [modal, setModal] = useState<ModalPayload | null>(null);
  const [showVideos, setShowVideos] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState(false);

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

  const visibleProjects = activeTab === 'All' ? allProjects : allProjects.filter(p => p.category === activeTab);
  const calendlyUrl = 'https://calendly.com/sydneykmpn/30min?hide_gdpr_banner=1&primary_color=3b82f6';

  return (
    <>
      <CursorEffect />
      <ScrollReveal />
      <div className="bg-canvas" />

      {/* NAV */}
      <nav>
        <a className="logo" href="#"><span className="logo-mark">SKMPN</span></a>
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
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="avatar-wrap">
          <div className="avatar-ring" />
          <div className="avatar-img">
            <Image src="/2x2.png" alt="Sydney" width={200} height={200} priority style={{ objectPosition: 'center 10%' }} />
          </div>
          <div className="status-dot" />
        </div>

        <div className="hero-tag">Available for new projects</div>
        <h1 className="hero-name">
          <span className="hero-word" style={{ animationDelay: '.1s' }}>I&apos;m</span>{' '}
          <em className="hero-word" style={{ animationDelay: '.26s' }}>Sydney</em>
        </h1>
        <p className="hero-role">AI Automation Engineer · Software Developer · Manila, PH</p>
        <p className="hero-desc">I build automation systems that eliminate manual work — so your team moves faster, responds in seconds, and scales without adding headcount.</p>

        <div className="hero-ctas">
          <a href="#contact" className="btn-primary">Book a free call →</a>
          <a href="#projects" className="btn-outline">See case studies</a>
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
        <p className="marquee-label">Stack &amp; Integrations</p>
        <DraggableMarquee tools={tools} />
      </div>

      {/* ABOUT */}
      <section className="section section-alt" id="about" style={{ textAlign: 'center' }}>
        <div className="s-label" style={{ textAlign: 'center' }}>About</div>
        <div className="about-solo">
          <h2 className="s-title">Your team shouldn&apos;t be<br /><em>doing this manually.</em></h2>
          <p className="about-lead">I&apos;m Sydney Pua Ng — an <strong>AI Automation Engineer</strong> and <strong>Software Developer</strong> based in Manila. I specialise in building production-grade systems that connect your tools, kill the bottlenecks, and give your team back hours every single week.</p>
          <p className="about-lead">Whether it&apos;s slow lead follow-up, repetitive data entry, or a workflow held together with copy-paste — I design the automation that <strong>fixes it permanently.</strong> I&apos;m actively taking on clients.</p>
          <div className="about-stats">
            <div className="astat"><strong>10+</strong><span>Systems shipped</span></div>
            <div className="astat"><strong>30hrs+</strong><span>Saved per client/week</span></div>
            <div className="astat"><strong>4</strong><span>Automation platforms</span></div>
            <div className="astat"><strong>24/7</strong><span>Runs without you</span></div>
          </div>
          <a href="#contact" className="btn-primary">Start the conversation →</a>
        </div>
      </section>

      {/* SKILLS */}
      <section className="section" id="skills">
        <div className="s-label">Skills</div>
        <h2 className="s-title">How I solve it</h2>
        <div className="skills-grid">
          {[
            {
              icon: '🤖', title: 'Workflow Automation',
              desc: 'End-to-end automation across Zapier, Make, and n8n — connecting your apps, eliminating bottlenecks, and running 24/7 without manual intervention.',
              tags: ['Zapier', 'Make.com', 'n8n', 'Webhooks'],
            },
            {
              icon: '🧠', title: 'AI Knowledge Systems',
              desc: 'RAG pipelines that let your team query internal documents, client data, and knowledge bases in plain language — with source-grounded answers.',
              tags: ['RAG', 'OpenAI', 'pgvector', 'LangChain', 'Supabase'],
            },
            {
              icon: '🗄️', title: 'Integrations & APIs',
              desc: 'REST APIs, webhooks, and database connectors that make every tool in your stack talk to each other — no more copy-pasting between systems.',
              tags: ['PostgreSQL', 'Supabase', 'REST', 'Webhooks', 'Airtable'],
            },
            {
              icon: '🖥️', title: 'Client Portals & UIs',
              desc: 'Custom dashboards and admin interfaces built with React — clean, fast, and designed to surface exactly what your team needs.',
              tags: ['React', 'Next.js', 'Tailwind', 'Vercel'],
            },
            {
              icon: '⚙️', title: 'Backend & Scripting',
              desc: 'Automation glue code, data transformation scripts, and custom APIs that handle the logic your no-code tools cannot.',
              tags: ['Python', 'Django', 'SQL', 'C++', 'Java'],
            },
            {
              icon: '📞', title: 'AI Voice Agents',
              desc: 'Voice AI workflows with VAPI that handle inbound calls, qualify leads, and book appointments — without a human on the line.',
              tags: ['VAPI', 'OpenAI', 'n8n', 'Webhooks'],
            },
          ].map((s) => (
            <div className="skill-card clickable-card" key={s.title} onClick={() => setModal({ type: 'skill', data: s })}>
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
        <div className="proj-section-header">
          <div className="s-label">Portfolio</div>
          <button className="btn-demo" onClick={() => setShowVideos(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Watch Video Demos
          </button>
        </div>
        <h2 className="s-title">Case Studies</h2>
        <div className="proj-tabs">
          {TABS.map(tab => (
            <button key={tab} className={`ptab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
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

      {/* CONNECT */}
      <section className="section" id="contact">
        <div className="s-label">Connect</div>
        <h2 className="s-title">Let&apos;s build something that<br /><em>pays for itself.</em></h2>
        <p className="connect-sub">Most clients recover the cost within the first week. If your team repeats a task more than twice a day — I can automate it. Book a free 30-minute call and I&apos;ll audit one of your workflows on the spot.</p>

        <div className="connect-grid">

          {/* LEFT — Calendly */}
          <div className="cal-card">
            <div className="cal-header">
              <div className="cal-icon">📅</div>
              <div>
                <h3>Book a Free Strategy Call</h3>
                <p>30 min · I&apos;ll audit one of your workflows live</p>
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

      {modal      && <CardModal modal={modal} onClose={() => setModal(null)} />}
      {showVideos && <VideoModal onClose={() => setShowVideos(false)} />}
      <ChatWidget />
    </>
  );
}
