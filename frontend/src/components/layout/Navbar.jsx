import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, PackageCheck, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/shop' },
  { label: 'Orders', to: '/orders' },
];

function Navbar() {
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userName = user?.firstName || 'Guest';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? 'border-b border-black/5 bg-white py-3 shadow-lg dark:border-white/5 dark:bg-[#111827]'
          : 'bg-transparent py-5'
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 lg:px-12">
        <div className="flex min-w-0 items-center">
          <Link to="/" className="group flex items-center transition-all duration-300 ml-2">
            <div className="relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img 
                src="/images/ManeMade-logo.png" 
                alt="Manemade Logo" 
                className="h-10 w-auto object-contain sm:h-12"
              />
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-2 rounded-full border border-black/6 bg-[var(--surface-glass)] px-2 py-1.5 shadow-[var(--shadow-soft)] dark:border-white/8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300
                ${isActive
                  ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-soft)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Link
            to={isAuthenticated ? '/checkout' : '/login'}
            className="group relative flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border border-black/8 bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition-all hover:border-[var(--accent-strong)]/30 hover:shadow-[var(--shadow-strong)] dark:border-white/8"
            aria-label="Cart"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent-strong)] px-1 text-[10px] font-bold text-white shadow-lg shadow-[var(--accent-strong)]/30 group-hover:scale-110 transition-transform">
                {cartCount}
              </span>
            )}
          </Link>

          {!isAuthenticated ? (
            <div className="hidden sm:flex gap-2">
              <Button variant="ghost" size="md" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="primary" size="md" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-black/8 bg-[var(--surface)] px-2 py-2 pr-4 shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-strong)] dark:border-white/8 active:scale-95"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-gradient)] text-sm font-black uppercase text-white shadow-[var(--shadow-soft)] overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    userName[0]
                  )}
                </div>
                <div className="hidden min-w-0 text-left md:block">
                  <p className="max-w-[120px] truncate text-sm font-bold text-[var(--text-primary)]">{userName}</p>
                  <p className="max-w-[150px] truncate text-xs font-medium text-[var(--text-muted)]">{user?.email}</p>
                </div>
                <div className="h-8 w-px bg-black/8 dark:bg-white/10" />
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--text-secondary)]">
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 8 }}
                    className="absolute right-0 top-16 w-72 overflow-hidden rounded-[var(--radius-md)] border border-black/8 bg-[var(--surface-glass)] p-2 shadow-[var(--shadow-strong)] backdrop-blur-3xl dark:border-white/10"
                  >
                    <div className="mb-2 flex items-center gap-4 rounded-[var(--radius-sm)] bg-[var(--surface)] px-4 py-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-gradient)] text-sm font-black uppercase text-white overflow-hidden">
                        {user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          userName[0]
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[var(--text-primary)]">{userName}</p>
                        <p className="truncate text-xs font-medium text-[var(--text-muted)]">{user?.email}</p>
                      </div>
                    </div>

                    <Link to="/profile" className="nav-dropdown-item flex items-center gap-3">
                      <User size={18} />
                      Profile
                    </Link>
                    <Link to="/orders" className="nav-dropdown-item flex items-center gap-3">
                      <PackageCheck size={18} />
                      Orders
                    </Link>
                    <div className="my-2 border-t border-black/8 dark:border-white/10" />
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-4 py-3 text-sm font-semibold text-rose-500 transition-all hover:bg-rose-500/8"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
