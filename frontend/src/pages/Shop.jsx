import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FiltersSidebar from '../components/shop/FiltersSidebar';
import DishCard from '../components/ui/DishCard';
import Skeleton from '../components/ui/Skeleton';
import useMenuData from '../hooks/useMenuData';

function Shop() {
  const location = useLocation();
  const { menuItems, categoryNames, loading, error } = useMenuData();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceLimit, setPriceLimit] = useState(500);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'All';
    setQuery(search);
    setActiveCategory(category);
  }, [location.search]);

  const filteredDishes = useMemo(
    () =>
      menuItems.filter((dish) => {
        const matchesQuery = query.trim().length === 0 || `${dish.name} ${dish.description} ${dish.category}`.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = activeCategory === 'All' || dish.category === activeCategory;
        const matchesPrice = dish.price <= priceLimit;
        const matchesRating = dish.rating >= minRating;
        return matchesQuery && matchesCategory && matchesPrice && matchesRating;
      }),
    [activeCategory, menuItems, minRating, priceLimit, query],
  );

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-16 pb-32">
      {/* Header Section */}
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-3">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-strong)]">Our Menu</p>
        </div>
        <h1 className="font-display text-5xl font-black tracking-tight sm:text-6xl max-w-4xl">
          A simpler homemade menu, curated for <span className="text-[var(--accent-strong)]">daily comfort.</span>
        </h1>
        <p className="max-w-2xl text-lg font-medium leading-relaxed text-[var(--text-muted)]">
          Browse jolada rotti, stuffed ennegayi, fresh chutneys, and classic Karnataka snacks without the clutter of larger meal-style categories.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Sidebar Filters */}
        <FiltersSidebar
          categories={categoryNames}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          priceLimit={priceLimit}
          onPriceLimitChange={setPriceLimit}
          minRating={minRating}
          onMinRatingChange={setMinRating}
        />

        {/* Content Section */}
        <section className="space-y-8">
           {error && !loading && (
             <div className="rounded-[var(--radius-md)] border border-rose-500/20 bg-rose-500/5 px-6 py-4 text-sm font-bold text-rose-500 shadow-sm backdrop-blur-xl mb-8">
               {error}
             </div>
           )}

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 dark:border-white/5 pb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight">{loading ? 'Loading...' : `${filteredDishes.length} artisanal dishes`}</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Showing based on your current filters</p>
            </div>
            
            <div className="flex items-center gap-3 rounded-full border border-black/5 bg-white px-4 py-2 text-xs font-bold text-[var(--text-secondary)] shadow-sm dark:bg-white/5">
              Sort by: <span className="text-[var(--accent-strong)] cursor-pointer">Default</span>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton height="h-[240px]" className="rounded-[var(--radius-lg)]" />
                  <Skeleton width="w-3/4" height="h-6" />
                  <Skeleton width="w-1/2" height="h-4" />
                </div>
              ))}
            </div>
          ) : filteredDishes.length > 0 ? (
            <motion.div 
               layout
               className="grid gap-8 md:grid-cols-2 2xl:grid-cols-3"
            >
              {filteredDishes.map((dish) => (
                <motion.div key={dish.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <DishCard dish={dish} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border-2 border-dashed border-black/5 bg-black/2 px-10 py-32 text-center dark:border-white/5 dark:bg-white/2"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--text-muted)]">
                 <svg size={40} className="stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
              </div>
              <h3 className="font-display text-3xl font-black tracking-tight">No flavors match your search.</h3>
              <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-[var(--text-muted)]">
                Try widening your price limit or clearing specific filters to see more of our delicious creations.
              </p>
              <button 
                onClick={() => {
                  setActiveCategory('All');
                  setPriceLimit(500);
                  setMinRating(0);
                  setQuery('');
                }}
                className="mt-8 text-sm font-black uppercase tracking-widest text-[var(--accent-strong)] hover:underline"
              >
                Reset all filters
              </button>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Shop;

