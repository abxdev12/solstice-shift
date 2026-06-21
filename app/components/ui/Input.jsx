'use client';

export default function Input({
  label,
  placeholder = '',
  value,
  onChange,
  onFocus,
  type = 'text',
  className = '',
}) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">{label}</span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        className={`border-b border-white/10 bg-transparent px-0 py-2.5 text-sm tracking-wide text-white outline-none transition-colors placeholder:text-white/20 focus:border-amber-500/50 focus:ring-0 ${className}`}
      />
    </label>
  );
}
