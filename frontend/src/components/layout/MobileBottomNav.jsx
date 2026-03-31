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
    <div className="fixed inset-x-0 bottom-4 z-40 px-4 lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-[28px] border border-white/15 bg-[var(--surface-glass)]/90 px-3 py-2 shadow-[var(--shadow-strong)] backdrop-blur-2xl">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex min-w-[70px] flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition ${
                isActive ? 'bg-white/80 text-[var(--text-primary)] dark:bg-white/10' : 'text-[var(--text-muted)]'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
            {to === '/cart' && cartCount > 0 && (
              <span className="absolute right-3 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent-strong)] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default MobileBottomNav;
