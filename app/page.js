'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import useAppStore from '@/app/store/useAppStore';

export default function HomePage() {
  const apiKey = useAppStore((s) => s.apiKey);
  const target = apiKey ? '/play' : '/api';
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center gap-8 text-center sm:gap-10"
      >
        {/* Knight icon — large, artistic, symbolic */}
        <motion.span
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.1 }}
          className="relative inline-block text-7xl sm:text-8xl md:text-9xl"
        >
          <span className="relative z-10">♞</span>
          <span className="pointer-events-none absolute inset-0 z-0 animate-pulse text-neutral-200 blur-sm">
            ♞
          </span>
        </motion.span>

        {/* Title */}
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl font-bold uppercase tracking-[0.18em] sm:text-6xl md:text-7xl"
          >
            Solstice
            <br />
            Chess
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mx-auto max-w-md text-xs uppercase tracking-[0.2em] text-neutral-500 sm:text-sm"
          >
            Where strategy meets intelligence.
          </motion.p>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Link
            href={target}
            className="group inline-flex items-center gap-3 rounded-xl bg-black px-10 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-lg transition-all hover:bg-neutral-900 hover:shadow-xl active:scale-[0.97]"
          >
            Start Session
            <ArrowRight
              size={16}
              className="transition-all duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* Bottom feature tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="flex gap-6 text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400"
        >
          <span>AI Opponent</span>
          <span className="text-neutral-300">·</span>
          <span>Move Analysis</span>
          <span className="text-neutral-300">·</span>
          <span>2800+ ELO</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
