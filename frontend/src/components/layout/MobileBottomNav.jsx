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
    <div className="fixed inset-x-0 bottom-6 z-40 px-6 lg:hidden">
      <nav className="mx-auto flex max-w-sm items-center justify-around overflow-hidden rounded-[var(--radius-xl)] border border-black/5 bg-[var(--surface-glass)]/90 px-4 py-3 shadow-[var(--shadow-strong)] backdrop-blur-2xl dark:border-white/5">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              relative flex flex-col items-center gap-1.5 px-4 py-1 transition-all duration-300
              ${isActive ? 'text-[var(--accent-strong)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="transition-all" />
                  {to === '/cart' && cartCount > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[var(--accent-strong)] px-1 text-[9px] font-bold text-white shadow-lg shadow-[var(--accent-strong)]/30">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold tracking-wider uppercase transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 h-0 w-0'}`}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabMobile"
                    className="absolute -bottom-1 h-1 w-1 rounded-full bg-[var(--accent-strong)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
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
