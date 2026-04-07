import { motion } from 'framer-motion';
import { Home, ShoppingBag, User2, UtensilsCrossed } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const navItems = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: UtensilsCrossed, label: 'Menu', to: '/shop' },
  { icon: ShoppingBag, label: 'Cart', to: '/cart' },
  { icon: User2, label: 'Profile', to: '/profile' },
];

function MobileBottomNav() {
  const { cartCount } = useCart();

  return (
    <div className="fixed inset-x-0 bottom-8 z-50 px-8 lg:hidden">
      <nav className="mx-auto flex max-w-[340px] items-center justify-around overflow-hidden rounded-[var(--radius-xl)] border border-white/20 bg-white/70 px-2 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-2xl dark:border-white/10 dark:bg-black/60">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              relative flex flex-col items-center gap-1 px-5 py-2 transition-all duration-300
              ${isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="relative z-10 transition-transform duration-300 group-active:scale-90">
                  <Icon 
                    size={isActive ? 24 : 22} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={`transition-all ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,107,0,0.4)]' : ''}`} 
                  />
                  {to === '/cart' && cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-2.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent-primary)] px-1 text-[10px] font-black text-white shadow-lg"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </div>
                
                <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'mt-1 opacity-100' : 'h-0 opacity-0'}`}>
                  {label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 z-0 bg-[var(--accent-soft)] rounded-2xl"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default MobileBottomNav;
