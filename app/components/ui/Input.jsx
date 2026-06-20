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
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
          {label}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        className={`border-b border-black/20 bg-transparent px-0 py-2.5 text-sm tracking-wide text-black outline-none transition-colors placeholder:text-neutral-300 focus:border-black focus:ring-0 ${className}`}
      />
    </label>
  );
}
