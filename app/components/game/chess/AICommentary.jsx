'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, X } from 'lucide-react';

export default function AICommentary({
  commentary,
  isLoading,
  error,
  onGetCommentary,
  onClear,
  isThinking,
}) {
  const hasContent = commentary || error;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 shadow-sm">
      <button
        onClick={onGetCommentary}
        disabled={isLoading || isThinking}
        className="flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-400 transition-colors hover:text-black disabled:opacity-40"
      >
        <Sparkles size={11} />
        Analyze
      </button>

      <div className="h-4 w-px bg-black/10" />

      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1.5 text-[10px] text-neutral-400"
            >
              <Loader2 size={10} className="animate-spin" />
              Analysing...
            </motion.span>
          ) : error ? (
            <motion.span
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] leading-relaxed text-red-600"
            >
              {error}
            </motion.span>
          ) : commentary ? (
            <motion.span
              key="commentary"
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="block truncate text-[10px] leading-relaxed text-neutral-600"
              title={commentary}
            >
              {commentary}
            </motion.span>
          ) : (
            <motion.span
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] italic text-neutral-300"
            >
              {isThinking
                ? 'AI is calculating...'
                : 'Click Analyze for AI commentary'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {hasContent && (
        <button
          onClick={onClear}
          className="shrink-0 text-neutral-300 transition-colors hover:text-black"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
