import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ShoppingBag, UserCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { navLinks } from '../../data/catalog';
import ThemeToggle from '../ui/ThemeToggle';

function Navbar() {
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const userName = user?.firstName || 'Guest';

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[color:var(--surface-glass)]/80 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-gradient)] text-lg font-semibold text-white shadow-[var(--shadow-strong)]">M</div>
          <div>
            <p className="font-display text-xl font-semibold tracking-tight">Manemade</p>
            <p className="text-xs text-[var(--text-muted)]">Premium regional delivery</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/40 p-1.5 shadow-[var(--shadow-soft)] dark:bg-white/5 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `rounded-full px-5 py-2 text-sm font-medium transition ${isActive ? 'bg-[var(--text-primary)] text-[var(--surface)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Link to={isAuthenticated ? '/cart' : '/login'} className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/45 text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 dark:bg-white/5" aria-label="Cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--accent-strong)] px-1.5 py-0.5 text-[10px] font-bold text-white">{cartCount}</span>}
          </Link>

          <div className="relative hidden sm:block">
            <button type="button" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/45 px-4 py-2.5 text-sm font-medium shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 dark:bg-white/5" onClick={() => setIsProfileOpen((current) => !current)}>
              <UserCircle2 size={18} />
              <span>{userName}</span>
              <ChevronDown size={16} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-14 w-52 rounded-3xl border border-white/15 bg-[var(--surface)]/95 p-2 shadow-[var(--shadow-strong)] backdrop-blur-2xl">
                  {isAuthenticated ? (
                    <>
                      <Link className="nav-dropdown-item" to="/profile" onClick={() => setIsProfileOpen(false)}>Profile</Link>
                      <button type="button" className="nav-dropdown-item w-full text-left" onClick={() => { logout(); setIsProfileOpen(false); navigate('/'); }}>Logout</button>
                    </>
                  ) : (
                    <>
                      <Link className="nav-dropdown-item" to="/login" onClick={() => setIsProfileOpen(false)}>Login</Link>
                      <Link className="nav-dropdown-item" to="/register" onClick={() => setIsProfileOpen(false)}>Register</Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {!isAuthenticated && (
              <>
                <Link className="rounded-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]" to="/login">Login</Link>
                <Link className="rounded-full bg-[var(--accent-gradient)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-soft)]" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
