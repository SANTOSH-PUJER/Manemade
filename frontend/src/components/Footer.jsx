import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <Link to="/" className="logo footer-logo">
            Mane<span>Made</span>
          </Link>
          <p className="footer-desc">
            Delicious homemade food delivered to your doorstep. Authentic taste, hygienic cooking, made by passionate home chefs.
          </p>
          <div className="social-icons">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="contact-list">
            <li><Phone size={18} /> +91 98765 43210</li>
            <li><Mail size={18} /> support@manemade.com</li>
            <li><MapPin size={18} /> Bangalore, Karnataka, India</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to get special offers and menu updates.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email" />
            <button className="btn-primary">Join</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Mane Made. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
