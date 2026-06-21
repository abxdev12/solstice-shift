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

const previewPieces = [
  { s: PIECES.bR, c: 'b' }, { s: PIECES.bN, c: 'b' }, { s: PIECES.bB, c: 'b' }, { s: PIECES.bQ, c: 'b' }, { s: PIECES.bK, c: 'b' }, { s: PIECES.bB, c: 'b' }, { s: PIECES.bN, c: 'b' }, { s: PIECES.bR, c: 'b' },
  { s: PIECES.bP, c: 'b' }, { s: PIECES.bP, c: 'b' }, { s: PIECES.bP, c: 'b' }, { s: PIECES.bP, c: 'b' }, { s: PIECES.bP, c: 'b' }, { s: PIECES.bP, c: 'b' }, { s: PIECES.bP, c: 'b' }, { s: PIECES.bP, c: 'b' },
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  { s: PIECES.wP, c: 'w' }, { s: PIECES.wP, c: 'w' }, { s: PIECES.wP, c: 'w' }, { s: PIECES.wP, c: 'w' }, { s: PIECES.wP, c: 'w' }, { s: PIECES.wP, c: 'w' }, { s: PIECES.wP, c: 'w' }, { s: PIECES.wP, c: 'w' },
  { s: PIECES.wR, c: 'w' }, { s: PIECES.wN, c: 'w' }, { s: PIECES.wB, c: 'w' }, { s: PIECES.wQ, c: 'w' }, { s: PIECES.wK, c: 'w' }, { s: PIECES.wB, c: 'w' }, { s: PIECES.wN, c: 'w' }, { s: PIECES.wR, c: 'w' },
];

export default function HomePage() {
  const apiKey = useAppStore((s) => s.apiKey);
  const target = apiKey ? '/play' : '/api';

  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-hidden lg:flex-row lg:gap-16">
      {/* Left */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left max-w-lg">
        <motion.span initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-amber-400/90">
          <Sparkles size={10} /> AI-Powered Chess Experience
        </motion.span>

        <h1 className="text-5xl font-bold uppercase tracking-[0.04em] text-white sm:text-6xl lg:text-7xl">
          Solstice<br />Chess
        </h1>
        <p className="text-base leading-relaxed text-white/50 sm:text-lg">Where Strategy Meets Intelligence</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={target} className="group inline-flex items-center gap-2 rounded-xl bg-amber-600 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-black shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-500 hover:shadow-xl hover:shadow-amber-500/30 active:scale-[0.97]">
            Start Playing
            <ArrowRight size={16} className="transition-all duration-300 group-hover:translate-x-1" />
          </Link>
          <Link href="/api" className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white/70 shadow-sm transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white active:scale-[0.97]">
            Configure AI
            <ChevronRight size={16} className="transition-all duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-4 text-[9px] font-bold uppercase tracking-[0.12em] text-white/30">
          {features.map((f) => (
            <span key={f.text} className="flex items-center gap-1.5">
              <f.icon size={11} className="text-amber-500/60" />
              {f.text}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Right: Board showcase */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-8 lg:mt-0">
        <div className="relative" style={{ perspective: '800px' }}>
          <motion.div animate={{ x: [0, 6, 0, -6, 0], y: [0, -4, 0, 4, 0], scale: [1, 1.02, 0.98, 1.02, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="pointer-events-none absolute -inset-8 rounded-[48px] bg-black/60 blur-3xl" />
          <motion.div animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="pointer-events-none absolute -inset-4 rounded-[32px] bg-gradient-to-br from-amber-500/30 via-transparent to-transparent blur-2xl" />
          <motion.div animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white/[0.02] to-transparent blur-sm" />

          <motion.div animate={{ rotateY: [0, 2, 0, -2, 0], rotateX: [0, -1, 0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#151515] to-[#0a0a0a] p-3 sm:p-5"
            style={{ boxShadow: '0 30px 60px -15px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <div className="pointer-events-none absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent blur-sm" />
            <div className="relative rounded-lg overflow-hidden shadow-2xl w-[180px] h-[180px] sm:w-[240px] sm:h-[240px]" style={{ boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4)' }}>
              <div className="grid grid-cols-8 w-full h-full">
                {previewPieces.map(function(piece, i) {
                  var row = Math.floor(i / 8);
                  var col = i % 8;
                  var isLight = (row + col) % 2 === 0;
                  var bg = isLight ? 'bg-[#2d2d2d]' : 'bg-[#1a1a1a]';
                  return (
                    <div key={i} className={'flex items-center justify-center overflow-hidden ' + bg} style={{ aspectRatio: '1/1', width: '100%', height: '100%', minWidth: 0, minHeight: 0 }}>
                      {piece ? (
                        <motion.span animate={{ y: [0, -1.5, 0], scale: [1, 1.015, 1] }} transition={{ duration: 2.5 + (i % 5) * 0.3, repeat: Infinity, ease: 'easeInOut', delay: (i * 0.05) % 2 }}
                          className={'text-[clamp(0.6rem,2vw,1.1rem)] leading-none select-none ' + (piece.c === 'w' ? 'text-[#e8e8e8]' : 'text-[#1a1a1a]')}
                          style={{ textShadow: piece.c === 'w' ? '0 0 2px rgba(0,0,0,0.7)' : '0 0 1px rgba(255,255,255,0.15)' }}>
                          {piece.s}
                        </motion.span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent blur-sm" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
