export const PIECE_UNICODE = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
};

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export function isLightSquare(file, rank) {
  return (file + rank) % 2 === 0;
}

export function squareToAlgebraic(file, rank) {
  return FILES[file] + RANKS[rank];
}

const SQUARE_KEYS = {};
for (let r = 0; r < 8; r++) {
  for (let f = 0; f < 8; f++) {
    SQUARE_KEYS[`${r}-${f}`] = true;
  }
}

export function getSquareKey(rank, file) {
  return `${rank}-${file}`;
}
