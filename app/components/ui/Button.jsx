'use client';

import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-amber-600 text-black hover:bg-amber-500 border border-transparent shadow-lg shadow-amber-600/20',
  ghost:
    'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20',
  locked:
    'bg-white/5 text-white/20 cursor-not-allowed border border-white/5',
};

export default function Button({
  variant = 'primary',
  disabled = false,
  onClick,
  children,
  className = '',
}) {
  const base = 'inline-flex items-center justify-center px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-200 rounded-xl';
  const resolved = disabled ? 'locked' : variant;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.015 } : undefined}
      whileTap={!disabled ? { scale: 0.985 } : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[resolved]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
