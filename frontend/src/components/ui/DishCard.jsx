import { motion } from 'framer-motion';
import { ShoppingBag, Star, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import useAnalytics from '../../hooks/useAnalytics';
import Card from './Card';

export default function DishCard({ dish }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { trackEvent } = useAnalytics();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(dish);
    trackEvent('ADD_TO_CART', { itemId: dish.id, itemName: dish.name, price: dish.price });
    showToast({
      title: 'Added to cart',
      description: `${dish.name} is now in your basket.`,
      tone: 'success'
    });
  };

  const handleItemClick = () => {
    trackEvent('VIEW_ITEM', { itemId: dish.id, itemName: dish.name });
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={handleItemClick}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full"
    >
      <Card className="flex flex-col h-full group overflow-hidden border-black/5 bg-[var(--surface)] transition-shadow duration-300 hover:shadow-[var(--shadow-glow)] dark:border-white/5" radius="xl">
        <Link to={`/dish/${dish.slug}`} className="block relative aspect-[4/3] overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          


          {/* Type Badge */}
          <div className="absolute right-4 top-4 z-10 h-6 w-6 rounded-md border-2 bg-white/90 p-1 backdrop-blur-md dark:bg-black/50">
            <div className={`h-full w-full rounded-full ${dish.type === 'non-veg' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        <Card.Content className="flex flex-1 flex-col p-6 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="line-clamp-1 font-display text-xl font-black tracking-tight transition-colors group-hover:text-[var(--accent-primary)]">
                {dish.name}
              </h3>
              <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-black text-emerald-600 dark:bg-emerald-500/20">
                <Star size={10} fill="currentColor" stroke="none" />
                {dish.rating}
              </div>
            </div>
            <p className="line-clamp-2 text-xs font-bold leading-relaxed text-[var(--text-secondary)]">
              {dish.description}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between pt-4">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">Price</p>
              <p className="text-2xl font-black text-[var(--text-primary)]">₹{dish.price}</p>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/30 transition-all hover:scale-110 hover:bg-[var(--accent-hover)]"
            >
              <ShoppingBag size={20} strokeWidth={2.5} />
            </motion.button>
          </div>

          <div className="flex items-center gap-4 border-t border-black/5 pt-4 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] dark:border-white/5">
            <div className="flex items-center gap-1.5 font-black text-[var(--text-primary)]">
              <Timer size={14} className="text-[var(--accent-primary)]" />
              {dish.deliveryTime}
            </div>
            <div className="h-1 w-1 rounded-full bg-[var(--text-muted)] opacity-30" />
            <div className="truncate flex-1 font-black text-[var(--text-secondary)]">
              {dish.category}
            </div>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}
