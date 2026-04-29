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
    desc: 'Generates content from source files and auto-publishes across Facebook, LinkedIn, and Instagram — zero manual work.',
    metrics: [{ val: '30hrs', label: 'Saved/week' }, { val: '3×', label: 'Platforms' }],
    img: '/ai-content-repurposing.png',
  },
  {
    category: 'Zapier',
    icon: '⚡', tags: ['Zapier', 'CRM', 'Asana'], title: 'CRM & Lead Pipeline',
    desc: 'Full lead lifecycle automation with stage-based triggers, email sequences, and real-time Asana task creation.',
    metrics: [{ val: '4×', label: 'Faster follow-up' }, { val: '0', label: 'Missed leads' }],
    img: '/zapier-expert-for-asana.png',
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
];

const TABS = ['All', 'Zapier', 'Make', 'n8n', 'HighLevel', 'RAG'];

export default function Page() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeTab, setActiveTab] = useState('All');
  const [modal, setModal] = useState<ModalPayload | null>(null);
  const [showVideos, setShowVideos] = useState(false);
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initial = saved ?? 'light';
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

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name    = fd.get('name')    as string;
    const email   = fd.get('email')   as string;
    const message = fd.get('message') as string;
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const a = document.createElement('a');
    a.href = `mailto:sydneykmpn@gmail.com?subject=${subject}&body=${body}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setFormSent(true);
    setTimeout(() => setFormSent(false), 6000);
  };

  const visibleProjects = activeTab === 'All' ? allProjects : allProjects.filter(p => p.category === activeTab);
  const calendlyUrl = 'https://calendly.com/sydneykmpn/30min?hide_gdpr_banner=1&primary_color=a855f7';

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

        <div className="hero-tag">Open to work</div>
        <h1 className="hero-name">
          <span className="hero-word" style={{ animationDelay: '.1s' }}>I&apos;m</span>{' '}
          <em className="hero-word" style={{ animationDelay: '.26s' }}>Sydney</em>
        </h1>
        <p className="hero-role">Software Developer &amp; AI Automation Specialist · Manila, Philippines</p>
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
        <DraggableMarquee tools={tools} />
      </div>

      {/* ABOUT */}
      <section className="section section-alt" id="about" style={{ textAlign: 'center' }}>
        <div className="s-label" style={{ textAlign: 'center' }}>About</div>
        <div className="about-solo">
          <h2 className="s-title">Building systems that<br /><em>just work.</em></h2>
          <p className="about-lead">I&apos;m Sydney Pua Ng — a <strong>Software Developer</strong> and <strong>AI Automation Specialist</strong> with a strong foundation in computer science, systems programming, and AI-driven workflow design. I build intelligent tools that <strong>eliminate repetitive tasks</strong> and let teams focus on <strong>what actually matters.</strong></p>
          <p className="about-lead">I&apos;m <strong>passionate about automation</strong> and <strong>actively looking for clients.</strong> If you have a process that needs automating or an idea you want to bring to life, I&apos;d love to help.</p>
          <div className="about-stats">
            <div className="astat"><strong>10+</strong><span>Projects built</span></div>
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
            {
              icon: '🖥️', title: 'Frontend Development',
              desc: 'Building responsive, performant UIs with modern tooling and clean component architecture.',
              tags: ['React', 'HTML', 'CSS', 'JavaScript'],
            },
            {
              icon: '⚙️', title: 'Backend & Languages',
              desc: 'Systems and application development across the full language stack — from low-level to high-level.',
              tags: ['C++', 'C', 'Python', 'Java', 'C#', 'SQL', 'Django'],
            },
            {
              icon: '🤖', title: 'AI & Automation',
              desc: 'Connecting LLMs, voice AI, and automation platforms into production-grade systems.',
              tags: ['OpenAI', 'VAPI', 'Make.com', 'n8n', 'Zapier'],
            },
            {
              icon: '🧠', title: 'RAG Pipelines',
              desc: 'Vector-powered knowledge retrieval — chunk, embed, retrieve, respond with source-grounded accuracy.',
              tags: ['RAG', 'pgvector', 'LangChain', 'Supabase'],
            },
            {
              icon: '🗄️', title: 'Databases & APIs',
              desc: 'Designing robust data layers and stitching everything together through clean API contracts.',
              tags: ['PostgreSQL', 'Supabase', 'REST', 'Webhooks'],
            },
            {
              icon: '🚀', title: 'Web Apps',
              desc: 'Fast, modern full-stack apps and client portals built to ship — not sit in staging.',
              tags: ['Next.js', 'React', 'Tailwind', 'Vercel'],
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
        <h2 className="s-title">Projects</h2>
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
        <h2 className="s-title">Let&apos;s work <em>together</em></h2>
        <p className="connect-sub">Available for freelance projects, long-term contracts, and strategic collabs. Pick what works for you.</p>

        <div className="connect-grid">

          {/* LEFT — Calendly */}
          <div className="cal-card">
            <div className="cal-header">
              <div className="cal-icon">📅</div>
              <div>
                <h3>Book a Free Strategy Call</h3>
                <p>30 minutes — no commitment</p>
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

          {/* RIGHT — Form + Resume + Buttons */}
          <div className="connect-right">

            {/* Send a Message */}
            <div className="form-card">
              <h3 className="form-card-title">Send a Message</h3>
              {formSent ? (
                <div className="form-success">
                  Your mail client should have opened. If not, email directly: <a href="mailto:sydneykmpn@gmail.com" style={{ color: '#22c55e' }}>sydneykmpn@gmail.com</a>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleContactSubmit}>
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
                  <button type="submit" className="btn-primary form-submit">Send Message →</button>
                </form>
              )}
            </div>

            {/* Resume card */}
            <div className="resume-card">
              <div className="resume-icon">📄</div>
              <div className="resume-info">
                <strong>Resume</strong>
                <span>Software Developer &amp; AI Automation Specialist</span>
              </div>
              <a href="/resume.pdf" download="PuaNg_Resume" className="btn-download">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                Download PDF
              </a>
            </div>

            {/* Direct contact */}
            <div className="contact-ctas">
              <a href="mailto:sydneykmpn@gmail.com" className="btn-contact btn-gmail">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Gmail
              </a>
              <a href="https://wa.me/639177059448" target="_blank" rel="noreferrer" className="btn-contact btn-whatsapp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
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
        <div className="foot-links">
          <a href="mailto:sydneykmpn@gmail.com">Email</a>
          <a href="https://wa.me/639177059448" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </footer>

      {modal      && <CardModal modal={modal} onClose={() => setModal(null)} />}
      {showVideos && <VideoModal onClose={() => setShowVideos(false)} />}
      <ChatWidget />
    </>
  );
}
