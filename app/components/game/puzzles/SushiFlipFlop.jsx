'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

/* ─── Sushi Memory ─── */

const SUSHI_ITEMS = [
  { id: 's1', emoji: '🍣', name: 'Sushi' },
  { id: 's2', emoji: '🍱', name: 'Bento' },
  { id: 's3', emoji: '🍜', name: 'Ramen' },
  { id: 's4', emoji: '🥟', name: 'Dumpling' },
  { id: 's5', emoji: '🍙', name: 'Onigiri' },
  { id: 's6', emoji: '🥢', name: 'Chopsticks' },
];

function shuffleCards() {
  const cards = [...SUSHI_ITEMS, ...SUSHI_ITEMS].map((item, i) => ({
    ...item,
    uid: `${item.id}-${i}`,
  }));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function SushiMemory({ onComplete }) {
  const [cards, setCards] = useState(shuffleCards);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);

  const handleFlip = useCallback(
    (uid) => {
      if (locked || flipped.length >= 2 || matched.has(uid)) return;
      setFlipped((prev) => [...prev, uid]);
    },
    [locked, flipped, matched],
  );

  useEffect(() => {
    if (flipped.length !== 2) return;
    setLocked(true);
    const [a, b] = flipped;
    const cardA = cards.find((c) => c.uid === a);
    const cardB = cards.find((c) => c.uid === b);
    setMoves((m) => m + 1);

    if (cardA.id === cardB.id) {
      setMatched((prev) => new Set([...prev, a, b]));
      setFlipped([]);
      setLocked(false);
    } else {
      const timer = setTimeout(() => {
        setFlipped([]);
        setLocked(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [flipped]);

  useEffect(() => {
    if (matched.size === cards.length && cards.length > 0) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [matched, cards.length, onComplete]);

  const reset = () => {
    setCards(shuffleCards());
    setFlipped([]);
    setMatched(new Set());
    setLocked(false);
    setMoves(0);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-[10px] uppercase tracking-wider text-neutral-500">
        Match the sushi pairs — {moves} moves
      </p>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.uid) || matched.has(card.uid);
          return (
            <motion.button
              key={card.uid}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFlip(card.uid)}
              className={`flex h-16 w-16 items-center justify-center rounded-lg border text-2xl transition-colors sm:h-20 sm:w-20 ${
                isFlipped
                  ? 'border-black bg-white'
                  : 'border-neutral-300 bg-neutral-100 hover:border-neutral-400'
              }`}
            >
              <AnimatePresence mode="wait">
                {isFlipped ? (
                  <motion.span
                    key="emoji"
                    initial={{ rotateY: 180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -180, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {card.emoji}
                  </motion.span>
                ) : (
                  <motion.span
                    key="back"
                    initial={{ rotateY: -180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 180, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-bold text-neutral-300"
                  >
                    ?
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
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

/* ─── Flip-Flop Sequence ─── */

const FLIP_COLORS = ['#E40303', '#FF8C00', '#FFED00', '#008026', '#004DFF', '#750787'];

function FlipFlop({ onComplete }) {
  const [sequence, setSequence] = useState(() => [Math.floor(Math.random() * 6)]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [won, setWon] = useState(false);

  const playSequence = useCallback(() => {
    setPlaying(true);
    setPlayerIndex(0);
    let i = 0;
    const interval = setInterval(() => {
      setActiveIndex(sequence[i]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          setActiveIndex(null);
          setPlaying(false);
        }, 400);
      }
    }, 600);
    return () => clearInterval(interval);
  }, [sequence]);

  const prevSequenceRef = useRef(sequence);
  useEffect(() => {
    if (sequence !== prevSequenceRef.current) {
      prevSequenceRef.current = sequence;
      const cleanup = playSequence();
      return cleanup;
    }
  }, [sequence, playSequence]);

  const handleColorClick = (index) => {
    if (playing || won) return;
    if (index === sequence[playerIndex]) {
      const nextIdx = playerIndex + 1;
      if (nextIdx >= sequence.length) {
        if (sequence.length >= 6) {
          setWon(true);
          setTimeout(onComplete, 500);
        } else {
          setSequence((prev) => [...prev, Math.floor(Math.random() * 6)]);
        }
      } else {
        setPlayerIndex(nextIdx);
      }
    } else {
      // wrong — restart
      const cleanup = playSequence();
      return cleanup;
    }
  };

  if (won) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4 py-8"
      >
        <CheckCircle2 size={48} className="text-green-500" />
        <p className="text-sm font-bold uppercase tracking-widest">
          Pattern Master!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-[10px] uppercase tracking-wider text-neutral-500">
        {playing ? 'Watch the pattern...' : `Repeat it! (${playerIndex}/${sequence.length})`}
      </p>

      <div className="grid grid-cols-3 gap-2">
        {FLIP_COLORS.map((color, i) => (
          <motion.button
            key={i}
            whileHover={!playing ? { scale: 1.08 } : undefined}
            whileTap={!playing ? { scale: 0.92 } : undefined}
            onClick={() => handleColorClick(i)}
            animate={
              activeIndex === i
                ? { scale: 1.15, boxShadow: '0 0 20px rgba(0,0,0,0.2)' }
                : { scale: 1, boxShadow: '0 0 0 rgba(0,0,0,0)' }
            }
            className="h-14 w-14 rounded-xl border-2 border-black/10 sm:h-16 sm:w-16"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <p className="text-[10px] text-neutral-400">
        Sequence length: {sequence.length}/7
      </p>
    </div>
  );
}

/* ─── Container ─── */

export default function SushiFlipFlop() {
  const [tab, setTab] = useState('sushi');
  const [done, setDone] = useState({ sushi: false, flipflop: false });

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex gap-4">
        <button
          onClick={() => setTab('sushi')}
          className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
            tab === 'sushi'
              ? 'bg-black text-white'
              : 'border border-black/20 text-neutral-500 hover:border-black'
          } ${done.sushi ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}
        >
          🍣 Sushi Match
        </button>
        <button
          onClick={() => setTab('flipflop')}
          className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
            tab === 'flipflop'
              ? 'bg-black text-white'
              : 'border border-black/20 text-neutral-500 hover:border-black'
          } ${done.flipflop ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}
        >
          🩴 Flip-Flop
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'sushi' ? (
            <SushiMemory onComplete={() => setDone((d) => ({ ...d, sushi: true }))} />
          ) : (
            <FlipFlop onComplete={() => setDone((d) => ({ ...d, flipflop: true }))} />
          )}
        </motion.div>
      </AnimatePresence>

      {done.sushi && done.flipflop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <CheckCircle2 size={48} className="text-green-500" />
          <p className="text-sm font-bold uppercase tracking-widest">
            Both Complete!
          </p>
          <p className="text-xs text-neutral-500">
            You mastered Sushi Day &amp; Flip-Flop Day.
          </p>
        </motion.div>
      )}
    </div>
  );
}
