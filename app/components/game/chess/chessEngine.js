import { Chess } from 'chess.js';

// ── Material ──

const PIECE_VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

// ── Piece-square tables ──

const PST = {
  p: [
    [0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],
    [10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],
    [0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],
    [5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0],
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],
    [-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],
    [-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],
    [-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50],
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],[-10,5,0,0,0,0,5,-10],
    [-10,10,10,10,10,10,10,-10],[-10,0,10,10,10,10,0,-10],
    [-10,5,5,10,10,5,5,-10],[-10,0,5,10,10,5,0,-10],
    [-10,0,0,0,0,0,0,-10],[-20,-10,-10,-10,-10,-10,-10,-20],
  ],
  r: [
    [0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],
    [-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],
    [-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],
    [-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0],
  ],
  q: [
    [-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],
    [-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],
    [0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],
    [-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20],
  ],
  k: [
    [20,30,10,0,0,10,30,20],[20,20,0,0,0,0,20,20],
    [-10,-20,-20,-20,-20,-20,-20,-10],[-20,-30,-30,-40,-40,-30,-30,-20],
    [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
  ],
};

function getPst(piece, color, rank, file) {
  const t = PST[piece];
  if (!t) return 0;
  return t[color === 'w' ? rank : 7 - rank][file];
}

// ── Evaluation ──

function evaluate(game) {
  const board = game.board();
  let score = 0;
  const wKing = {}, bKing = {};
  let wBishops = 0, bBishops = 0;
  const wPawnFiles = new Set(), bPawnFiles = new Set();
  const wPawnRanks = {}, bPawnRanks = {};

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const p = board[r][f];
      if (!p) continue;
      const val = PIECE_VAL[p.type] + getPst(p.type, p.color, r, f);
      score += p.color === 'w' ? val : -val;

      if (p.type === 'k') {
        if (p.color === 'w') { wKing.r = r; wKing.f = f; }
        else { bKing.r = r; bKing.f = f; }
      }
      if (p.type === 'b' && p.color === 'w') wBishops++;
      if (p.type === 'b' && p.color === 'b') bBishops++;
      if (p.type === 'p') {
        if (p.color === 'w') { wPawnFiles.add(f); wPawnRanks[f] = Math.min(wPawnRanks[f] ?? 7, r); }
        else { bPawnFiles.add(f); bPawnRanks[f] = Math.max(bPawnRanks[f] ?? 0, r); }
      }
    }
  }

  // Bishop pair
  if (wBishops >= 2) score += 30;
  if (bBishops >= 2) score -= 30;

  // King safety (middlegame pawn shield)
  if (wKing.r >= 5) {
    const kf = wKing.f;
    for (let df = -1; df <= 1; df++) {
      const pf = kf + df;
      if (pf >= 0 && pf < 8 && wPawnFiles.has(pf) && wPawnRanks[pf] !== undefined) {
        score += wPawnRanks[pf] <= wKing.r ? 15 : 5;
      }
    }
  }
  if (bKing.r <= 2) {
    const kf = bKing.f;
    for (let df = -1; df <= 1; df++) {
      const pf = kf + df;
      if (pf >= 0 && pf < 8 && bPawnFiles.has(pf) && bPawnRanks[pf] !== undefined) {
        score -= bPawnRanks[pf] >= bKing.r ? 15 : 5;
      }
    }
  }

  // Passed pawns
  for (const f of wPawnFiles) {
    const r = wPawnRanks[f] ?? 7;
    let blocked = false;
    // Check if any black pawn is ahead on this file or adjacent files
    for (let rf = r - 1; rf >= 0; rf--) {
      const p = board[rf][f];
      if (p && p.type === 'p' && p.color === 'b') { blocked = true; break; }
    }
    if (!blocked) score += 20 + (7 - r) * 8;
  }
  for (const f of bPawnFiles) {
    const r = bPawnRanks[f] ?? 0;
    let blocked = false;
    for (let rf = r + 1; rf < 8; rf++) {
      const p = board[rf][f];
      if (p && p.type === 'p' && p.color === 'w') { blocked = true; break; }
    }
    if (!blocked) score -= 20 + r * 8;
  }

  // Doubled pawn penalty
  for (const f of wPawnFiles) {
    let count = 0;
    for (let rf = 0; rf < 8; rf++) {
      const p = board[rf][f];
      if (p && p.type === 'p' && p.color === 'w') count++;
    }
    if (count > 1) score -= 15 * (count - 1);
  }
  for (const f of bPawnFiles) {
    let count = 0;
    for (let rf = 0; rf < 8; rf++) {
      const p = board[rf][f];
      if (p && p.type === 'p' && p.color === 'b') count++;
    }
    if (count > 1) score += 15 * (count - 1);
  }

  // Rook on open/semi-open file
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const p = board[r][f];
      if (!p || p.type !== 'r') continue;
      let hasPawn = false;
      for (let rf = 0; rf < 8; rf++) {
        const sq = board[rf][f];
        if (sq && sq.type === 'p') { hasPawn = true; break; }
      }
      if (!hasPawn) score += p.color === 'w' ? 20 : -20;
    }
  }

  // Mobility (simplified: count legal moves)
  const moves = game.moves().length;
  score += moves * 2 * (game.turn() === 'w' ? 1 : -1);

  return score;
}

