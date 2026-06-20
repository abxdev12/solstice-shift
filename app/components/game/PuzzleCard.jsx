'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const GRADIENT_MAP = {
  '🌈':
    'from-rose-500/10 via-amber-400/10 via-green-400/10 via-blue-400/10 to-purple-500/10',
  '✊🏾':
    'from-red-900/10 via-yellow-700/5 to-green-900/10',
  '🔐':
    'from-slate-700/10 via-zinc-500/5 to-slate-800/10',
  '🍣':
    'from-orange-400/10 via-red-400/5 to-amber-500/10',
};

export default function PuzzleCard({
  icon,
  title,
  description,
  onClick,
  className = '',
}) {
  const gradient = GRADIENT_MAP[icon] ?? 'from-neutral-100/50';

  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border border-black/10 bg-white p-6 text-left shadow-sm transition-all hover:border-black/30 hover:shadow-md ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="relative z-10 flex flex-col items-start gap-3">
        <span className="text-3xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
        <h3 className="text-sm font-bold uppercase tracking-[0.12em]">
          {title}
        </h3>
        <p className="text-xs leading-relaxed text-neutral-500">
          {description}
        </p>
        <span className="mt-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 transition-all group-hover:gap-2.5 group-hover:text-black">
          Play
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.button>
  );
}
