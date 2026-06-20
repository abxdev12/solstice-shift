'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Chess } from 'chess.js';
import { motion } from 'framer-motion';
import { RotateCcw, FlipHorizontal } from 'lucide-react';
import useAppStore from '@/app/store/useAppStore';
import { getEngineMove } from './chessEngine';
import ChessBoard from './ChessBoard';
import { getSquareKey, squareToAlgebraic } from './chessUtils';

const DIFF_LABELS = [
  { key: 'easy', label: 'Beginner', name: '1500' },
  { key: 'medium', label: 'Interm.', name: '2000' },
  { key: 'hard', label: 'Advanced', name: '2300' },
  { key: 'expert', label: 'Expert', name: '2800+' },
];

export default function ChessGame() {
  const apiKey = useAppStore((s) => s.apiKey);
  const savedFen = useAppStore((s) => s.savedFen);
  const savedLastMove = useAppStore((s) => s.savedLastMove);
  const saveGame = useAppStore((s) => s.saveGame);
  const clearSavedGame = useAppStore((s) => s.clearSavedGame);

  // Restore saved game on mount, or start fresh
  const [game, setGame] = useState(() => {
    if (savedFen) {
      try { return new Chess(savedFen); } catch {}
    }
    return new Chess();
  });
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [lastMove, setLastMove] = useState(savedLastMove || null);
  const [difficulty, setDifficulty] = useState('medium');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const aiRunning = useRef(false);
  const mounted = useRef(false);

  // Persist game state to store whenever it changes (skip initial restore)
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (!game.isGameOver()) saveGame(game.fen(), lastMove);
  }, [game, lastMove, saveGame]);

  const board = game.board();
  const turn = game.turn();
  const history = game.history();
  const fen = game.fen();
  const isCheck = game.isCheck();
  const isCheckmate = game.isCheckmate();
  const isDraw = game.isDraw();
  const isStalemate = game.isStalemate();
  const gameOver = isCheckmate || isDraw || isStalemate;

  const makeAIMove = useCallback(() => {
    if (gameOver || aiRunning.current) return;
    if (game.turn() !== 'b') return;
    aiRunning.current = true; setIsAIThinking(true);
    setTimeout(() => {
      try {
        const san = getEngineMove(game, difficulty);
        if (san) {
          const g = new Chess(game.fen()), result = g.move(san);
          setGame(g); setLastMove({ from: result.from, to: result.to });
          setSelectedSquare(null); setLegalMoves([]);
        }
      } catch (e) { console.error(e); }
      finally { setIsAIThinking(false); aiRunning.current = false; }
    }, 50);
  }, [game, difficulty, gameOver]);

  useEffect(() => {
    if (!gameOver && turn === 'b' && !isAIThinking && history.length > 0) {
      const timer = setTimeout(() => makeAIMove(), 300);
      return () => clearTimeout(timer);
    }
  }, [turn, gameOver, history.length, isAIThinking, makeAIMove]);

  const handleSquareClick = useCallback((rank, file, piece) => {
    if (isAIThinking || gameOver || turn !== 'w') return;
    const key = getSquareKey(rank, file);
    const sq = squareToAlgebraic(file, rank);
    if (selectedSquare) {
      const match = legalMoves.find((m) => (m.to ?? m) === sq);
      if (match) {
        try {
          const g = new Chess(fen), result = g.move({
            from: squareToAlgebraic(parseInt(selectedSquare.split('-')[1]), parseInt(selectedSquare.split('-')[0])),
            to: sq, promotion: 'q',
          });
          if (result) { setGame(g); setLastMove({ from: result.from, to: result.to }); setSelectedSquare(null); setLegalMoves([]); return; }
        } catch {}
      }
      if (piece?.color === 'w') { const m = game.moves({ square: sq, verbose: true }); setSelectedSquare(key); setLegalMoves(m); return; }
      setSelectedSquare(null); setLegalMoves([]); return;
    }
    if (piece?.color === 'w') { const m = game.moves({ square: sq, verbose: true }); if (m.length) { setSelectedSquare(key); setLegalMoves(m); } }
  }, [selectedSquare, legalMoves, game, fen, isAIThinking, gameOver, turn]);

  const handleReset = useCallback(() => {
    setGame(new Chess()); setSelectedSquare(null); setLegalMoves([]);
    setLastMove(null); setIsAIThinking(false); aiRunning.current = false;
    clearSavedGame();
  }, [clearSavedGame]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Top control cards ── */}
      <div className="flex shrink-0 flex-wrap items-stretch gap-1.5 pb-2 sm:gap-2 sm:pb-3">
        {/* New Game */}
        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="group flex items-center gap-1.5 rounded-xl border border-black/10 bg-gradient-to-b from-white to-neutral-50 px-3 py-2 shadow-sm transition-all hover:border-black/25 hover:shadow-md sm:gap-2 sm:px-4 sm:py-2.5"
        >
          <span className="text-lg transition-transform duration-200 group-hover:scale-110 sm:text-xl">♞</span>
          <span className="whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.1em] text-black/70 sm:text-[9px]">New Game</span>
          <span className="ml-1 rounded-full border border-black/10 bg-white p-1 shadow-xs transition-all group-hover:border-black/25 group-hover:bg-neutral-50">
            <RotateCcw size={8} className="text-neutral-400 sm:size-[10px]" />
          </span>
        </motion.button>

        {/* Level */}
        <div className="flex items-stretch gap-px rounded-xl border border-black/10 bg-gradient-to-b from-white to-neutral-50 px-1.5 py-1 shadow-sm transition-all hover:border-black/25 hover:shadow-md sm:px-2 sm:py-1.5">
          <span className="mr-1 hidden items-center self-center text-[7px] font-bold uppercase tracking-[0.1em] text-neutral-400 sm:flex">Level</span>
          {DIFF_LABELS.map((d) => {
            const active = difficulty === d.key;
            return (
              <motion.button
                key={d.key}
                onClick={() => { setDifficulty(d.key); handleReset(); }}
                disabled={history.length > 0 && !gameOver}
                className={`relative rounded-md px-1.5 py-1 text-[7px] font-bold uppercase tracking-wider transition-colors sm:px-2 sm:text-[8px] ${
                  (history.length > 0 && !gameOver) ? 'cursor-not-allowed opacity-20' : ''
                }`}
              >
                {active && (
                  <motion.span layoutId="diff-pill" className="absolute inset-0 rounded-md bg-gradient-to-r from-neutral-800 to-black shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                  <span className={active ? 'text-white' : 'text-neutral-600 group-hover:text-black'}>{d.label}</span>
                  <span className={`text-[6px] ${active ? 'text-white/60' : 'text-neutral-400'} sm:text-[7px]`}>{d.name}</span>
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Flip Board */}
        <motion.button
          onClick={() => setFlipped((f) => !f)}
          whileHover={history.length === 0 || gameOver ? { scale: 1.02 } : undefined}
          whileTap={history.length === 0 || gameOver ? { scale: 0.97 } : undefined}
          disabled={history.length > 0 && !gameOver}
          className={`flex items-center gap-1.5 rounded-xl border bg-gradient-to-b px-3 py-2 shadow-sm transition-all sm:gap-2 sm:px-4 sm:py-2.5 ${
            history.length > 0 && !gameOver
              ? 'cursor-not-allowed border-black/5 from-neutral-100 to-neutral-100 opacity-40'
              : 'border-black/10 from-white to-neutral-50 hover:border-black/25 hover:shadow-md'
          }`}
        >
          <FlipHorizontal size={14} className={`transition-transform sm:size-4 ${history.length === 0 || gameOver ? 'group-hover:scale-110' : ''} text-neutral-500`} />
          <span className={`whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.1em] sm:text-[9px] ${history.length > 0 && !gameOver ? 'text-neutral-400' : 'text-neutral-600'}`}>Flip Board</span>
        </motion.button>
      </div>

      {/* ── Board ── */}
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <ChessBoard
          board={board}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          lastMove={lastMove}
          onSquareClick={handleSquareClick}
          flipped={flipped}
        />
      </div>

      {/* ── API key banner ── */}
      {!apiKey && (
        <div className="shrink-0 pt-1 text-center text-[6px] font-bold uppercase tracking-[0.08em] text-amber-500">
          Add Gemini key in <a href="/api" className="underline underline-offset-1 hover:text-amber-700">API settings</a>
        </div>
      )}
    </div>
  );
}
