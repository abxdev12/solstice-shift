'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import useAppStore from '@/app/store/useAppStore';

const tabs = [
  { label: 'Home', path: '/' },
  { label: 'Play', path: '/play', requiresKey: true },
  { label: 'API', path: '/api' },
];

export default function Navbar() {
  const pathname = usePathname();
  const isPlayLocked = useAppStore((s) => s.isPlayLocked);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-sm"
    >
      {/* Banner */}
      <div className="border-b border-black/5 bg-neutral-50 px-4 py-1.5 text-center sm:px-6">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-400 sm:text-[9px]"
        >
          Solstice Chess &mdash; with Gemini
        </motion.span>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Link href="/">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-70 sm:text-sm">
              <span className="text-sm sm:text-base">♞</span>
              Solstice Chess
            </span>
          </Link>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="flex items-center gap-5 sm:gap-8"
        >
          {tabs.map((tab, i) => {
            const isActive = pathname === tab.path;
            const locked = tab.requiresKey && isPlayLocked;

            return (
              <motion.div
                key={tab.path}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.25 }}
                className="relative"
              >
                <Link
                  href={locked ? '#' : tab.path}
                  onClick={(e) => { if (locked) e.preventDefault(); }}
                  className={`relative block px-1 py-1 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors sm:text-[11px] ${
                    locked
                      ? 'cursor-not-allowed text-neutral-300'
                      : isActive
                        ? 'text-black'
                        : 'text-neutral-500'
                  }`}
                >
                  {/* Label */}
                  <motion.span
                    whileHover={!locked ? { scale: 1.05 } : undefined}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="block"
                  >
                    {tab.label}
                    {locked && (
                      <span className="ml-1.5 inline-block rounded-full border border-neutral-200 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                        Locked
                      </span>
                    )}
                  </motion.span>

                  {/* Hover underline (slides from left) */}
                  {!locked && (
                    <motion.span
                      initial={{ scaleX: isActive ? 1 : 0 }}
                      animate={{ scaleX: isActive ? 1 : 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="absolute -bottom-1 left-0 right-0 h-[2px] origin-left bg-black"
                    />
                  )}

                  {/* Active tab underline (animated between tabs) */}
                  {isActive && !locked && (
                    <motion.span
                      layoutId="active-tab"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-black"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.nav>
  );
}
