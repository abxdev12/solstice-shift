'use client';

import { motion } from 'framer-motion';

export default function Card({
  title,
  subtitle,
  children,
  variant = 'default',
  onClick,
  className = '',
}) {
  const isLocked = variant === 'locked';

  return (
    <motion.div
      whileHover={!isLocked ? { y: -3 } : undefined}
      onClick={!isLocked ? onClick : undefined}
      className={`border border-black/10 bg-white p-6 transition-shadow hover:shadow-md ${
        isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${className}`}
    >
      {title && (
        <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.12em]">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="mb-3 text-[10px] uppercase tracking-[0.12em] text-neutral-500">
          {subtitle}
        </p>
      )}
      {children && <div className="text-sm leading-relaxed">{children}</div>}
    </motion.div>
  );
}
