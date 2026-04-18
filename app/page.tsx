'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MapPin, Mail, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import Avatar from '@/components/Avatar';
import ChatMessages from '@/components/ChatMessages';
import SuggestionChips from '@/components/SuggestionChips';
import ThemeToggle from '@/components/ThemeToggle';

const MouseEffect = dynamic(() => import('@/components/MouseEffect'), { ssr: false });

type AvatarState = 'idle' | 'thinking' | 'talking';

export default function Page() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const talkingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages, error } =
    useChat({
      api: '/api/chat',
      onError: (err) => console.error('[chat error]', err),
    });

  const hasMessages = messages.length > 0;

  const handleReset = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  // Sync avatar state
  useEffect(() => {
    if (talkingTimer.current) clearTimeout(talkingTimer.current);
    if (isLoading) {
      const lastMsg = messages[messages.length - 1];
      setAvatarState(!lastMsg || lastMsg.role === 'user' ? 'thinking' : 'talking');
    } else {
      talkingTimer.current = setTimeout(() => setAvatarState('idle'), 1200);
    }
    return () => { if (talkingTimer.current) clearTimeout(talkingTimer.current); };
  }, [isLoading, messages]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleChipSelect = useCallback(
    (text: string) => { append({ role: 'user', content: text }); },
    [append]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmit(e);
  };

  return (
    <div
      className="relative flex flex-col min-h-[100dvh] overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      <MouseEffect />

      {/* ── Header ── */}
      <header
        className="relative z-20 flex items-center justify-between px-5 py-4"
        style={{ borderBottom: hasMessages ? '1px solid var(--border)' : 'none' }}
      >
        <AnimatePresence mode="wait">
          {hasMessages ? (
            <motion.div
              key="chat-header"
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            >
              {/* Back button */}
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-8 h-8 rounded-full flex items-center justify-center mr-1"
                style={{
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-2)',
                }}
                aria-label="Back to home"
              >
                <ArrowLeft size={14} strokeWidth={2} />
              </motion.button>

              <Avatar state={avatarState} size="sm" />
              <div>
                <p className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
                  Sydney
                </p>
                <p className="text-[10px]" style={{ color: 'var(--accent)' }}>
                  AI Automation Specialist
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" className="w-8" />
          )}
        </AnimatePresence>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {!hasMessages ? (
          /* ── Landing view ── */
          <motion.div
            className="flex-1 flex flex-col items-center justify-center gap-6 px-5 pb-6 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 22 }}
            >
              <Avatar state="idle" size="lg" />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <h1 className="heading-display">
                Hey, I&apos;m Sydney{' '}
                <span role="img" aria-label="wave">👋</span>
              </h1>
              <p className="text-base font-medium" style={{ color: 'var(--accent)' }}>
                AI Automation Specialist
              </p>
              <div
                className="flex items-center justify-center gap-3 text-xs mt-1"
                style={{ color: 'var(--text-3)' }}
              >
                <span className="flex items-center gap-1">
                  <MapPin size={11} strokeWidth={1.5} /> Manila, PH
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={11} strokeWidth={1.5} /> sydneykmpn@gmail.com
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SuggestionChips onSelect={handleChipSelect} />
            </motion.div>

            <motion.form
              onSubmit={onSubmit}
              className="w-full max-w-xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ChatInputField
                input={input}
                isLoading={isLoading}
                onChange={handleInputChange}
                inputRef={inputRef}
                placeholder="Ask me about my projects, skills, or how I can automate your business…"
              />
            </motion.form>
          </motion.div>
        ) : (
          /* ── Chat view ── */
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="max-w-2xl mx-auto">
                <ChatMessages messages={messages} isLoading={isLoading} />

                {/* API error banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 px-4 py-3 rounded-xl text-xs"
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: '#ef4444',
                    }}
                  >
                    <strong>Error:</strong> {error.message || String(error)}
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            <div
              className="relative z-20 px-4 py-3"
              style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}
            >
              <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
                <ChatInputField
                  input={input}
                  isLoading={isLoading}
                  onChange={handleInputChange}
                  inputRef={inputRef}
                  placeholder="Ask me anything…"
                />
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

interface FieldProps {
  input: string;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  placeholder: string;
}

function ChatInputField({ input, isLoading, onChange, inputRef, placeholder }: FieldProps) {
  return (
    <div
      className="flex items-center gap-2 rounded-2xl px-3 py-2"
      style={{
        background: 'var(--bg-2)',
        border: '1.5px solid var(--border)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
      }}
    >
      <input
        ref={inputRef}
        value={input}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className="flex-1 bg-transparent text-sm outline-none min-w-0 py-1"
        style={{ color: 'var(--text)' }}
        disabled={isLoading}
      />
      <motion.button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="send-btn"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
      >
        <Send size={14} strokeWidth={2} />
      </motion.button>
    </div>
  );
}