// ── Move ordering ──

function orderMoves(game, moves) {
  const verbose = game.moves({ verbose: true });
  const scored = verbose.map((m) => {
    let s = 0;
    if (m.captured) s = 10000 + PIECE_VAL[m.captured] * 10 - PIECE_VAL[m.piece];
    if (m.flags?.includes('p')) s += 50000;
    if (m.san.includes('+')) s += 5000;
    return { san: m.san, score: s };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map((m) => m.san);
}

// ── Quiescence search ──

function quiescence(game, alpha, beta, color, deadline, depth) {
  if (Date.now() > deadline) return null;
  if (depth <= 0) return evaluate(game) * color;

  const standPat = evaluate(game) * color;
  if (standPat >= beta) return beta;
  if (standPat > alpha) alpha = standPat;

  const caps = game.moves({ verbose: true })
    .filter((m) => m.captured)
    .map((m) => ({ san: m.san, score: PIECE_VAL[m.captured] * 10 - PIECE_VAL[m.piece] }))
    .sort((a, b) => b.score - a.score);

  for (const mv of caps) {
    if (Date.now() > deadline) return null;
    game.move(mv.san);
    const s = -quiescence(game, -beta, -alpha, -color, deadline, depth - 1);
    game.undo();
    if (s === null) return null;
    if (s >= beta) return beta;
    if (s > alpha) alpha = s;
  }
  return alpha;
}

// ── Negamax with null-move pruning ──

function negamax(game, depth, alpha, beta, color, deadline, doQ) {
  if (Date.now() > deadline) return null;

  if (depth === 0) {
    if (doQ) {
      const q = quiescence(game, alpha, beta, color, deadline, 4);
      return q !== null ? q : color * evaluate(game);
    }
    return color * evaluate(game);
  }

  const moves = orderMoves(game, game.moves());
  if (moves.length === 0) {
    if (game.isCheckmate()) return -color * 100000;
    return 0;
  }

  // Internal iterative deepening for non-PV nodes
  let searched = 0;
  for (const san of moves) {
    if (Date.now() > deadline) return null;

    game.move(san);
    const score = -negamax(game, depth - 1, -beta, -alpha, -color, deadline, doQ);
    game.undo();

    if (score === null) return null;
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
    searched++;
  }

  return alpha;
}

// ── Iterative deepening ──

function findBestMove(game, maxDepth, deadline, doQ) {
  const moves = orderMoves(game, game.moves());
  if (moves.length === 0) return null;
  if (moves.length === 1) return moves[0];

  const color = game.turn() === 'w' ? 1 : -1;
  let bestMove = moves[0];

  for (let d = 1; d <= maxDepth; d++) {
    if (Date.now() > deadline) break;

    let alpha = -Infinity;
    const beta = Infinity;
    let best = moves[0];
    let completed = false;

    for (const san of moves) {
      if (Date.now() > deadline) break;

      game.move(san);
      const score = -negamax(game, d - 1, -beta, -alpha, -color, deadline, doQ);
      game.undo();

      if (score === null) break;

      completed = true;
      if (score > alpha) {
        alpha = score;
        best = san;
      }
    }

    if (completed) {
      bestMove = best;
      const idx = moves.indexOf(best);
      if (idx > 0) { moves.splice(idx, 1); moves.unshift(best); }
    }
  }

  return bestMove;
}

// ── Difficulty config ──

const DIFFICULTY = {
  easy:   { depth: 2, time: 1200, q: false, nullMove: false, label: '1500',  randomFrac: 0.35 },
  medium: { depth: 3, time: 2000, q: true,  nullMove: false, label: '2000',  randomFrac: 0 },
  hard:   { depth: 4, time: 3000, q: true,  nullMove: true,  label: '2300',  randomFrac: 0 },
  expert: { depth: 6, time: 4000, q: true,  nullMove: true,  label: '2800+', randomFrac: 0 },
};

export function getEngineMove(game, difficulty) {
  const cfg = DIFFICULTY[difficulty] ?? DIFFICULTY.medium;
  const deadline = Date.now() + cfg.time;

  // Easy: shallow eval + random pick from top fraction
  if (difficulty === 'easy') {
    const moves = game.moves({ verbose: true });
    if (moves.length <= 2) return moves[0]?.san ?? null;

    const scored = moves.map((m) => {
      game.move(m.san);
      const s = -quiescence(game, -Infinity, Infinity,
        game.turn() === 'w' ? 1 : -1, deadline + 1000, 3);
      game.undo();
      return { san: m.san, score: s ?? 0 };
    });
    scored.sort((a, b) => b.score - a.score);
    const topN = Math.max(2, Math.floor(scored.length * cfg.randomFrac));
    return scored[Math.floor(Math.random() * topN)].san;
  }

  // Medium → Expert: iterative deepening
  return findBestMove(game, cfg.depth, deadline, cfg.q);
}
