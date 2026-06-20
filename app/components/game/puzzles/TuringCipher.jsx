'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

const MESSAGES = [
  'the enigma code is broken',
  'truth shall set you free',
  'think differently always',
  'decode the unseen path',
  'light shines through cracks',
];

function encode(text, shift) {
  return text
    .split('')
    .map((ch) => {
      if (ch >= 'a' && ch <= 'z') {
        const code = ((ch.charCodeAt(0) - 97 + shift) % 26 + 26) % 26;
        return String.fromCharCode(97 + code);
      }
      return ch;
    })
    .join('');
}

function pickRandom() {
  const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  const sh = Math.floor(Math.random() * 25) + 1;
  return { message: msg, shift: sh };
}

export default function TuringCipher() {
  const [state, setState] = useState(pickRandom);
  const [guess, setGuess] = useState(0);
  const [won, setWon] = useState(false);

  const encrypted = useMemo(
    () => encode(state.message, state.shift),
    [state.message, state.shift],
  );

  const decoded = useMemo(() => encode(encrypted, guess), [encrypted, guess]);

  const checkAnswer = useCallback(() => {
    if (decoded === state.message) setWon(true);
  }, [decoded, state.message]);

  const reset = useCallback(() => {
    setState(pickRandom());
    setGuess(0);
    setWon(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <p className="text-xs uppercase tracking-wider text-neutral-500">
        Find the Caesar shift to decode the message
      </p>

      <div className="w-full max-w-md">
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          Encrypted
        </label>
        <div className="rounded-lg border border-black/20 bg-neutral-50 p-4 font-mono text-sm tracking-wider">
          {encrypted}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          Shift:
        </span>
        <button
          onClick={() => setGuess(Math.max(0, guess - 1))}
          className="rounded border border-black p-2 transition-colors hover:bg-neutral-100"
        >
          <ArrowLeft size={14} />
        </button>
        <motion.span
          key={guess}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="w-8 text-center text-lg font-bold"
        >
          {guess}
        </motion.span>
        <button
          onClick={() => setGuess(Math.min(25, guess + 1))}
          className="rounded border border-black p-2 transition-colors hover:bg-neutral-100"
        >
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="w-full max-w-md">
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          Decoded (shift {guess})
        </label>
        <div
          className={`rounded-lg border p-4 font-mono text-sm tracking-wider transition-colors ${
            decoded === state.message
              ? 'border-green-400 bg-green-50'
              : 'border-black/20 bg-neutral-50'
          }`}
        >
          {decoded}
        </div>
      </div>

      {won ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 size={48} className="text-green-500" />
          </motion.div>
          <p className="text-lg font-bold uppercase tracking-widest">
            Cipher Cracked!
          </p>
          <p className="text-sm text-neutral-500">
            The shift was {state.shift}. &ldquo;{state.message}&rdquo;
          </p>
          <button
            onClick={reset}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-black"
          >
            <RotateCcw size={14} />
            New Cipher
          </button>
        </motion.div>
      ) : (
        <button
          onClick={checkAnswer}
          disabled={decoded !== state.message}
          className="rounded border border-black px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          Check Answer
        </button>
      )}
    </div>
  );
}
