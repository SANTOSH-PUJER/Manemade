import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CategoryHighlights({ categories }) {
  return (
    <section className="space-y-10">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-strong)]">
            Explore by category
          </p>
          <h2 className="font-display text-4xl font-black tracking-tight">
            Curated Collections
          </h2>
        </div>
        <Link
          to="/shop"
          className="group flex items-center gap-2 text-sm font-bold text-[var(--accent-strong)] transition-all hover:gap-3"
        >
          View full menu
          <ChevronRight size={16} strokeWidth={3} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
        {categories.slice(0, 4).map((category, i) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative block overflow-hidden rounded-[var(--radius-lg)] aspect-[4/5] bg-[var(--surface-muted)] shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-strong)]"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {category.name}
                </h3>
                <p className="text-xs font-semibold text-white/70 line-clamp-1">
                  {category.subtitle}
                </p>
              </div>

              {/* Hover Overlay Icon */}
              <div className="absolute right-6 top-6 flex h-10 w-10 scale-0 items-center justify-center rounded-full bg-white text-[var(--accent-strong)] shadow-xl transition-transform duration-300 group-hover:scale-100">
                <ChevronRight size={20} strokeWidth={3} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
