import { Filter, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FiltersSidebar({
  categories,
  activeCategorySlug,
  onCategoryChange,
  priceLimit,
  onPriceLimitChange,
  minRating,
  onMinRatingChange,
  isOpen,
  onClose
}) {
  const ratings = [4.5, 4.0, 3.5, 3.0];

  const content = (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-xl font-black tracking-tight uppercase">
          <Filter size={18} className="text-orange-600" strokeWidth={3} />
          Filters
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              onCategoryChange('All');
              onPriceLimitChange(1000);
              onMinRatingChange(0);
            }}
            className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:underline"
          >
            Clear All
          </button>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Artisanal Group</p>
        <div className="flex flex-wrap gap-2">
          {[{ name: 'All', slug: 'All' }, ...categories].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                onCategoryChange(cat.slug);
                if (onClose) onClose();
              }}
              className={`
                rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300
                ${(activeCategorySlug || 'All') === cat.slug
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-black/5 text-[var(--text-secondary)] hover:bg-orange-500/5 hover:text-orange-600 dark:bg-white/5'}
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
          <span className="text-sm font-black text-orange-600">₹{priceLimit}</span>
        </div>
        <input
          type="range"
          min="10"
          max="1000"
          step="5"
          value={priceLimit}
          onChange={(e) => onPriceLimitChange(Number(e.target.value))}
          className="w-full accent-orange-600 cursor-pointer"
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
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-black/5 text-[var(--text-secondary)] hover:bg-orange-500/5 dark:bg-white/5 font-black uppercase tracking-widest'}
              `}
            >
              <Star size={12} fill={minRating === rate ? 'currentColor' : 'none'} className={minRating === rate ? 'text-black' : 'text-amber-500'} />
              {rate}+
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block sticky top-28 h-fit rounded-[var(--radius-lg)] border border-black/5 bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)] dark:border-white/5">
        {content}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-full max-w-[300px] bg-white p-8 shadow-2xl dark:bg-gray-900 lg:hidden overflow-y-auto"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
