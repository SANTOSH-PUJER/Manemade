import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import '../styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          />
        </div>

        <nav className="nav-actions">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/categories" className="nav-link">Categories</Link>
          </div>
          
          <div className="action-btns">
            <div className="cart-btn">
               <ShoppingCart size={22} />
               <span className="cart-count">0</span>
            </div>
            <Link to="/login" className="btn-icon-text">
              <User size={20} />
              <span>Login</span>
            </Link>
            <Link to="/register" className="btn-register-header">Register</Link>
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
          <Link to="/login" className="mobile-nav-link" onClick={toggleMenu}>Login</Link>
          <Link to="/register" className="mobile-nav-link" onClick={toggleMenu}>Register</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
