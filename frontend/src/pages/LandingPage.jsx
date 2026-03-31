import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryHighlights from '../components/home/CategoryHighlights';
import HeroSection from '../components/home/HeroSection';
import OffersSection from '../components/home/OffersSection';
import PopularCarousel from '../components/home/PopularCarousel';
import TestimonialsSection from '../components/home/TestimonialsSection';
import { categories, dishes, offers, stats, testimonials } from '../data/catalog';

function LandingPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const heroImage = dishes[0].image;

  const suggestions = useMemo(
    () =>
      dishes
        .map((dish) => dish.name)
        .filter((name) => name.toLowerCase().includes(query.toLowerCase()) && query.trim().length > 0),
    [query],
  );

  const handleSearch = () => {
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="space-y-20 pb-8">
      <HeroSection
        query={query}
        suggestions={suggestions}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        heroImage={heroImage}
        stats={stats}
      />
      <CategoryHighlights categories={categories} />
      <PopularCarousel dishes={dishes.slice(0, 6)} />
      <OffersSection offers={offers} />
      <TestimonialsSection testimonials={testimonials} />
    </div>
  );
}

export default LandingPage;
