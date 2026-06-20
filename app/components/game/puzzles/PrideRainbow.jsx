'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, CheckCircle2 } from 'lucide-react';

const COLORS = [
  { name: 'Red', hex: '#E40303' },
  { name: 'Orange', hex: '#FF8C00' },
  { name: 'Yellow', hex: '#FFED00' },
  { name: 'Green', hex: '#008026' },
  { name: 'Blue', hex: '#004DFF' },
  { name: 'Purple', hex: '#750787' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PrideRainbow() {
  const [items, setItems] = useState(() => shuffle(COLORS));
  const [selected, setSelected] = useState(null);

  const isSolved = items.every((item, i) => item.name === COLORS[i].name);

  const handleClick = useCallback(
    (index) => {
      if (isSolved) return;
      if (selected === null) {
        setSelected(index);
      } else if (selected === index) {
        setSelected(null);
      } else {
        setItems((prev) => {
          const next = [...prev];
          [next[selected], next[index]] = [next[index], next[selected]];
          return next;
        });
        setSelected(null);
      }
    },
    [selected, isSolved],
  );

  const handleShuffle = () => {
    setItems(shuffle(COLORS));
    setSelected(null);
  };

  if (isSolved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-6 py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <CheckCircle2 size={64} className="text-green-500" />
        </motion.div>
        <h2 className="text-lg font-bold uppercase tracking-widest">
          Rainbow Complete!
        </h2>
        <p className="text-sm text-neutral-500">
          You sorted the colors of the pride flag.
        </p>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-black"
        >
          <Shuffle size={14} />
          Play Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <p className="text-xs uppercase tracking-wider text-neutral-500">
        Click two strips to swap them. Sort the rainbow!
      </p>

      <div className="flex w-full max-w-sm flex-col gap-1.5">
        {items.map((color, i) => (
          <motion.button
            key={color.name}
            layout
            onClick={() => handleClick(i)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex h-14 items-center justify-center rounded-lg border-2 font-bold uppercase tracking-widest text-xs transition-shadow ${
              selected === i
                ? 'border-black shadow-lg'
                : 'border-transparent shadow-sm'
            }`}
            style={{ backgroundColor: color.hex }}
          >
            <span
              className={`drop-shadow-sm ${
                color.name === 'Yellow' ? 'text-black' : 'text-white'
              }`}
            >
              {color.name}
            </span>
          </motion.button>
        ))}
      </div>

      <button
        onClick={handleShuffle}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-black"
      >
        <Shuffle size={14} />
        Shuffle
      </button>
    </div>
  );
}
