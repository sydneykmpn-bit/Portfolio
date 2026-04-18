import dynamic from 'next/dynamic';
import Image from 'next/image';
import Script from 'next/script';

const CursorEffect = dynamic(() => import('@/components/CursorEffect'), { ssr: false });
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });
const ScrollReveal = dynamic(() => import('@/components/ScrollReveal'), { ssr: false });

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

export default function Page() {
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
        <a className="logo" href="#">SP.</a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-badge">
          <div className="nav-dot" />
          Open to work
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="avatar-wrap">
          <div className="avatar-ring" />
          <div className="avatar-img">
            <Image
              src="/avatar-frames/frame_0007.webp"
              alt="Sydney"
              width={120}
              height={120}
              priority
              style={{ objectPosition: 'top' }}
            />
          </div>
          <div className="status-dot" />
        </div>

        <div className="hero-tag">Open to work</div>
        <h1 className="hero-name">I&apos;m <em>Sydney</em></h1>
        <p className="hero-role">AI Automation Engineer · Manila, Philippines</p>
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
      <section className="section section-alt" id="about">
        <div className="s-label">About</div>
        <div className="about-grid">
          <div className="about-text">
            <h2 className="s-title">Building systems that<br /><em>just work.</em></h2>
            <br />
            <p>I&apos;m an AI Automation Engineer based in Manila, Philippines. I design workflows and intelligent tools that eliminate repetitive tasks and let teams focus on what actually matters.</p>
            <p>I&apos;m passionate about automation and actively looking for clients. If you have a process that needs automating or an idea you want to bring to life, I&apos;d love to help.</p>
            <br />
            <a href="#contact" className="btn-primary">Get in touch →</a>
          </div>
          <div className="photo-frame">
            <div className="photo-box">
              <Image
                src="/avatar-frames/frame_0007.webp"
                alt="Sydney Puang"
                fill
                style={{ objectFit: 'cover', objectPosition: 'top', borderRadius: '20px' }}
              />
            </div>
            <div className="loc-badge">
              <strong>PH</strong>
              <span>Manila</span>
            </div>
          </div>
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
            <div className="skill-card" key={s.title}>
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
        <div className="projects-grid">
          {[
            {
              icon: '🤖', tags: ['Zapier', 'OpenAI'], title: 'AI Content Automation',
              desc: 'Generates content from source files and auto-publishes across Facebook, LinkedIn, and Instagram — zero manual work.',
              metrics: [{ val: '30hrs', label: 'Saved/week' }, { val: '3×', label: 'Platforms' }],
            },
            {
              icon: '⚡', tags: ['Zapier', 'CRM', 'Asana'], title: 'CRM & Lead Pipeline',
              desc: 'Full lead lifecycle automation with stage-based triggers, email sequences, and real-time Asana task creation.',
              metrics: [{ val: '4×', label: 'Faster follow-up' }, { val: '0', label: 'Missed leads' }],
            },
            {
              icon: '📊', tags: ['n8n', 'Webhooks', 'OpenAI'], title: 'AI Lead Outreach System',
              desc: 'Real-time webhook lead intake with AI scoring, enrichment, and personalised outreach message generation.',
              metrics: [{ val: 'Live', label: 'Processing' }, { val: 'AI', label: 'Personalised' }],
            },
          ].map((p) => (
            <div className="proj-card" key={p.title}>
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
              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/sydneykmpn/30min?hide_gdpr_banner=1&background_color=0e0c1a&text_color=e8e0f5&primary_color=a855f7"
                style={{ minWidth: '280px', height: '600px' }}
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
        <small>© 2026 Sydney Puang</small>
        <div className="foot-links">
          <a href="mailto:sydneykmpn@gmail.com">Email</a>
          <a href="https://www.linkedin.com/in/spuang/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://wa.me/639177059448" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </footer>

      {/* Floating chat widget */}
      <ChatWidget />

      {/* Calendly script */}
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
    </>
  );
}
