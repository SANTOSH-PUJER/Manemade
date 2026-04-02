import { motion } from 'framer-motion';
import { Check, Clock, Info, Leaf, Plus, Minus, Share2, Star, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import DishCard from '../components/ui/DishCard';
import Skeleton from '../components/ui/Skeleton';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import useMenuData from '../hooks/useMenuData';
import { itemService } from '../services/dataService';

function FoodDetails() {
  const { slug } = useParams();
  const { menuItems } = useMenuData();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    const loadDish = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const response = await itemService.getBySlug(slug);
        if (cancelled) return;
        const item = response.data;
        setDish({
          ...item,
          category: item.categoryName,
          rating: item.rating ?? 4.5,
          reviews: item.reviewCount ?? 0,
          type: item.isVeg === false ? 'non-veg' : 'veg',
          deliveryTime: `${item.deliveryTimeMinutes || 25} mins`,
          ingredients: item.ingredients || [],
          tags: item.tags || [],
          highlight: item.highlight || item.description,
        });
      } catch (error) {
        if (cancelled) return;
        if (error.response?.status === 404) setNotFound(true);
        else showToast({ title: 'Error', description: 'Could not load dish details.' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadDish();
    return () => { cancelled = true; };
  }, [showToast, slug]);

  const relatedDishes = useMemo(() => 
    menuItems.filter((item) => item.category === dish?.category && item.slug !== slug).slice(0, 4),
    [dish, menuItems, slug]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-24 pb-32 space-y-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <Skeleton height="h-[600px]" className="rounded-[var(--radius-xl)]" />
          <div className="space-y-8">
            <Skeleton width="w-1/4" height="h-8" />
            <Skeleton width="w-3/4" height="h-16" />
            <Skeleton height="h-32" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton height="h-20" />
              <Skeleton height="h-20" />
              <Skeleton height="h-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) return <Navigate to="/shop" replace />;
  if (!dish) return <div className="text-center py-32 font-display text-2xl font-black">Dish not found</div>;

  const handleAddToCart = async () => {
    try {
      await addToCart(dish, quantity);
      showToast({ 
        title: 'Basket updated', 
        description: `${quantity}x ${dish.name} added.`,
        tone: 'success' 
      });
    } catch (error) {
      showToast({ title: 'Error', description: 'Failed to add item to basket.' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-24 pb-32 overflow-hidden">
      {/* Top Navigation / Breadcrumbs could go here */}

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group"
        >
          <div className="sticky top-28 overflow-hidden rounded-[var(--radius-xl)] border-[10px] border-white bg-white shadow-[var(--shadow-strong)] dark:border-white/5">
            <img src={dish.image} alt={dish.name} className="h-[600px] w-full object-cover transition-transform duration-700 hover:scale-105" />
            
            {/* Badges on Image */}
            <div className="absolute left-8 top-8 flex flex-col gap-3">
              <Badge variant="primary" className="shadow-2xl">Featured</Badge>
              {dish.type === 'veg' && (
                <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-xl backdrop-blur-md">
                   <Leaf size={12} fill="currentColor" />
                   Pure Veg
                </div>
              )}
            </div>

            <button className="absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-xl backdrop-blur-md transition-transform hover:scale-110 active:scale-95">
              <Share2 size={20} />
            </button>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col space-y-10 py-6"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {dish.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-[var(--surface-muted)] text-[var(--text-muted)]">{tag}</Badge>
              ))}
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-strong)]">{dish.category}</p>
            <h1 className="font-display text-5xl font-black tracking-tight sm:text-6xl">{dish.name}</h1>
            <p className="text-lg font-medium leading-relaxed text-[var(--text-secondary)]">{dish.description}</p>
          </div>

          <div className="flex flex-wrap gap-8 py-8 border-y border-black/5 dark:border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Rating</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(dish.rating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="text-sm font-black text-[var(--text-primary)]">{dish.rating}</span>
                <span className="text-xs font-bold text-[var(--text-muted)]">({dish.reviews} reviews)</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Delivery</p>
              <div className="flex items-center gap-2 text-sm font-black text-[var(--text-primary)]">
                <Truck size={18} className="text-[var(--accent-strong)]" />
                {dish.deliveryTime}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Category</p>
              <div className="flex items-center gap-2 text-sm font-black text-[var(--text-primary)]">
                <Check size={18} className="text-emerald-500" strokeWidth={3} />
                Freshly Made
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Key Ingredients</h3>
            <div className="flex flex-wrap gap-3 text-sm font-bold text-[var(--text-secondary)]">
              {dish.ingredients.map(ing => (
                <div key={ing} className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-black/5 bg-[var(--surface)] px-4 py-3 shadow-sm dark:border-white/5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-strong)]" />
                  {ing}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
             <div className="rounded-[var(--radius-lg)] bg-[var(--surface-muted)] p-6 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-strong)]/10 text-[var(--accent-strong)]">
                  <Info size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Kitchen Note</h4>
                  <p className="text-sm font-medium leading-relaxed text-[var(--text-secondary)]">{dish.highlight}</p>
                </div>
             </div>
          </div>

          {/* Action Footer */}
          <div className="sticky bottom-8 z-20 mt-auto flex flex-col gap-6 rounded-[var(--radius-xl)] bg-[var(--surface)]/80 p-6 shadow-[var(--shadow-strong)] backdrop-blur-2xl border border-black/5 dark:border-white/5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Total Price</p>
              <p className="text-4xl font-black text-[var(--accent-strong)]">₹{dish.price * quantity}</p>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Quantity Control */}
               <div className="flex items-center gap-1 rounded-full border border-black/5 bg-black/5 p-1 dark:border-white/5">
                 <button 
                   onClick={() => setQuantity(q => Math.max(1, q - 1))}
                   className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-sm transition-all active:scale-90 hover:bg-[var(--surface-muted)]"
                 >
                   <Minus size={18} strokeWidth={3} />
                 </button>
                 <span className="w-12 text-center text-lg font-black">{quantity}</span>
                 <button 
                   onClick={() => setQuantity(q => q + 1)}
                   className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-sm transition-all active:scale-90 hover:bg-[var(--surface-muted)]"
                 >
                   <Plus size={18} strokeWidth={3} />
                 </button>
               </div>

               <Button size="lg" className="px-10 py-6 text-lg shadow-xl" onClick={handleAddToCart}>
                 Add to Basket
               </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Section */}
      {relatedDishes.length > 0 && (
        <section className="mt-32 space-y-10">
          <div className="space-y-2">
             <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-strong)]">You may also love</p>
                        <h2 className="font-display text-4xl font-black tracking-tight">More homemade picks</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
             {relatedDishes.map(item => (
               <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <DishCard dish={item} />
               </motion.div>
             ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default FoodDetails;

