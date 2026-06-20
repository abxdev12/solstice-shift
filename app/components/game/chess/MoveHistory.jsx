'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function MoveHistory({ history }) {
  const pairs = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      number: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1] ?? null,
    });
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-black/10 bg-white shadow-sm">
      {/* Column headers */}
      <div className="grid grid-cols-[2rem_1fr_1fr] gap-0.5 border-b border-black/10 px-3 py-2.5">
        <span />
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-500">
          User
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-500">
          Gemini
        </span>
      </div>

      {/* Moves */}
      <div className="flex-1 overflow-hidden">
        {pairs.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-[9px] uppercase tracking-[0.12em] text-neutral-400">
              No moves yet
            </p>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <AnimatePresence initial={false}>
              {pairs.map((pair) => (
                <motion.div
                  key={pair.number}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-[2rem_1fr_1fr] gap-0.5 px-3 py-1 text-[11px] hover:bg-neutral-50"
                >
                  <span className="text-[9px] font-bold text-neutral-400">
                    {pair.number}.
                  </span>
                  <span className="font-medium tracking-wide text-black">
                    {pair.white}
                  </span>
                  <span
                    className={`font-medium tracking-wide ${
                      pair.black ? 'text-black' : 'text-neutral-300'
                    }`}
                  >
                    {pair.black ?? '...'}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
