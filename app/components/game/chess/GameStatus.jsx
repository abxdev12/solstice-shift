'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Crown } from 'lucide-react';

export default function GameStatus({
  turn,
  isCheck,
  isCheckmate,
  isDraw,
  isStalemate,
  winner,
  isAIThinking,
  onReset,
  moveCount,
}) {
  const gameOver = isCheckmate || isDraw || isStalemate;
  const inCheck = isCheck && !gameOver;

  let statusText = '';
  let statusColor = 'text-neutral-500';

  if (isCheckmate) {
    statusText = `Checkmate! ${winner === 'w' ? 'White' : 'Black'} wins`;
    statusColor = 'text-green-700';
  } else if (isDraw) {
    statusText = 'Draw';
    statusColor = 'text-amber-700';
  } else if (isStalemate) {
    statusText = 'Stalemate — Draw';
    statusColor = 'text-amber-700';
  } else if (inCheck) {
    statusText = `${turn === 'w' ? 'White' : 'Black'} is in check`;
    statusColor = 'text-red-600';
  } else if (isAIThinking) {
    statusText = 'AI is thinking...';
  } else {
    statusText = `${turn === 'w' ? 'White' : 'Black'}'s turn`;
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.span
            key={statusText}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className={`text-xs font-bold uppercase tracking-widest ${statusColor}`}
          >
            {statusText}
          </motion.span>
        </AnimatePresence>

        {inCheck && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-red-500"
          >
            <Crown size={14} />
          </motion.span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          Move {moveCount}
        </span>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-black"
        >
          <RotateCcw size={12} />
          New Game
        </button>
      </div>
    </div>
  );
}
