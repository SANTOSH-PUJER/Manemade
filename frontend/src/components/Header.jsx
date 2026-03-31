import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };
  const userData = JSON.parse(localStorage.getItem('user'));
  const user = userData?.user;

  const { cartCount } = useCart();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          Mane<span>Made</span>
        </Link>
        
        <div className="search-container">
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
            {user && user.email === 'admin@manemade.com' && (
              <Link to="/admin" className="nav-link admin-link">Admin</Link>
            )}
          </div>
          
          <div className="action-btns">
            <Link to="/checkout" className="cart-btn">
               <ShoppingCart size={22} />
               {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="btn-icon-text">
                   <User size={20} />
                   <span>{user.firstName}</span>
                </Link>
                <button onClick={handleLogout} className="btn-register-header" style={{ background: '#718096', border: 'none', cursor: 'pointer' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" style={{ marginRight: '10px' }}>Login</Link>
                <Link to="/register" className="btn-register-header">Register</Link>
              </>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-links">
          <Link to="/" className="mobile-nav-link" onClick={toggleMenu}>Home</Link>
          <Link to="/shop" className="mobile-nav-link" onClick={toggleMenu}>Shop</Link>
          <Link to="/categories" className="mobile-nav-link" onClick={toggleMenu}>Categories</Link>
          <hr className="mobile-divider" />
          {user ? (
            <>
              <Link to="/profile" className="mobile-nav-link" onClick={toggleMenu}>My Profile</Link>
              <div className="mobile-nav-link" onClick={() => { handleLogout(); toggleMenu(); }} style={{ cursor: 'pointer' }}>Logout</div>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={toggleMenu}>Login</Link>
              <Link to="/register" className="mobile-nav-link" onClick={toggleMenu}>Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
