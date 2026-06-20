const variantStyles = {
  locked: 'bg-neutral-100 text-neutral-400 border border-neutral-200',
  active: 'bg-black text-white',
  info: 'bg-white text-black border border-black/20',
};

export default function Badge({ variant = 'info', children, className = '' }) {
  const resolved = children ?? (variant === 'locked' ? 'LOCKED' : null);

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] ${variantStyles[variant]} ${className}`}
    >
      {resolved}
    </span>
  );
}
