'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCards from './ProjectCards';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  messages: Message[];
  isLoading: boolean;
}

const UserBubble = memo(function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <motion.div
        initial={{ opacity: 0, x: 12, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="bubble-user px-3.5 py-2.5 max-w-[80%]"
      >
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          {content}
        </p>
      </motion.div>
    </div>
  );
});

const AssistantBubble = memo(function AssistantBubble({ content }: { content: string }) {
  const hasProjects = content.includes('SHOW_PROJECTS');
  const displayText = content.replace('SHOW_PROJECTS', '').trim();

  return (
    <div className="flex justify-start">
      <div className="max-w-[88%] space-y-3">
        {displayText && (
          <motion.div
            initial={{ opacity: 0, x: -12, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="bubble-ai px-3.5 py-2.5"
          >
            <div className="prose-chat text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayText}</ReactMarkdown>
            </div>
          </motion.div>
        )}

        {hasProjects && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 24 }}
          >
            <ProjectCards />
          </motion.div>
        )}
      </div>
    </div>
  );
});

const ThinkingIndicator = memo(function ThinkingIndicator() {
  return (
    <div className="flex justify-start">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={{ duration: 0.2 }}
        className="bubble-ai px-4 py-3 flex items-center gap-1.5"
      >
        <span className="dot-1 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
        <span className="dot-2 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
        <span className="dot-3 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
      </motion.div>
    </div>
  );
});

export default function ChatMessages({ messages, isLoading }: Props) {
  return (
    <div className="flex flex-col gap-3 py-2">
      <AnimatePresence initial={false}>
        {messages.map((m) =>
          m.role === 'user' ? (
            <UserBubble key={m.id} content={m.content} />
          ) : (
            <AssistantBubble key={m.id} content={m.content} />
          )
        )}
        {isLoading && <ThinkingIndicator key="thinking" />}
      </AnimatePresence>
    </div>
  );
}
