import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, ShoppingCart, User, Menu, X,
  LogOut, Settings, Package, User as UserCircle,
  ChevronDown, Heart, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const onLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header glass-header">
      <div className="container header-inner">
        <Link to="/" className="logo-container">
          <img src="/images/logo/ManeMade-logo.png" alt="ManeMade Logo" className="logo-img" />
        </Link>

        <div className="search-container glass-search">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-bar"
            placeholder="Search for homemade rotti, chutney, meals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <nav className="nav-actions">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            {user && user.role === 'ADMIN' && (
              <Link to="/admin" className="nav-link admin-link">Admin</Link>
            )}
          </div>

          <div className="action-btns">
            <Link to="/checkout" className="cart-btn group">
              <div className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <ShoppingCart size={22} />
                {cartCount > 0 && <span className="cart-count premium-gradient">{cartCount}</span>}
              </div>
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-0.5 py-0.5 rounded-full border border-black/5 hover:border-[var(--accent-strong)]/30 hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#FFB37C] p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="User" className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <div className="h-full w-full rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-[#FF6B00]">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-bold truncate max-w-[80px] text-[var(--text-main)]">{user.firstName}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-72 rounded-3xl bg-white border border-black/5 shadow-2xl dark:bg-zinc-900 overflow-hidden z-[1001] glass-card"
                    >
                      <div className="p-6 bg-gradient-to-br from-[#FF6B00]/10 to-transparent border-b border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-[#FF6B00] shadow-glow flex items-center justify-center text-white font-black text-lg">
                            {user.avatarUrl ? <img src={user.avatarUrl} className="h-full w-full rounded-full object-cover" /> : user.firstName?.[0]}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-black truncate">{user.firstName} {user.lastName}</h4>
                            <p className="text-xs font-medium text-[var(--text-muted)] truncate opacity-70">{user.email}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <Badge variant="primary" className="text-[9px] px-2 border-0 bg-[#FF6B00] text-white">PRO MEMBER</Badge>
                          <span className="text-[10px] font-black text-[#FF6B00]">2,450 XP</span>
                        </div>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 group transition-colors"
                        >
                          <div className="p-2 rounded-xl bg-orange-100 text-[#FF6B00] group-hover:scale-110 transition-transform">
                            <UserCircle size={18} />
                          </div>
                          My Account
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => { setIsProfileOpen(false); /* Should handle direct tab navigation if possible */ }}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 group transition-colors"
                        >
                          <div className="p-2 rounded-xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
                            <Package size={18} />
                          </div>
                          Orders & Tracking
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 group transition-colors"
                        >
                          <div className="p-2 rounded-xl bg-purple-100 text-purple-600 group-hover:scale-110 transition-transform">
                            <Settings size={18} />
                          </div>
                          Account Settings
                        </Link>
                      </div>

                      <div className="p-2 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/5">
                        <button
                          onClick={onLogout}
                          className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-rose-500 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut size={18} />
                          Confirm Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold hover:text-[#FF6B00] transition-colors">Login</Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-full bg-black text-white text-sm font-black hover:bg-[#FF6B00] hover:shadow-lg transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mobile-nav fixed inset-0 z-[1002] bg-white dark:bg-zinc-950 p-8 pt-24"
          >
            <div className="mobile-nav-links flex flex-col gap-6">
              <Link to="/" className="text-4xl font-black" onClick={toggleMenu}>Home</Link>
              <Link to="/shop" className="text-4xl font-black" onClick={toggleMenu}>Shop</Link>
              <Link to="/categories" className="text-4xl font-black" onClick={toggleMenu}>Categories</Link>

              <hr className="my-4 border-black/5 dark:border-white/5" />

              {user ? (
                <>
                  <Link to="/profile" className="flex items-center gap-4 text-2xl font-black text-[#FF6B00]" onClick={toggleMenu}>
                    <User size={24} /> Profile Dashboard
                  </Link>
                  <button
                    onClick={() => { onLogout(); toggleMenu(); }}
                    className="flex items-center gap-4 text-2xl font-black text-rose-500"
                  >
                    <LogOut size={24} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-3xl font-black" onClick={toggleMenu}>Login</Link>
                  <Link to="/register" className="text-3xl font-black text-[#FF6B00]" onClick={toggleMenu}>Join Us</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
