import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600',
  secondary: 'bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--surface-muted),var(--text-primary)_7%)]',
  outline: 'border-2 border-black/8 text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] dark:border-white/10',
  ghost: 'text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-soft)]',
  danger: 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600',
};

const sizes = {
  sm: 'px-4 py-2 text-xs font-black uppercase tracking-widest',
  md: 'px-6 py-3 text-sm font-black uppercase tracking-widest',
  lg: 'px-10 py-5 text-base font-black uppercase tracking-widest',
  icon: 'p-3',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  isDisabled = false,
  icon: Icon,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      disabled={isDisabled || isLoading}
      className={`
        relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-sm)] font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-strong)]/20 disabled:cursor-not-allowed disabled:opacity-60
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <svg className="h-4 w-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : 18} />}
          {children}
        </>
      )}
    </motion.button>
  );
}
