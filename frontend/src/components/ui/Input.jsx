export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--text-secondary)] transition-colors duration-200"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent-strong)] transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`
            w-full rounded-[var(--radius-sm)] border border-black/10 bg-[var(--surface)] py-3 text-[var(--text-primary)] transition-all duration-200 placeholder:text-[var(--text-muted)]/70 focus:border-[var(--accent-strong)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--accent-strong)]/5 dark:border-white/10
            ${Icon ? 'pl-11 pr-4' : 'px-4'}
            ${error ? 'border-rose-500/50 ring-rose-500/5 focus:border-rose-500' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-rose-500 transition-opacity">
          {error}
        </p>
      )}
    </div>
  );
}
