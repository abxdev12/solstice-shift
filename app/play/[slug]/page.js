'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/app/components/ui/Button';

export default function PuzzlePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-6"
    >
      <span className="text-5xl">♟</span>
      <h1 className="text-lg font-bold uppercase tracking-[0.15em]">
        Page Not Found
      </h1>
      <p className="text-sm text-neutral-500">
        This puzzle page no longer exists. Head to the Play tab for chess.
      </p>
      <Link href="/play">
        <Button variant="primary">Go to Play</Button>
      </Link>
    </motion.div>
  );
}
