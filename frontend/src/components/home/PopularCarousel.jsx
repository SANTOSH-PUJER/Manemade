import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function PopularCarousel({ dishes }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-12 py-24 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[var(--accent-primary)]/5 blur-[120px] -z-10" />

      <div className="flex items-end justify-between px-2">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-primary)]">
            Most Loved Dishes
          </p>
          <h2 className="font-display text-5xl font-black tracking-tight">
            Popular Right Now
          </h2>
        </div>
        
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-md border-2"
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={22} strokeWidth={3} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-md border-2"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={22} strokeWidth={3} />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-10 overflow-x-auto scroll-smooth pb-16 pt-4 snap-x snap-mandatory px-2"
      >
        {dishes.map((dish, i) => (
          <motion.div
            key={dish.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="min-w-[340px] max-w-[340px] snap-center"
          >
            <Link to={`/dish/${dish.slug}`} className="block group h-full">
              <Card className="h-full flex flex-col border-[var(--border-light)] bg-[var(--surface)] transition-all duration-300 hover:shadow-[var(--shadow-lg)] group-hover:-translate-y-2" radius="xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Veg Badge */}
                  <div className="absolute left-6 top-6 z-10">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 bg-white/90 backdrop-blur-md shadow-sm dark:bg-black/50 ${dish.isVeg === false ? 'border-rose-500' : 'border-emerald-500'}`}>
                      <div className={`h-2.5 w-2.5 rounded-full ${dish.isVeg === false ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute right-6 top-6 z-10">
                    <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-black shadow-lg backdrop-blur-md dark:bg-black/50 dark:text-white">
                      <Star size={12} fill="#ffb800" stroke="#ffb800" />
                      {dish.rating}
                    </div>
                  </div>
                </div>

                <Card.Content className="flex flex-1 flex-col p-8 space-y-4">
                  <div className="space-y-2">
                    <h3 className="line-clamp-1 text-2xl font-black tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
                      {dish.name}
                    </h3>
                    <p className="line-clamp-2 text-sm font-bold leading-relaxed text-[var(--text-secondary)]">
                      {dish.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-black/5 dark:border-white/5">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Starting at</p>
                      <p className="text-3xl font-black text-[var(--accent-primary)]">₹{dish.price}</p>
                    </div>
                    <Button variant="primary" size="sm" className="h-12 w-12 rounded-full p-0 shadow-lg shadow-[var(--accent-primary)]/20">
                       <ChevronRight size={24} strokeWidth={3} />
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
