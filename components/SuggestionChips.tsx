'use client';

import { motion } from 'framer-motion';

const chips = [
  'Show me your best projects',
  'What tools do you use?',
  'How can we work together?',
  'Tell me a fun fact about you',
];

interface Props {
  onSelect: (text: string) => void;
}

export default function SuggestionChips({ onSelect }: Props) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-2 px-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
      }}
    >
      {chips.map((chip) => (
        <motion.button
          key={chip}
          variants={{
            hidden: { opacity: 0, y: 10, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1 },
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="chip"
          onClick={() => onSelect(chip)}
        >
          {chip}
        </motion.button>
      ))}
    </motion.div>
  );
}
