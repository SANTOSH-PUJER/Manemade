import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Star, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import QuantitySelector from '../components/ui/QuantitySelector';
import SectionHeading from '../components/ui/SectionHeading';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { dishes, findDishBySlug, testimonials } from '../data/catalog';

function FoodDetails() {
  const { slug } = useParams();
  const dish = findDishBySlug(slug);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const relatedDishes = useMemo(
    () => dishes.filter((item) => item.category === dish?.category && item.id !== dish?.id).slice(0, 3),
    [dish],
  );

  if (!dish) {
    return <Navigate to="/shop" replace />;
  }

  const handleAddToCart = () => {
    addToCart(dish, quantity);
    showToast({
      title: 'Added to cart',
      description: `${quantity} x ${dish.name} is ready for checkout.`,
      tone: 'success',
    });
  };

  return (
    <div className="space-y-12">
      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="overflow-hidden rounded-[40px] border border-white/10 bg-white/70 p-3 shadow-[var(--shadow-strong)] dark:bg-white/5">
          <img src={dish.image} alt={dish.name} className="h-full min-h-[420px] w-full rounded-[30px] object-cover" />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 rounded-[40px] border border-white/10 bg-white/70 p-8 shadow-[var(--shadow-soft)] dark:bg-white/5">
          <div className="flex flex-wrap gap-3">
            {dish.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">
                {tag}
              </span>
            ))}
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-muted)]">{dish.category}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{dish.name}</h1>
            <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">{dish.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="detail-stat-card"><Star size={16} className="fill-current text-amber-400" /><div><p className="font-semibold">{dish.rating} rating</p><p className="text-xs text-[var(--text-muted)]">{dish.reviews} reviews</p></div></div>
            <div className="detail-stat-card"><Truck size={16} className="text-[var(--accent-strong)]" /><div><p className="font-semibold">{dish.deliveryTime}</p><p className="text-xs text-[var(--text-muted)]">Estimated delivery</p></div></div>
            <div className="detail-stat-card"><Leaf size={16} className="text-emerald-500" /><div><p className="font-semibold">{dish.type}</p><p className="text-xs text-[var(--text-muted)]">Dietary label</p></div></div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[var(--surface-muted)] p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">Ingredients</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {dish.ingredients.map((ingredient) => <span key={ingredient} className="rounded-full bg-white/70 px-4 py-2 text-sm dark:bg-white/10">{ingredient}</span>)}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[var(--surface-muted)] p-5">
            <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-[var(--accent-strong)]" /><p className="font-medium">{dish.highlight}</p></div>
          </div>

          <div className="flex flex-col gap-4 rounded-[30px] border border-white/10 bg-white/75 p-5 shadow-[var(--shadow-soft)] dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-muted)]">Price</p>
              <p className="text-3xl font-semibold">Rs. {dish.price}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <QuantitySelector quantity={quantity} onDecrease={() => setQuantity((current) => Math.max(1, current - 1))} onIncrease={() => setQuantity((current) => current + 1)} />
              <button type="button" onClick={handleAddToCart} className="rounded-full bg-[var(--accent-gradient)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5">Add to Cart</button>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-5 rounded-[34px] border border-white/10 bg-white/70 p-8 shadow-[var(--shadow-soft)] dark:bg-white/5">
          <SectionHeading eyebrow="Reviews" title="Guest feedback" description="The reviews section gives the details page a stronger production feel without adding noisy layouts." />
          {testimonials.slice(0, 2).map((review) => (
            <article key={review.name} className="rounded-[24px] bg-[var(--surface-muted)] p-5">
              <p className="text-sm leading-7 text-[var(--text-secondary)]">"{review.quote}"</p>
              <p className="mt-4 font-semibold">{review.name}</p>
              <p className="text-sm text-[var(--text-muted)]">{review.role}</p>
            </article>
          ))}
        </div>

        <div className="space-y-5 rounded-[34px] border border-white/10 bg-white/70 p-8 shadow-[var(--shadow-soft)] dark:bg-white/5">
          <SectionHeading eyebrow="You may also like" title="Related dishes" description="Cross-sell recommendations carry the same card language used in the main listing page." />
          <div className="grid gap-4">
            {relatedDishes.map((item) => (
              <div key={item.id} className="rounded-[24px] bg-[var(--surface-muted)] p-4">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="h-24 w-24 rounded-[20px] object-cover" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Rs. {item.price}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{item.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default FoodDetails;
