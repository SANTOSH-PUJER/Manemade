import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CategoryHighlights({ categories }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10); // 10px buffer
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="space-y-6 sm:space-y-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between px-2 gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-orange-500">
            Curated Collections
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight">
            Explore Categories
          </h2>
        </div>
        <Link
          to="/shop"
          className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)] transition-all hover:text-orange-500"
        >
          View all
          <ChevronRight size={14} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="relative group/slider">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`absolute -left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[var(--shadow-md)] transition-all dark:bg-gray-800 ${
            canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-0'
          } hover:scale-110 active:scale-95 group-hover/slider:translate-x-2 md:-left-6`}
          aria-label="Scroll Left"
        >
          <ChevronLeft size={24} strokeWidth={3} className="text-[var(--accent-primary)]" />
        </button>

        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`absolute -right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[var(--shadow-md)] transition-all dark:bg-gray-800 ${
            canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-0'
          } hover:scale-110 active:scale-95 group-hover/slider:-translate-x-2 md:-right-6`}
          aria-label="Scroll Right"
        >
          <ChevronRight size={24} strokeWidth={3} className="text-[var(--accent-primary)]" />
        </button>

        {/* Slider Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 pt-2"
        >
          {categories.map((category, i) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0 snap-start"
            >
              <Link
                to={`/shop?category=${encodeURIComponent(category.slug)}`}
                className="group relative flex h-[280px] w-[200px] flex-col overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-muted)] shadow-[var(--shadow-sm)] transition-all duration-500 hover:scale-[1.05] hover:shadow-[var(--shadow-lg)] dark:bg-gray-800 sm:h-[320px] sm:w-[240px]"
              >
                {/* Image Section */}
                <div className="relative h-full w-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-black tracking-tight transition-transform duration-300 group-hover:translate-y-[-4px]">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest opacity-0 transition-all duration-300 group-hover:opacity-70 group-hover:translate-y-[-4px]">
                      Explore Menu
                    </p>
                  </div>
                </div>
                
                {/* Accent Border on Hover */}
                <div className="absolute inset-0 rounded-[var(--radius-md)] border-2 border-transparent transition-colors duration-300 group-hover:border-[var(--accent-primary)]/30" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
