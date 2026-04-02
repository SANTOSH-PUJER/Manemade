export default function Skeleton({
  variant = 'rectangular',
  width = 'w-full',
  height = 'h-4',
  className = '',
  ...props
}) {
  const rounded = variant === 'circular' ? 'rounded-full' : 'rounded-[var(--radius-sm)]';
  return (
    <div
      className={`
        relative overflow-hidden bg-[var(--surface-muted)]
        ${rounded}
        ${width}
        ${height}
        ${className}
      `}
      {...props}
    >
      <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/5 animate-[shimmer_1.5s_infinite]" />
    </div>
  );
}
