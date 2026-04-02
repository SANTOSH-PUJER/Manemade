const variants = {
  primary: 'bg-[var(--accent-strong)] text-white shadow-lg shadow-[var(--accent-strong)]/20',
  secondary: 'bg-[var(--surface-muted)] text-[var(--text-secondary)]',
  success: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  outline: 'border border-[var(--text-muted)]/20 text-[var(--text-secondary)]',
};

export default function Badge({
  children,
  variant = 'primary',
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
