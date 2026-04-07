import { Filter, Star } from 'lucide-react';

export default function FiltersSidebar({
  categories, // now objects: [{name, slug}, ...]
  activeCategorySlug,
  onCategoryChange,
  priceLimit,
  onPriceLimitChange,
  minRating,
  onMinRatingChange,
}) {
  const ratings = [4.5, 4.0, 3.5, 3.0];

  return (
    <aside className="sticky top-28 h-fit space-y-10 rounded-[var(--radius-lg)] border border-black/5 bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)] dark:border-white/5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-xl font-black tracking-tight uppercase">
          <Filter size={18} className="text-[var(--accent-strong)]" strokeWidth={3} />
          Filters
        </h3>
        <button
          onClick={() => {
            onCategoryChange('All');
            onPriceLimitChange(500);
            onMinRatingChange(0);
          }}
          className="text-xs font-bold text-[var(--accent-strong)] hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Artisanal Group</p>
        <div className="flex flex-wrap gap-2">
          {[{ name: 'All', slug: 'All' }, ...categories].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onCategoryChange(cat.slug)}
              className={`
                rounded-full px-4 py-2 text-xs font-bold transition-all duration-300
                ${(activeCategorySlug || 'All') === cat.slug
                  ? 'bg-[var(--accent-strong)] text-white shadow-md'
                  : 'bg-black/5 text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)] dark:bg-white/5'}
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Max Price</p>
          <span className="text-sm font-black text-[var(--accent-strong)]">₹{priceLimit}</span>
        </div>
        <input
          type="range"
          min="10"
          max="1000"
          step="5"
          value={priceLimit}
          onChange={(e) => onPriceLimitChange(Number(e.target.value))}
          className="w-full accent-[var(--accent-strong)] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-bold text-gray-400">
           <span>₹10</span>
           <span>₹1000+</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Minimum Rating</p>
        <div className="grid grid-cols-2 gap-2">
          {ratings.map((rate) => (
            <button
              key={rate}
              onClick={() => onMinRatingChange(rate)}
              className={`
                flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-bold transition-all duration-300
                ${minRating === rate
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 shadow-amber-500/10'
                  : 'bg-black/5 text-[var(--text-secondary)] hover:bg-[var(--surface-glass)] dark:bg-white/5'}
              `}
            >
              <Star size={12} fill={minRating === rate ? 'currentColor' : 'none'} />
              {rate}+
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
