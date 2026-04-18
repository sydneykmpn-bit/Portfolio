'use client';

import { useState, useRef, useCallback, memo } from 'react';

interface Msg { role: 'user' | 'assistant'; content: string }

const QUICK = [
  "What do you do?",
  "How can I work with you?",
  "What are your rates?",
  "How do I cancel my booking?",
];

export default memo(function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: "Hey! 👋 Have a question about Sydney's work or want to know how to get started? Ask me anything." }
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const history = useRef<Msg[]>([]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || busy) return;
    setInput('');
    setBusy(true);
    setShowQuick(false);
    setTyping(true);

    const userMsg: Msg = { role: 'user', content: text };
    history.current.push(userMsg);
    setMsgs(prev => [...prev, userMsg]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      const res = await fetch('/api/chat-widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.current }),
      });
      const data = await res.json();
      const reply = data.reply || 'Something went wrong — email sydneykmpn@gmail.com';
      const aiMsg: Msg = { role: 'assistant', content: reply };
      history.current.push(aiMsg);
      setTyping(false);
      setMsgs(prev => [...prev, aiMsg]);
    } catch {
      setTyping(false);
      setMsgs(prev => [...prev, { role: 'assistant', content: 'Connection issue — email sydneykmpn@gmail.com directly.' }]);
    }

    setBusy(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [busy]);

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <>
      {/* FAB */}
      <button id="fab" onClick={() => setOpen(o => !o)} aria-label="Open chat">
        <div className="fab-ring" />
        💬
      </button>

      {/* Panel */}
      {open && (
        <div id="chatPanel" className="open">
          <div className="cp-head">
            <div className="cp-av">S</div>
            <div className="cp-head-info">
              <h4>Sydney&apos;s AI</h4>
              <small>Online — ask me anything</small>
            </div>
            <button className="cp-x" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="cp-msgs">
            {msgs.map((m, i) => (
              <div key={i} className={`cmsg ${m.role === 'user' ? 'user' : 'ai'}`}>
                {m.content}
              </div>
            ))}
            {typing && (
              <div className="cmsg ai typing">
                <div className="tdot" /><div className="tdot" /><div className="tdot" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {showQuick && (
            <div className="cp-qs">
              {QUICK.map(q => (
                <button key={q} className="cpq" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}

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
