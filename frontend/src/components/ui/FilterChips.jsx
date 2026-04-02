import { motion } from 'framer-motion';
import { Check, Filter, Star, X } from 'lucide-react';
import Badge from './Badge';

export default function FilterChips({ 
  currentFilter, 
  onFilterChange, 
  categories, 
  onCategoryChange,
  activeCategory,
  onReset
}) {
  const filters = [
    { label: 'Veg', value: 'veg' },
    { label: 'Non-veg', value: 'non-veg' },
    { label: 'Top Rated', value: 'top-rated' },
    { label: 'Best Sellers', value: 'bestseller' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[var(--accent-strong)]">
          <Filter size={14} strokeWidth={3} />
          Filters
        </h4>
        <button
          onClick={onReset}
          className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--accent-strong)] transition-colors"
        >
          Reset All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value === currentFilter ? '' : f.value)}
            className={`
              inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all duration-300
              ${currentFilter === f.value
                ? 'bg-[var(--accent-strong)] text-white shadow-lg shadow-[var(--accent-strong)]/20'
                : 'border border-black/5 bg-white text-[var(--text-secondary)] hover:border-[var(--accent-strong)]/30 hover:bg-[var(--surface-muted)]'}
            `}
          >
            {currentFilter === f.value && <Check size={12} strokeWidth={4} />}
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
         <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
           Categories
         </h4>
         <div className="grid grid-cols-1 gap-1">
           {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => onCategoryChange(cat === activeCategory ? '' : cat)}
               className={`
                 group flex items-center justify-between rounded-[var(--radius-sm)] px-4 py-3 text-sm font-semibold transition-all duration-300
                 ${activeCategory === cat
                   ? 'bg-[var(--accent-soft)] text-[var(--accent-strong)]'
                   : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'}
               `}
             >
               {cat}
               {activeCategory === cat && <Check size={14} strokeWidth={3} />}
             </button>
           ))}
         </div>
      </div>
    </div>
  );
}
