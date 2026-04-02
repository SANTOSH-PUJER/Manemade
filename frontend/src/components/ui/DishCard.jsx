import { motion } from 'framer-motion';
import { ShoppingBag, Star, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import Button from './Button';
import Card from './Card';

export default function DishCard({ dish }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(dish);
    showToast({
      title: 'Added to cart',
      description: `${dish.name} is now in your basket.`,
    });
  };

  return (
    <Card className="flex flex-col h-full group" isHoverable={true}>
      <Link to={`/dish/${dish.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <div className={`p-1 rounded-md border-2 bg-white/90 backdrop-blur-md shadow-sm ${dish.type === 'non-veg' ? 'border-rose-500' : 'border-emerald-500'}`}>
            <div className={`h-2.5 w-2.5 rounded-full ${dish.type === 'non-veg' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          </div>
          {dish.isBestSeller && (
            <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-tighter">
              Bestseller
            </span>
          )}
        </div>

        <div className="absolute right-4 top-4">
          <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-black shadow-lg backdrop-blur-md border border-black/5">
            <Star size={12} fill="#ffb800" stroke="#ffb800" />
            {dish.rating}
          </div>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
           <Button 
             className="w-full shadow-2xl" 
             onClick={handleAddToCart}
             icon={ShoppingBag}
           >
             Quick Add
           </Button>
        </div>
      </Link>

      <Card.Content className="flex flex-1 flex-col p-5 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="line-clamp-1 flex-1 font-display text-lg font-black tracking-tight group-hover:text-[var(--accent-strong)] transition-colors">
              {dish.name}
            </h3>
            <span className="text-lg font-black text-[var(--accent-strong)] shrink-0">
              ₹{dish.price}
            </span>
          </div>
          <p className="line-clamp-2 text-xs font-medium leading-relaxed text-[var(--text-muted)]">
            {dish.description}
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <Timer size={14} className="text-[var(--accent-strong)]" />
            {dish.deliveryTime}
          </div>
          <div className="h-1 w-1 rounded-full bg-[var(--text-muted)] opacity-30" />
          <div className="truncate flex-1">
            {dish.category}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
