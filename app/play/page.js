'use client';

import { motion } from 'framer-motion';
import TabGuard from '@/app/components/shared/TabGuard';
import ChessGame from '@/app/components/game/chess/ChessGame';

export default function PlayPage() {
  return (
    <TabGuard>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-1 flex-col"
      >
        <ChessGame />
      </motion.div>
    </TabGuard>
  );
}
