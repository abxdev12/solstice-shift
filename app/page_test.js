'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Brain, Sparkles, Swords, Cpu } from 'lucide-react';
import useAppStore from '@/app/store/useAppStore';

const features = [
  { icon: Brain, text: 'Play Against AI' },
  { icon: Sparkles, text: 'AI Move Analysis' },
  { icon: Swords, text: 'Multiple Difficulties' },
  { icon: Cpu, text: 'Gemini Integration' },
];

const PIECES = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

// Standard starting position
const previewPieces = [
  { symbol: PIECES.bR, color: 'b' }, { symbol: PIECES.bN, color: 'b' }, { symbol: PIECES.bB, color: 'b' }, { symbol: PIECES.bQ, color: 'b' }, { symbol: PIECES.bK, color: 'b' }, { symbol: PIECES.bB, color: 'b' }, { symbol: PIECES.bN, color: 'b' }, { symbol: PIECES.bR, color: 'b' },
  { symbol: PIECES.bP, color: 'b' }, { symbol: PIECES.bP, color: 'b' }, { symbol: PIECES.bP, color: 'b' }, { symbol: PIECES.bP, color: 'b' }, { symbol: PIECES.bP, color: 'b' }, { symbol: PIECES.bP, color: 'b' }, { symbol: PIECES.bP, color: 'b' }, { symbol: PIECES.bP, color: 'b' },
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  { symbol: PIECES.wP, color: 'w' }, { symbol: PIECES.wP, color: 'w' }, { symbol: PIECES.wP, color: 'w' }, { symbol: PIECES.wP, color: 'w' }, { symbol: PIECES.wP, color: 'w' }, { symbol: PIECES.wP, color: 'w' }, { symbol: PIECES.wP, color: 'w' }, { symbol: PIECES.wP, color: 'w' },
  { symbol: PIECES.wR, color: 'w' }, { symbol: PIECES.wN, color: 'w' }, { symbol: PIECES.wB, color: 'w' }, { symbol: PIECES.wQ, color: 'w' }, { symbol: PIECES.wK, color: 'w' }, { symbol: PIECES.wB, color: 'w' }, { symbol: PIECES.wN, color: 'w' }, { symbol: PIECES.wR, color: 'w' },
];

export default function HomePage() {
  const apiKey = useAppStore((s) => s.apiKey);
  const target = apiKey ? '/play' : '/api';

  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-hidden lg:flex-row lg:gap-16">
      {/* Left: Hero text */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left max-w-lg"
      >
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-amber-400/90"
        >
          <Sparkles size={10} />
          AI-Powered Chess Experience
        </motion.span>

        <h1 className="text-5xl font-bold uppercase tracking-[0.04em] text-white sm:text-6xl lg:text-7xl">
          Solstice<br />Chess
        </h1>

        <p className="text-base leading-relaxed text-white/50 sm:text-lg">
          Where Strategy Meets Intelligence
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={target}
            className="group inline-flex items-center gap-2 rounded-xl bg-amber-600 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-black shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-500 hover:shadow-xl hover:shadow-amber-500/30 active:scale-[0.97]"
          >
            Start Playing
            <ArrowRight size={16} className="transition-all duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/api"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white/70 shadow-sm transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white active:scale-[0.97]"
          >
            Configure AI
            <ChevronRight size={16} className="transition-all duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 text-[9px] font-bold uppercase tracking-[0.12em] text-white/30"
        >
          {features.map((f) => (
            <span key={f.text} className="flex items-center gap-1.5">
              <f.icon size={11} className="text-amber-500/60" />
              {f.text}
            </span>
          ))}
        </motion.div>
      </motion.div>

            <div className="mt-8 lg:mt-0"><div className="w-[240px] h-[240px] rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#151515] to-[#0a0a0a]"></div></div>
  );
}
