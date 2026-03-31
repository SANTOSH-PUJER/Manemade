import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

function DishCard({ dish }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    addToCart(dish);
    showToast({
      title: `${dish.name} added to cart`,
      description: 'Your order basket has been updated.',
      tone: 'success',
    });
  };

  return (
    <motion.article
      layout
      whileHover={{ y: -8, scale: 1.01 }}
      className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/70 shadow-[var(--shadow-soft)] backdrop-blur-xl transition dark:bg-white/5"
    >
      <Link to={`/dish/${dish.slug}`} className="block overflow-hidden">
        <div className="relative">
          <img src={dish.image} alt={dish.name} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur">
            {dish.category}
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">{dish.deliveryTime}</p>
            <Link to={`/dish/${dish.slug}`} className="mt-2 block font-display text-xl font-semibold">{dish.name}</Link>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-semibold">
            <Star size={14} className="fill-current text-amber-400" />
            {dish.rating}
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">{dish.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Price</p>
            <p className="text-2xl font-semibold">Rs. {dish.price}</p>
          </div>
          <button type="button" onClick={handleAddToCart} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-gradient)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5">
            <Plus size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default DishCard;
