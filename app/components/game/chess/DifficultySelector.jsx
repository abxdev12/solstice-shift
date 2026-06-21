'use client';

import { motion } from 'framer-motion';

const LEVELS = [
  { key: 'easy', label: 'Beginner', elo: '1500' },
  { key: 'medium', label: 'Interm.', elo: '2000' },
  { key: 'hard', label: 'Advanced', elo: '2300' },
  { key: 'expert', label: 'Expert', elo: '2800+' },
];

export default function DifficultySelector({ value, onChange, disabled }) {
  return (
    <div className="flex w-full flex-col gap-1 rounded-xl border border-white/[0.06] bg-[#111] p-1">
      {LEVELS.map((d) => {
        const active = value === d.key;
        return (
          <motion.button
            key={d.key}
            layout
            onClick={() => onChange(d.key)}
            disabled={disabled}
            className={`relative w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
              disabled ? 'cursor-not-allowed opacity-30' : ''
            }`}
          >
            {active && (
              <motion.span
                layoutId="diff-pill"
                className="absolute inset-0 rounded-lg bg-amber-600 shadow-lg shadow-amber-600/20"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-between gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px] ${active ? 'text-black' : 'text-white/60'}`}>
                {d.label}
              </span>
              <span className={`text-[8px] font-semibold ${active ? 'text-black/60' : 'text-white/30'}`}>
                {d.elo}
              </span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
