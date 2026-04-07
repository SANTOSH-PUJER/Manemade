const variants = {
  primary: 'bg-[var(--accent-strong)] text-white shadow-lg shadow-[var(--accent-strong)]/20',
  secondary: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
  success: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  outline: 'border border-gray-200 text-gray-800 dark:border-white/10 dark:text-gray-200',
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
