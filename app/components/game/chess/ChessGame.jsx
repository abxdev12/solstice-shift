'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Chess } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, FlipHorizontal, Lightbulb, Sparkles, Loader2, ScrollText, X } from 'lucide-react';
import useAppStore from '@/app/store/useAppStore';
import { getChessCommentary } from './geminiChess';
import { getEngineMove } from './chessEngine';
import ChessBoard from './ChessBoard';
import DifficultySelector from './DifficultySelector';
import { getSquareKey, squareToAlgebraic } from './chessUtils';

const COMMENTARY_COOLDOWN = 5000;

export default function ChessGame() {
  const apiKey = useAppStore((s) => s.apiKey);
  const savedFen = useAppStore((s) => s.savedFen);
  const savedLastMove = useAppStore((s) => s.savedLastMove);
  const savedHistory = useAppStore((s) => s.savedHistory);
  const saveGame = useAppStore((s) => s.saveGame);
  const clearSavedGame = useAppStore((s) => s.clearSavedGame);

  const [game, setGame] = useState(() => {
    if (savedFen) { try { return new Chess(savedFen); } catch {} }
    return new Chess();
  });
  const [moveHistory, setMoveHistory] = useState(savedHistory.length > 0 ? savedHistory : []);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [lastMove, setLastMove] = useState(savedLastMove || null);
  const [difficulty, setDifficulty] = useState('medium');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [commentary, setCommentary] = useState(null);
  const [commentaryLoading, setCommentaryLoading] = useState(false);
  const [commentaryError, setCommentaryError] = useState(null);
  const [lastCommentaryAt, setLastCommentaryAt] = useState(0);

  const aiRunning = useRef(false);
  const mounted = useRef(false);
  const movesRef = useRef(null);

  useEffect(() => {
    if (movesRef.current) movesRef.current.scrollTop = movesRef.current.scrollHeight;
  }, [moveHistory]);

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (!game.isGameOver()) saveGame(game.fen(), lastMove, moveHistory);
  }, [game, lastMove, moveHistory, saveGame]);

  const board = game.board();
  const turn = game.turn();
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
          setGame(g);
          setMoveHistory(prev => [...prev, result.san]);
          setLastMove({ from: result.from, to: result.to });
          setSelectedSquare(null); setLegalMoves([]);
        }
      } catch (e) { console.error(e); }
      finally { setIsAIThinking(false); aiRunning.current = false; }
    }, 50);
  }, [game, difficulty, gameOver]);

  useEffect(() => {
    if (!gameOver && turn === 'b' && !isAIThinking && moveHistory.length > 0) {
      const timer = setTimeout(() => makeAIMove(), 300);
      return () => clearTimeout(timer);
    }
  }, [turn, gameOver, moveHistory.length, isAIThinking, makeAIMove]);

  const handleSquareClick = useCallback((rank, file, piece) => {
    if (isAIThinking || gameOver || turn !== 'w') return;
    const key = getSquareKey(rank, file);
    const sq = squareToAlgebraic(file, rank);
    if (selectedSquare) {
      const match = legalMoves.find((m) => (m.to ?? m) === sq);
      if (match) {
        try {
          const g = new Chess(fen), result = g.move({ from: squareToAlgebraic(parseInt(selectedSquare.split('-')[1]), parseInt(selectedSquare.split('-')[0])), to: sq, promotion: 'q' });
          if (result) { setGame(g); setMoveHistory(prev => [...prev, result.san]); setLastMove({ from: result.from, to: result.to }); setSelectedSquare(null); setLegalMoves([]); return; }
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
    setCommentary(null); setCommentaryError(null); setMoveHistory([]);
    clearSavedGame();
  }, [clearSavedGame]);

  const handleGetCommentary = useCallback(async () => {
    if (!apiKey) { setCommentaryError('Enter a Gemini API key in the API tab first.'); return; }
    if (moveHistory.length === 0) { setCommentaryError('Play a move first.'); return; }
    const now = Date.now();
    if (now - lastCommentaryAt < COMMENTARY_COOLDOWN) return;
    setCommentaryLoading(true); setCommentaryError(null); setLastCommentaryAt(now);
    try {
      const analysis = await getChessCommentary(apiKey, fen, moveHistory[moveHistory.length - 1]);
      setCommentary(analysis);
    } catch (e) { setCommentaryError(e.message || 'Failed.'); }
    finally { setCommentaryLoading(false); }
  }, [apiKey, fen, moveHistory, lastCommentaryAt]);

  return (
    <div className="flex h-full flex-col overflow-hidden lg:flex-row lg:gap-4">
      {/* ── Left panel: Controls ── */}
      <div className="flex shrink-0 flex-col gap-3 lg:w-[200px]">
        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="group flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#111] px-4 py-3 shadow-sm transition-all hover:border-white/[0.12] hover:shadow-lg"
        >
          <span className="text-lg transition-transform group-hover:scale-110">♞</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/70">New Game</span>
          <span className="ml-auto rounded-full border border-white/[0.06] p-1 transition-colors group-hover:bg-white/5">
            <RotateCcw size={10} className="text-white/40" />
          </span>
        </motion.button>

        <div className="rounded-xl border border-white/[0.06] bg-[#111] p-3 shadow-sm">
          <span className="mb-2 block text-[8px] font-bold uppercase tracking-[0.12em] text-white/40">Level</span>
          <DifficultySelector value={difficulty} onChange={(d) => { setDifficulty(d); handleReset(); }} disabled={moveHistory.length > 0 && !gameOver} />
        </div>

        <motion.button
          onClick={() => setFlipped((f) => !f)}
          whileHover={moveHistory.length === 0 || gameOver ? { scale: 1.02 } : undefined}
          whileTap={moveHistory.length === 0 || gameOver ? { scale: 0.97 } : undefined}
          disabled={moveHistory.length > 0 && !gameOver}
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 shadow-sm transition-all ${
            moveHistory.length > 0 && !gameOver
              ? 'cursor-not-allowed border-white/[0.03] bg-[#0a0a0a] opacity-30'
              : 'border-white/[0.06] bg-[#111] hover:border-white/[0.12] hover:shadow-lg'
          }`}
        >
          <FlipHorizontal size={14} className="text-white/50" />
          <span className={`text-[9px] font-bold uppercase tracking-[0.08em] ${moveHistory.length > 0 && !gameOver ? 'text-white/30' : 'text-white/60'}`}>Flip Board</span>
        </motion.button>

        <div className="mt-auto rounded-xl border border-white/[0.06] bg-[#111] p-3 text-center shadow-sm">
          <AnimatePresence mode="wait">
            <motion.span key={turn + (isAIThinking ? '-think' : '')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="block text-[8px] font-bold uppercase tracking-[0.1em] text-white/40">
              {isCheckmate ? 'Checkmate' : isDraw || isStalemate ? 'Draw' : isCheck ? 'Check!' : isAIThinking ? 'AI thinking...' : `${turn === 'w' ? 'White' : 'Black'}'s turn`}
            </motion.span>
          </AnimatePresence>
          <span className="text-xl font-bold text-white">{Math.floor(moveHistory.length / 2) + 1}</span>
          <span className="block text-[7px] font-bold uppercase tracking-[0.1em] text-white/30">Move</span>
        </div>
      </div>

      {/* ── Center: Board ── */}
      <div className="flex min-h-0 flex-1 items-center justify-center py-2 lg:py-0">
        <ChessBoard board={board} selectedSquare={selectedSquare} legalMoves={legalMoves} lastMove={lastMove} onSquareClick={handleSquareClick} flipped={flipped} />
      </div>

      {/* ── Right panel: AI Analysis + Move History ── */}
      <div className="flex shrink-0 flex-col gap-3 lg:w-[240px]">
        {/* AI Analysis */}
        <div className="flex flex-col rounded-xl border border-amber-900/20 bg-gradient-to-b from-[#141410] to-[#111] shadow-lg shadow-amber-900/5">
          <div className="flex items-center justify-between border-b border-amber-900/15 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles size={13} className="text-amber-400" />
                <span className="absolute -inset-1 animate-ping rounded-full bg-amber-400/20" />
              </div>
              <h3 className="text-[9px] font-bold uppercase tracking-[0.15em] text-amber-400/90">AI Analysis</h3>
            </div>
            {!isAIThinking && !commentaryLoading && (
              <motion.button
                onClick={handleGetCommentary}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-amber-400/80 transition-colors hover:bg-amber-500/20"
              >
                <Lightbulb size={10} />
                Analyze
              </motion.button>
            )}
            {commentary && !commentaryLoading && (
              <button onClick={() => { setCommentary(null); setCommentaryError(null); }} className="text-white/20 transition-colors hover:text-white/50"><X size={11} /></button>
            )}
          </div>
          <div className="min-h-[90px] px-4 py-3">
            <AnimatePresence mode="wait">
              {commentaryLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 py-2">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500/60" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500/60" style={{ animationDelay: '100ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500/60" style={{ animationDelay: '200ms' }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-400/50">Analysing position...</span>
                </motion.div>
              ) : commentaryError ? (
                <motion.p key="error" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] leading-relaxed text-red-400/80">{commentaryError}</motion.p>
              ) : commentary ? (
                <motion.div key="text" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500/60" />
                    <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-amber-400/40">Strategic Insight</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-white/70">{commentary}</p>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-1.5 py-3 text-center">
                  <Sparkles size={16} className="text-amber-500/30" />
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/30">
                    {isAIThinking ? 'AI is calculating...' : 'Tap Analyze for insights'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Move History */}
        <div className="flex flex-1 flex-col rounded-xl border border-white/[0.06] bg-[#111] shadow-sm">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            <ScrollText size={12} className="text-white/30" />
            <h3 className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/50">Moves</h3>
          </div>
          <div ref={movesRef} className="flex-1 overflow-y-auto px-4 py-3">
            {moveHistory.length === 0 ? (
              <p className="text-[8px] uppercase text-white/20 text-center py-6">No moves yet</p>
            ) : (
              <div className="space-y-1">
                {Array.from({ length: Math.ceil(moveHistory.length / 5) }).map((_, row) => (
                  <div key={row} className="flex items-center gap-1.5 text-[10px]">
                    {moveHistory.slice(row * 5, row * 5 + 5).map((san, i) => {
                      const idx = row * 5 + i;
                      return (
                        <span key={idx} className={idx % 2 === 0 ? 'text-white/90' : 'text-amber-300/90'}>
                          {san}{idx < moveHistory.length - 1 ? ',' : ''}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* API key hint */}
        {!apiKey && (
          <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 px-3 py-2 text-center text-[7px] font-bold uppercase tracking-[0.08em] text-amber-500/60">
            Add Gemini key in <a href="/api" className="underline underline-offset-2 hover:text-amber-400">API</a> for analysis
          </div>
        )}
      </div>
    </div>
  );
}
