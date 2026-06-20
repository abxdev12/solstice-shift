'use client';

import { motion } from 'framer-motion';
import useAppStore from '@/app/store/useAppStore';
import { LOCK_MESSAGE } from '@/app/utils/constants';
import Button from '@/app/components/ui/Button';
import Link from 'next/link';

export default function TabGuard({ children }) {
  const isPlayLocked = useAppStore((s) => s.isPlayLocked);

  if (!isPlayLocked) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="text-5xl"
      >
        ♟
      </motion.span>
      <h2 className="text-lg font-bold uppercase tracking-[0.15em]">Locked</h2>
      <p className="max-w-md text-sm leading-relaxed text-neutral-500">
        {LOCK_MESSAGE}
      </p>
      <Link href="/api">
        <Button variant="primary">Go to API Settings</Button>
      </Link>
    </motion.div>
  );
}
