'use client';

import { motion } from 'framer-motion';
import { Brain, Zap, Swords, Crown } from 'lucide-react';

const DIFFICULTIES = [
  {
    key: 'easy',
    label: 'Beginner',
    rating: '1500+',
    icon: Brain,
    color: 'text-emerald-600',
    desc: 'Casual play',
  },
  {
    key: 'medium',
    label: 'Intermediate',
    rating: '2000+',
    icon: Zap,
    color: 'text-blue-600',
    desc: 'Club level',
  },
  {
    key: 'hard',
    label: 'Advanced',
    rating: '2300+',
    icon: Swords,
    color: 'text-violet-600',
    desc: 'Master level',
  },
  {
    key: 'expert',
    label: 'Expert',
    rating: '2800+',
    icon: Crown,
    color: 'text-amber-600',
    desc: 'Grandmaster',
  },
];

export default function DifficultySelector({ value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-[10px] font-bold uppercase tracking-widest text-neutral-500 sm:block">
        Level
      </span>
      <div className="flex gap-1 rounded-xl border border-black/10 bg-white p-1 shadow-sm">
        {DIFFICULTIES.map((d) => {
          const isActive = value === d.key;
          const Icon = d.icon;
          return (
            <motion.button
              key={d.key}
              layout
              disabled={disabled}
              onClick={() => onChange(d.key)}
              className={`relative rounded-lg px-2.5 py-2 text-left transition-colors sm:px-3 sm:py-2 ${
                isActive ? 'text-white' : 'text-neutral-500 hover:text-black'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {isActive && (
                <motion.span
                  layoutId="difficulty-bg"
                  className="absolute inset-0 rounded-lg bg-black"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                <Icon
                  size={12}
                  className={isActive ? 'text-white' : d.color}
                />
                <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                    {d.label}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold leading-none ${
                      isActive ? 'text-white/70' : 'text-neutral-400'
                    }`}
                  >
                    {d.rating}
                  </span>
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
