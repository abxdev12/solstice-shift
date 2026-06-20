'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Flag, RotateCcw, Star } from 'lucide-react';

// 9x9 maze: 0 = wall, 1 = path, 2 = start, 3 = end
const MAZE = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 1, 1, 1, 0, 1, 1, 0],
  [0, 0, 0, 0, 1, 0, 1, 0, 0],
  [0, 1, 1, 0, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 1, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const START = { row: 1, col: 1 };
const END = { row: 7, col: 6 };

export default function JuneteenthMaze() {
  const [pos, setPos] = useState(START);
  const [steps, setSteps] = useState(0);
  const [won, setWon] = useState(false);

  const canMove = useCallback(
    (row, col) => {
      const cell = MAZE[row]?.[col];
      return cell === 1 || cell === 3;
    },
    [],
  );

  const move = useCallback(
    (dRow, dCol) => {
      if (won) return;
      const newRow = pos.row + dRow;
      const newCol = pos.col + dCol;
      if (canMove(newRow, newCol)) {
        setPos({ row: newRow, col: newCol });
        setSteps((s) => s + 1);
        if (newRow === END.row && newCol === END.col) {
          setWon(true);
        }
      }
    },
    [pos, canMove, won],
  );

  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          move(-1, 0);
          break;
        case 'ArrowDown':
          move(1, 0);
          break;
        case 'ArrowLeft':
          move(0, -1);
          break;
        case 'ArrowRight':
          move(0, 1);
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  const reset = () => {
    setPos(START);
    setSteps(0);
    setWon(false);
  };

  if (won) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-6 py-16"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Star size={64} className="text-yellow-500" />
        </motion.div>
        <h2 className="text-lg font-bold uppercase tracking-widest">
          Freedom Achieved!
        </h2>
        <p className="text-sm text-neutral-500">
          You navigated the maze in {steps} steps.
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-black"
        >
          <RotateCcw size={14} />
          Play Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex items-center gap-4 text-xs uppercase tracking-wider text-neutral-500">
        <span>
          Steps: <strong className="text-black">{steps}</strong>
        </span>
        <span>
          Goal: <Flag size={14} className="inline text-red-500" />
        </span>
      </div>

      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(9, 1fr)` }}>
        {MAZE.map((row, r) =>
          row.map((cell, c) => {
            const isPlayer = pos.row === r && pos.col === c;
            const isEnd = END.row === r && END.col === c;
            const isPath = cell === 1 || cell === 3;

            return (
              <div
                key={`${r}-${c}`}
                className={`flex h-8 w-8 items-center justify-center rounded sm:h-10 sm:w-10 transition-colors ${
                  isPath ? 'bg-neutral-100' : 'bg-neutral-900'
                } ${isPlayer ? 'ring-2 ring-black ring-offset-1' : ''}`}
              >
                {isPlayer && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xs font-bold"
                  >
                    ●
                  </motion.div>
                )}
                {isEnd && !isPlayer && <Star size={14} className="text-yellow-500" />}
              </div>
            );
          }),
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => move(-1, 0)}
          className="rounded border border-black p-2 transition-colors hover:bg-neutral-100"
        >
          <ChevronUp size={16} />
        </button>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => move(0, -1)}
              className="rounded border border-black p-2 transition-colors hover:bg-neutral-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => move(0, 1)}
              className="rounded border border-black p-2 transition-colors hover:bg-neutral-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <button
          onClick={() => move(1, 0)}
          className="rounded border border-black p-2 transition-colors hover:bg-neutral-100"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      <p className="text-[10px] uppercase tracking-wider text-neutral-400">
        Use arrow keys or the controls above
      </p>

      <button
        onClick={reset}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-black"
      >
        <RotateCcw size={14} />
        Reset
      </button>
    </div>
  );
}
