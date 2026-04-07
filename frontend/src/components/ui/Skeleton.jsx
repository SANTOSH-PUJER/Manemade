export default function Skeleton({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4',
  variant = 'rectangular' 
}) {
  const rounded = variant === 'circular' ? 'rounded-full' : 'rounded-2xl';
  
  return (
    <div
      className={`skeleton ${rounded} ${width} ${height} ${className} opacity-40 dark:opacity-10`}
    />
  );
}
