const variantStyles = {
  locked: 'bg-white/5 text-white/30 border border-white/10',
  active: 'bg-amber-600 text-black',
  info: 'bg-white/5 text-white/70 border border-white/10',
};

export default function Badge({ variant = 'info', children, className = '' }) {
  const resolved = children ?? (variant === 'locked' ? 'LOCKED' : null);
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${variantStyles[variant]} ${className}`}>
      {resolved}
    </span>
  );
}
