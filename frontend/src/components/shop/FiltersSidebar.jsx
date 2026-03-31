import { SlidersHorizontal } from 'lucide-react';
import FilterChips from '../ui/FilterChips';

function FiltersSidebar({ categories, activeCategory, onCategoryChange, activeType, onTypeChange, priceLimit, onPriceLimitChange, minRating, onMinRatingChange }) {
  return (
    <aside className="space-y-6 rounded-[32px] border border-white/10 bg-white/70 p-6 shadow-[var(--shadow-soft)] dark:bg-white/5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
          <SlidersHorizontal size={18} />
        </div>
        <div>
          <p className="font-semibold">Refine your menu</p>
          <p className="text-sm text-[var(--text-muted)]">Filter by taste, budget, and rating</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">Category</p>
        <FilterChips options={['All', ...categories]} active={activeCategory} onChange={onCategoryChange} />
      </div>

      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">Type</p>
        <FilterChips options={['All', 'veg', 'non-veg']} active={activeType} onChange={onTypeChange} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Max price</span>
          <span>Rs. {priceLimit}</span>
        </div>
        <input type="range" min="80" max="260" step="10" value={priceLimit} onChange={(event) => onPriceLimitChange(Number(event.target.value))} className="w-full accent-[var(--accent-strong)]" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Minimum rating</span>
          <span>{minRating.toFixed(1)}+</span>
        </div>
        <input type="range" min="4" max="5" step="0.1" value={minRating} onChange={(event) => onMinRatingChange(Number(event.target.value))} className="w-full accent-[var(--accent-strong)]" />
      </div>
    </aside>
  );
}

export default FiltersSidebar;
