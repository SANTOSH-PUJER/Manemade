import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FiltersSidebar from '../components/shop/FiltersSidebar';
import DishCard from '../components/ui/DishCard';
import Skeleton from '../components/ui/Skeleton';
import useMenuData from '../hooks/useMenuData';

function Shop() {
  const location = useLocation();
  const [activeCategorySlug, setActiveCategorySlug] = useState('');
  
  // Parse category slug from URL on mount and location change
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category') || '';
    setActiveCategorySlug(category === 'All' ? '' : category);
  }, [location.search]);
  // Fetch data dynamically using the category slug and search query
  const searchParamsValue = new URLSearchParams(location.search).get('q') || '';
  const { menuItems = [], menuCategories = [], loading, error } = useMenuData(activeCategorySlug, searchParamsValue);

  const [priceLimit, setPriceLimit] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Local filtering for price and rating (API handles Category and Search)
  const filteredDishes = useMemo(
    () =>
      menuItems.filter((dish) => {
        const matchesPrice = dish.price <= priceLimit;
        const matchesRating = dish.rating >= minRating;
        return matchesPrice && matchesRating;
      }),
    [menuItems, minRating, priceLimit],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 pt-12 lg:pt-16 pb-32 bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-500">
      {/* Header Section */}
      <div className="mb-8 lg:mb-12 space-y-4">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Curated Homemade Menu</p>
        </div>
        <h1 className="font-display text-4xl font-black tracking-tight sm:text-6xl max-w-4xl leading-tight">
           Purely <span className="text-orange-600">Homemade.</span> Perfectly <span className="italic">North Karnataka.</span>
        </h1>
        <p className="max-w-2xl text-base sm:text-lg font-bold leading-relaxed text-[var(--text-secondary)]">
          Explore our artisanal selection of rottis, spicy powders, and traditional sweets. Made to order in local family kitchens.
        </p>
      </div>

      <div className="grid gap-8 lg:gap-12 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Sidebar Filters */}
        <FiltersSidebar
          categories={(menuCategories || []).map(c => ({ name: c.name, slug: c.slug }))}
          activeCategorySlug={activeCategorySlug}
          onCategoryChange={(slug) => {
              const params = new URLSearchParams(location.search);
              if (slug && slug !== 'All') params.set('category', slug);
              else params.delete('category');
              window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
              setActiveCategorySlug(slug === 'All' ? '' : slug);
          }}
          priceLimit={priceLimit}
          onPriceLimitChange={setPriceLimit}
          minRating={minRating}
          onMinRatingChange={setMinRating}
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
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
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {loading ? 'Refreshing...' : `${filteredDishes.length} artisanal dishes`}
              </h2>
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
                  {activeCategorySlug ? `Exploring ${(menuCategories || []).find(c => c.slug === activeCategorySlug)?.name || 'Category'}` : 'Showing all homemade specialties'}
              </p>
            </div>
            
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex lg:hidden items-center justify-center gap-2 rounded-2xl bg-gray-100 px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-900 transition-all active:scale-95 dark:bg-gray-800 dark:text-white"
            >
              <Filter size={16} /> Filters
            </button>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton height="h-[240px]" className="rounded-[var(--radius-lg)]" />
                  <Skeleton width="w-3/4" height="h-6" />
                  <Skeleton width="w-1/2" height="h-4" />
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filteredDishes.length > 0 ? (
                <motion.div 
                   key={activeCategorySlug || 'all'}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.3 }}
                   className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                >
                  {filteredDishes.map((dish) => (
                    <DishCard key={dish.id} dish={dish} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border-2 border-dashed border-black/5 bg-black/2 px-6 sm:px-10 py-24 sm:py-32 text-center dark:border-white/5 dark:bg-white/2"
                >
                  <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">No flavors match your search.</h3>
                  <p className="mt-4 max-w-sm text-xs sm:text-sm font-bold leading-relaxed text-[var(--text-muted)]">
                    Try widening your filters to see more of our delicious creations.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </section>
      </div>
    </div>
  );
}

export default Shop;
