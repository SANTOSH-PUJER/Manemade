import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, PackageCheck, ShoppingBag, User, Menu, X } from 'lucide-react';
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
  { label: 'About', to: '/about' },
];

function Navbar() {
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? 'border-b border-black/5 bg-white/80 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl dark:border-white/5 dark:bg-gray-900/80'
          : 'bg-transparent py-5 lg:py-6'
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 lg:px-12">
        <div className="flex min-w-0 items-center">
          <Link to="/" className="group flex items-center transition-all duration-300">
            <div className="relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img 
                src="/images/logo/ManeMade-logo.png" 
                alt="Manemade Logo" 
                className="h-10 w-auto object-contain sm:h-12"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 rounded-full border border-white/20 bg-[var(--surface-glass)] p-1.5 shadow-[var(--shadow-soft)] backdrop-blur-md dark:border-white/5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                rounded-full px-7 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300
                ${isActive
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 ring-2 ring-orange-500/20'
                  : 'text-[var(--text-secondary)] hover:text-orange-600 hover:bg-orange-500/5'
                }
              `}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <ThemeToggle />

          <Link
            to={isAuthenticated ? '/checkout' : '/login'}
            className="group relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-white/20 bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)] transition-all hover:scale-110 hover:border-orange-500/40 hover:shadow-[0_8px_20px_rgba(255,107,0,0.2)] dark:border-white/10"
            aria-label="Cart"
          >
            <ShoppingBag size={20} className="sm:size-[22px]" strokeWidth={2.5} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white shadow-lg shadow-orange-500/30 group-hover:scale-125 transition-transform">
                {cartCount}
              </span>
            )}
          </Link>

          {!isAuthenticated ? (
            <div className="hidden sm:flex gap-2">
              <Button variant="ghost" size="md" className="h-10 px-6 font-black sm:h-12" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="primary" size="md" className="h-10 px-6 font-black sm:h-12" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          ) : (
            <div className="relative hidden lg:block">
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
                <div className="min-w-0 text-left">
                  <p className="max-w-[100px] truncate text-sm font-bold text-[var(--text-primary)]">{userName}</p>
                </div>
                <div className="h-8 w-px bg-black/8 dark:bg-white/10" />
                <ChevronDown size={14} className={`text-[var(--text-muted)] transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 8 }}
                    className="absolute right-0 top-16 w-64 overflow-hidden rounded-[var(--radius-md)] border border-black/8 bg-[var(--surface-glass)] p-2 shadow-[var(--shadow-strong)] backdrop-blur-3xl dark:border-white/10"
                  >
                    <Link to="/profile" className="nav-dropdown-item flex items-center gap-3">
                      <User size={18} /> Profile
                    </Link>
                    <Link to="/orders" className="nav-dropdown-item flex items-center gap-3">
                      <PackageCheck size={18} /> Orders
                    </Link>
                    <div className="my-2 border-t border-black/8 dark:border-white/10" />
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-4 py-3 text-sm font-black text-rose-500 transition-all hover:bg-rose-500/8"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white lg:hidden"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop & Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-[300px] bg-white p-8 shadow-2xl dark:bg-gray-900 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                   <img src="/images/logo/ManeMade-logo.png" alt="Logo" className="h-10 w-auto" />
                   <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800"><X size={20} /></button>
                </div>

                <div className="space-y-4 flex-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) => `
                        flex items-center h-14 px-6 rounded-2xl text-sm font-black uppercase tracking-widest transition-all
                        ${isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-[var(--text-secondary)] hover:bg-orange-500/5'}
                      `}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                  {isAuthenticated && (
                     <>
                      <NavLink to="/profile" className="flex items-center h-14 px-6 rounded-2xl text-sm font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-orange-500/5">
                        Profile
                      </NavLink>
                      <NavLink to="/orders" className="flex items-center h-14 px-6 rounded-2xl text-sm font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-orange-500/5">
                        Orders
                      </NavLink>
                     </>
                  )}
                </div>

                <div className="pt-8 border-t border-black/5 dark:border-white/5 space-y-4">
                  {!isAuthenticated ? (
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-14 font-black" onClick={() => navigate('/login')}>Login</Button>
                      <Button variant="primary" className="h-14 font-black" onClick={() => navigate('/register')}>Join</Button>
                    </div>
                  ) : (
                    <Button variant="secondary" className="w-full h-14 font-black text-rose-500" onClick={() => { logout(); navigate('/'); }}>
                       Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
