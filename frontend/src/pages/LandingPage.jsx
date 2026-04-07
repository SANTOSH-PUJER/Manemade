import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryHighlights from '../components/home/CategoryHighlights';
import HeroSection from '../components/home/HeroSection';
import OffersSection from '../components/home/OffersSection';
import PopularCarousel from '../components/home/PopularCarousel';
import TestimonialsSection from '../components/home/TestimonialsSection';
import Button from '../components/ui/Button';
import useMenuData from '../hooks/useMenuData';

function LandingPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { menuItems = [], menuCategories = [], loading, error } = useMenuData();
  const heroImage = menuItems?.[0]?.image;

  const suggestions = useMemo(
    () =>
      (menuItems || [])
        .map((dish) => dish.name)
        .filter((name) => name.toLowerCase().includes(query.toLowerCase()) && query.trim().length > 0),
    [menuItems, query],
  );

  const stats = useMemo(() => {
    const items = menuItems || [];
    const categories = menuCategories || [];
    const averageRating = items.length
      ? (items.reduce((total, item) => total + (item.rating || 0), 0) / items.length).toFixed(1)
      : '0.0';

    return [
      { label: 'Live categories', value: `${categories.length}` },
      { label: 'Regional dishes', value: `${items.length}` },
      { label: 'Average rating', value: averageRating },
    ];
  }, [menuCategories, menuItems]);

  const offers = useMemo(
    () =>
      (menuCategories || []).slice(0, 2).map((category, index) => ({
        title: `Explore ${category.name}`,
        description: category.description || `Discover chef-made dishes across ${category.name.toLowerCase()}.`,
        badge: index === 0 ? 'Featured' : 'Fresh Pick',
      })),
    [menuCategories],
  );

  const testimonials = useMemo(
    () =>
      (menuItems || []).slice(0, 3).map((item) => ({
        name: item.name,
        role: item.category,
        quote: item.highlight || item.description,
      })),
    [menuItems],
  );

  const popularDishes = useMemo(() => {
    const highlightNames = [
      'Jolada Rotti',
      'Ragi Rotti',
      'Dharwad Peda',
      'Kodubale',
      'Nippattu',
      'Groundnut Chikki'
    ];
    
    // Find items matching the names in the specific order
    const highlights = highlightNames
      .map(name => (menuItems || []).find(item => item.name === name))
      .filter(Boolean);
      
    // If we have at least some highlights, use them; otherwise fall back to first 8
    return highlights.length > 0 ? highlights : (menuItems || []).slice(0, 8);
  }, [menuItems]);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-32 pb-32 pt-24 lg:pt-12 overflow-hidden bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-500">
      {error && !loading && (
        <div className="rounded-[var(--radius-md)] border border-rose-500/20 bg-rose-500/5 px-6 py-4 text-sm font-bold text-rose-500 shadow-sm backdrop-blur-xl">
          {error}
        </div>
      )}
      
      <HeroSection 
        query={query} 
        suggestions={suggestions} 
        onQueryChange={setQuery} 
        onSearch={handleSearch} 
        heroImage={heroImage} 
        stats={stats} 
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <CategoryHighlights categories={menuCategories || []} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <PopularCarousel dishes={popularDishes} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <OffersSection offers={offers} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <TestimonialsSection testimonials={testimonials} />
      </motion.div>

      {/* Final CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gray-900 p-16 text-center text-white lg:p-32 dark:bg-white dark:text-black"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--accent-primary),_transparent_40%)] opacity-20" />
        <div className="relative space-y-10">
          <h2 className="font-display text-5xl font-black tracking-tight sm:text-7xl">
            Ready to taste excellence?
          </h2>
          <p className="mx-auto max-w-2xl text-xl font-semibold opacity-70">
            Join thousands of foodies who enjoy authentic North Karnataka flavors delivered with love and precision.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" onClick={() => navigate('/shop')} className="px-16 py-7 text-lg shadow-2xl shadow-[var(--accent-primary)]/20 hover:scale-105">
              Order Online Now
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 px-16 py-7 text-lg text-white hover:bg-white/10 dark:border-black/20 dark:text-black dark:hover:bg-black/5" onClick={() => navigate('/register')}>
              Join as a Member
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default LandingPage;

