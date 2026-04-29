'use client';

import { useState, useRef, useCallback, memo } from 'react';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
  action?: { type: 'scroll_to'; target: string; label: string };
}

const QUICK = [
  "What do you do?",
  "How can I work with you?",
  "Show me your projects",
  "How much are your rates?",
];

// Intent patterns — checked client-side to inject scroll actions without
// waiting for the AI to mention specific URLs or section names.
const WORK_INTENT    = /work.?(with|together)|hire|collaborat|get.?started|get.?in.?touch|your services|how can i contact/i;
const PROJECTS_INTENT = /show.?me|your projects|portfolio|what.*(built|made|created|done)|your work|see.*projects/i;

function clean(raw: string) {
  return raw.replace(/[ \t]+/g, ' ').trim();
}

const SPLIT_RE = /(https?:\/\/[^\s]+|[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g;
const IS_URL   = /^https?:\/\//;
const IS_EMAIL = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function renderLine(line: string, lineKey: number) {
  const parts = line.split(SPLIT_RE);
  return (
    <span key={lineKey}>
      {parts.map((part, i) => {
        if (IS_URL.test(part))
          return <a key={i} href={part} target="_blank" rel="noreferrer" style={{ color: 'var(--p1)', textDecoration: 'underline', wordBreak: 'break-all' }}>{part}</a>;
        if (IS_EMAIL.test(part))
          return <a key={i} href={`mailto:${part}`} style={{ color: 'var(--p1)', textDecoration: 'underline' }}>{part}</a>;
        return part;
      })}
    </span>
  );
}

function MsgContent({ text }: { text: string }) {
  const raw = clean(text);
  const paragraphs = raw.split(/\n+/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length <= 1) return renderLine(raw, 0);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} style={{ margin: i < paragraphs.length - 1 ? '0 0 0.52rem' : '0' }}>
          {renderLine(p, i)}
        </p>
      ))}
    </>
  );
}

export default memo(function ChatWidget() {
  const [open, setOpen]       = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  const [msgs, setMsgs]   = useState<Msg[]>([
    { role: 'assistant', content: "Hey! Have a question about Sydney's work or want to get started? Ask me anything." }
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy]   = useState(false);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const history   = useRef<Msg[]>([]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || busy) return;
    setInput('');
    setBusy(true);
    setTyping(true);

    const userMsg: Msg = { role: 'user', content: text };
    history.current.push(userMsg);
    setMsgs(prev => [...prev, userMsg]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    const isWorkIntent    = WORK_INTENT.test(text);
    const isProjectsIntent = PROJECTS_INTENT.test(text);

    try {
      const res = await fetch('/api/chat-widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.current }),
      });
      const data = await res.json();
      const reply = data.reply || 'Something went wrong — please try again later.';

      const aiMsg: Msg = {
        role: 'assistant',
        content: reply,
        // Inject "Connect with me" button for work-together intents
        ...(isWorkIntent ? { action: { type: 'scroll_to' as const, target: 'contact', label: 'Connect with me' } } : {}),
      };
      history.current.push(aiMsg);
      setTyping(false);
      setMsgs(prev => [...prev, aiMsg]);

      // Auto-scroll to projects section for project-browsing intents
      if (isProjectsIntent) {
        setTimeout(() => {
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    } catch {
      setTyping(false);
      setMsgs(prev => [...prev, { role: 'assistant', content: 'Connection issue — please try again later.' }]);
    }

    setBusy(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [busy]);

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <>
      <button id="fab" onClick={() => setOpen(o => !o)} aria-label="Open chat">
        <div className="fab-ring" />
        💬
      </button>

      {open && (
        <div id="chatPanel" className={`open${enlarged ? ' enlarged' : ''}`}>
          <div className="cp-head">
            <div className="cp-av">S</div>
            <div className="cp-head-info">
              <h4>Sydney&apos;s AI</h4>
              <small>Online — ask me anything</small>
            </div>
            <div className="cp-head-actions">
              <button className="cp-expand" onClick={() => setEnlarged(e => !e)} aria-label={enlarged ? 'Minimize chat' : 'Expand chat'}>
                {enlarged ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3M21 3h-3a2 2 0 0 1-2 2v3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                )}
              </button>
              <button className="cp-x" onClick={() => { setOpen(false); setEnlarged(false); }}>✕</button>
            </div>
          </div>

          <div className="cp-msgs">
            {msgs.map((m, i) => (
              <div key={i} className={`cmsg ${m.role === 'user' ? 'user' : 'ai'}`}>
                <MsgContent text={m.content} />
                {m.action?.type === 'scroll_to' && (
                  <button
                    className="cmsg-action-btn"
                    onClick={() => document.getElementById(m.action!.target)?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {m.action.label} →
                  </button>
                )}
              </div>
            ))}
            {typing && (
              <div className="cmsg ai typing">
                <div className="tdot" /><div className="tdot" /><div className="tdot" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="cp-qs">
            {QUICK.map(q => (
              <button key={q} className="cpq" onClick={() => send(q)} disabled={busy}>{q}</button>
            ))}
          </div>

          <div className="cp-input-row">
            <textarea
              className="cp-inp"
              rows={1}
              placeholder="Ask a question…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              disabled={busy}
            />
            <button className="cp-send" onClick={() => send(input)} disabled={busy || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
});
