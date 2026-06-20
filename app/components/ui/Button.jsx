'use client';

import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-black text-white hover:bg-neutral-900 border border-black shadow-sm',
  ghost:
    'bg-transparent text-black hover:bg-neutral-100 border border-black/20 hover:border-black',
  locked:
    'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200',
};

export default function Button({
  variant = 'primary',
  disabled = false,
  onClick,
  children,
  className = '',
}) {
  const base =
    'inline-flex items-center justify-center px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200';

  const resolvedVariant = disabled ? 'locked' : variant;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.015 } : undefined}
      whileTap={!disabled ? { scale: 0.985 } : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[resolvedVariant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
