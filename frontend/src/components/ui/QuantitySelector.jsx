import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  className = '',
  size = 'md',
}) {
  const isSm = size === 'sm';
  
  return (
    <div className={`flex items-center gap-1 rounded-full border border-black/5 bg-black/5 p-1 dark:border-white/5 ${className}`}>
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className={`
          flex items-center justify-center rounded-full bg-white text-black shadow-sm transition-all active:scale-90 disabled:opacity-50
          ${isSm ? 'h-7 w-7' : 'h-9 w-9'}
        `}
      >
        <Minus size={isSm ? 14 : 16} strokeWidth={3} />
      </button>
      <span className={`text-center font-black ${isSm ? 'w-8 text-xs' : 'w-10 text-sm'}`}>
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className={`
          flex items-center justify-center rounded-full bg-white text-black shadow-sm transition-all active:scale-90
          ${isSm ? 'h-7 w-7' : 'h-9 w-9'}
        `}
      >
        <Plus size={isSm ? 14 : 16} strokeWidth={3} />
      </button>
    </div>
  );
}
