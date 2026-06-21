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
      className={`rounded-xl border border-white/[0.06] bg-[#111] p-6 transition-all ${
        isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/30'
      } ${className}`}
    >
      {title && <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.08em] text-white">{title}</h3>}
      {subtitle && <p className="mb-3 text-[10px] uppercase tracking-[0.08em] text-white/40">{subtitle}</p>}
      {children && <div className="text-sm leading-relaxed text-white/70">{children}</div>}
    </motion.div>
  );
}
