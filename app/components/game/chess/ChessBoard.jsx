'use client';

import { motion } from 'framer-motion';
import { PIECE_UNICODE, FILES, RANKS, isLightSquare, squareToAlgebraic, getSquareKey } from './chessUtils';

const BOARD = {
  light: '#2d2d2d',
  dark: '#1a1a1a',
  lastLight: '#3a3a3a',
  lastDark: '#252525',
  selLight: '#4a4a3a',
  selDark: '#3a3a2a',
  pieceWhite: '#f0f0f0',
  pieceBlack: '#ffffff',
};

function ChessPiece({ piece, isSelected, square }) {
  if (!piece) return null;
  const symbol = PIECE_UNICODE[piece.color]?.[piece.type];
  if (!symbol) return null;
  const isWhite = piece.color === 'w';
  const color = isWhite ? BOARD.pieceWhite : BOARD.pieceBlack;
  const shadow = isWhite
    ? '0 0 3px rgba(0,0,0,0.9), 0 0 6px rgba(255,255,255,0.1)'
    : '0 0 3px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.4)';

  return (
    <motion.span
      key={`${piece.color}${piece.type}-${square}`}
      initial={false}
      animate={{
        scale: isSelected ? 1.15 : 1,
        filter: isSelected ? 'drop-shadow(0 6px 14px rgba(0,0,0,0.7))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
      }}
      transition={{ type: 'spring', stiffness: isSelected ? 400 : 500, damping: isSelected ? 22 : 28, mass: isSelected ? 1.2 : 1 }}
      className="relative z-20 select-none text-[clamp(1.1rem,4.5vw,2.4rem)] leading-none"
      style={{ color, textShadow: shadow }}
    >
      {symbol}
    </motion.span>
  );
}

export default function ChessBoard({
  board,
  selectedSquare,
  legalMoves,
  lastMove,
  onSquareClick,
  flipped,
}) {
  const squares = [];
  for (let ri = 0; ri < 8; ri++) {
    const r = flipped ? 7 - ri : ri;
    for (let fi = 0; fi < 8; fi++) {
      const f = flipped ? 7 - fi : fi;
      squares.push({ rank: r, file: f });
    }
  }

  const isLegalTarget = (rank, file) =>
    legalMoves.some((m) => (m.to ?? m) === squareToAlgebraic(file, rank));

  const isLastMoveSquare = (rank, file) => {
    if (!lastMove) return false;
    const sq = squareToAlgebraic(file, rank);
    return sq === lastMove.from || sq === lastMove.to;
  };

  return (
    <div className="inline-block select-none">
      <div className="flex">
        <div className="flex flex-col justify-around pr-1 py-0">
          {(flipped ? [...RANKS].reverse() : RANKS).map((rank) => (
            <span key={rank} className="flex items-center justify-center text-[8px] font-bold tracking-wider text-white/30" style={{ height: 'clamp(2rem,7.5vw,4rem)' }}>
              {rank}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-8 overflow-hidden rounded-lg shadow-2xl shadow-black/50 ring-1 ring-white/[0.08]">
          {squares.map(({ rank, file }) => {
            const key = getSquareKey(rank, file);
            const sqName = squareToAlgebraic(file, rank);
            const isLight = isLightSquare(file, rank);
            const piece = board[rank]?.[file];
            const isSelected = selectedSquare === key;
            const isLegal = isLegalTarget(rank, file);
            const isCapture = isLegal && piece;
            const isLast = isLastMoveSquare(rank, file);

            let bg = isLight ? BOARD.light : BOARD.dark;
            if (isSelected) bg = isLight ? BOARD.selLight : BOARD.selDark;
            else if (isLast) bg = isLight ? BOARD.lastLight : BOARD.lastDark;

            return (
              <button
                key={key}
                onClick={() => onSquareClick(rank, file, piece)}
                className="relative flex h-[clamp(2rem,7.5vw,4rem)] w-[clamp(2rem,7.5vw,4rem)] items-center justify-center transition-colors duration-150 hover:brightness-110 active:brightness-90"
                style={{ backgroundColor: bg }}
              >
                {isLegal && !isCapture && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute z-10 h-[28%] w-[28%] rounded-full bg-white/20" />
                )}
                {isCapture && (
                  <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute z-10 h-[90%] w-[90%] rounded-full border-2 border-white/30" />
                )}
                {piece && (
                  <ChessPiece key={`piece-${sqName}`} piece={piece} isSelected={isSelected} square={sqName} />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="ml-[18px] mt-1.5 flex px-1 sm:ml-[22px]">
        {(flipped ? [...FILES].reverse() : FILES).map((f) => (
          <span key={f} className="flex-1 text-center text-[8px] font-bold tracking-wider text-white/30">{f}</span>
        ))}
      </div>
    </div>
  );
}
