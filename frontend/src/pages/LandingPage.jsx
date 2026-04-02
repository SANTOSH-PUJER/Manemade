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

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-32 pb-32 pt-24 lg:pt-12 overflow-hidden">
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
        <PopularCarousel dishes={(menuItems || []).slice(0, 8)} />
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
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--text-primary)] p-12 text-center text-[var(--surface)] lg:p-24"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-strong)]/20 to-transparent" />
        <div className="relative space-y-8">
          <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl">
            Ready to taste excellence?
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-medium text-white/70">
            Join thousands of foodies who enjoy authentic North Karnataka flavors delivered with love and precision.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/shop')} className="px-12 py-6 text-lg">
              Order Online Now
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 px-12 py-6 text-lg text-white hover:bg-white/10" onClick={() => navigate('/register')}>
              Join as a Member
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default LandingPage;

