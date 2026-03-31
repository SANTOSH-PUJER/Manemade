import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FiltersSidebar from '../components/shop/FiltersSidebar';
import SectionHeading from '../components/ui/SectionHeading';
import SearchBar from '../components/ui/SearchBar';
import SkeletonCard from '../components/ui/SkeletonCard';
import DishCard from '../components/ui/DishCard';
import { dishes } from '../data/catalog';

function Shop() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [priceLimit, setPriceLimit] = useState(260);
  const [minRating, setMinRating] = useState(4.0);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 850);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('q') || '';
    setQuery(search);
  }, [location.search]);

  const categories = useMemo(() => [...new Set(dishes.map((dish) => dish.category))], []);

  const suggestions = useMemo(
    () =>
      dishes
        .map((dish) => dish.name)
        .filter((name) => name.toLowerCase().includes(query.toLowerCase()) && query.trim().length > 0),
    [query],
  );

  const filteredDishes = useMemo(
    () =>
      dishes.filter((dish) => {
        const matchesQuery =
          query.trim().length === 0 ||
          `${dish.name} ${dish.description} ${dish.category}`.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = activeCategory === 'All' || dish.category === activeCategory;
        const matchesType = activeType === 'All' || dish.type === activeType;
        const matchesPrice = dish.price <= priceLimit;
        const matchesRating = dish.rating >= minRating;
        return matchesQuery && matchesCategory && matchesType && matchesPrice && matchesRating;
      }),
    [activeCategory, activeType, minRating, priceLimit, query],
  );

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Food listing"
          title="An elevated menu browse with filters, suggestions, and clear hierarchy"
          description="The listing screen is now a production-ready shopping surface with search, type filtering, price controls, ratings, and responsive cards."
        />
        <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} suggestions={suggestions} />
      </div>

      <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
        <FiltersSidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeType={activeType}
          onTypeChange={setActiveType}
          priceLimit={priceLimit}
          onPriceLimitChange={setPriceLimit}
          minRating={minRating}
          onMinRatingChange={setMinRating}
        />

        <section className="space-y-6">
          <div className="flex flex-col gap-3 rounded-[32px] border border-white/10 bg-white/65 p-5 shadow-[var(--shadow-soft)] dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">Menu results</p>
              <h3 className="mt-2 font-display text-2xl font-semibold">{loading ? 'Loading dishes...' : `${filteredDishes.length} dishes available`}</h3>
            </div>
            <p className="max-w-lg text-sm leading-6 text-[var(--text-secondary)]">
              Hover interactions, soft depth, and large imagery help each dish feel tactile and premium.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
            </div>
          ) : filteredDishes.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {filteredDishes.map((dish) => <DishCard key={dish.id} dish={dish} />)}
            </div>
          ) : (
            <div className="rounded-[32px] border border-dashed border-white/15 bg-white/55 p-10 text-center shadow-[var(--shadow-soft)] dark:bg-white/5">
              <h3 className="font-display text-3xl font-semibold">No dishes match this filter set</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Try widening the price cap, lowering the rating threshold, or clearing the current search.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Shop;
