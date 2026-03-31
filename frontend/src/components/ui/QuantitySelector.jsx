import { Minus, Plus } from 'lucide-react';

function QuantitySelector({ quantity, onDecrease, onIncrease, compact = false }) {
  return (
    <div className={`inline-flex items-center rounded-full border border-white/15 bg-white/70 shadow-[var(--shadow-soft)] dark:bg-white/5 ${compact ? 'gap-2 px-2 py-1' : 'gap-3 px-3 py-2'}`}>
      <button type="button" onClick={onDecrease} className="rounded-full bg-[var(--surface-muted)] p-1.5 text-[var(--text-primary)] transition hover:bg-[var(--accent-soft)]">
        <Minus size={14} />
      </button>
      <span className="min-w-5 text-center text-sm font-semibold">{quantity}</span>
      <button type="button" onClick={onIncrease} className="rounded-full bg-[var(--surface-muted)] p-1.5 text-[var(--text-primary)] transition hover:bg-[var(--accent-soft)]">
        <Plus size={14} />
      </button>
    </div>
  );
}

export default QuantitySelector;
