import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
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
    <section className="space-y-10 py-20 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[var(--accent-strong)]/5 blur-[120px] -z-10" />

      <div className="flex items-end justify-between px-2">
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-strong)]">
            Most loved dishes
          </p>
          <h2 className="font-display text-4xl font-black tracking-tight">
            Popular Right Now
          </h2>
        </div>
        
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm"
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={20} strokeWidth={3} />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-8 overflow-x-auto scroll-smooth pb-12 pt-4 snap-x snap-mandatory"
      >
        {dishes.map((dish, i) => (
          <motion.div
            key={dish.slug}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="min-w-[320px] max-w-[320px] snap-center"
          >
            <Card className="group h-full flex flex-col hover:scale-[1.02] transition-all">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Veg Badge */}
                <div className="absolute left-4 top-4">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 bg-white/90 backdrop-blur-md shadow-sm ${dish.isVeg === false ? 'border-rose-500' : 'border-emerald-500'}`}>
                    <div className={`h-2 w-2 rounded-full ${dish.isVeg === false ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute right-4 top-4">
                  <Badge variant="primary" className="bg-white/90 text-black border border-black/5 flex items-center gap-1 shadow-md">
                    <Star size={10} strokeWidth={3} fill="currentColor" fillOpacity={1} />
                    {dish.rating}
                  </Badge>
                </div>
              </div>

              <Card.Content className="flex flex-1 flex-col p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="line-clamp-1 text-lg font-black tracking-tight text-[var(--text-primary)]">
                    {dish.name}
                  </h3>
                  <p className="line-clamp-2 text-sm font-medium leading-relaxed text-[var(--text-muted)]">
                    {dish.description}
                  </p>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-[var(--accent-strong)]">
                    ₹{dish.price}
                  </span>
                  <Link to={`/dish/${dish.slug}`}>
                    <Button variant="outline" size="sm" className="font-bold border-2">
                       Options
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
