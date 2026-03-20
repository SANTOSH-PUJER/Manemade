import React from 'react';
import { motion } from 'framer-motion';
import { Search, UtensilsCrossed, Truck, ShieldCheck, Star, ShoppingCart } from 'lucide-react';
import { categoryService } from '../services/userService';
import UttarKarnatakaFood from '../components/UttarKarnatakaFood';
import { useCart } from '../context/CartContext';
import '../styles/LandingPage.css';

// Import Authentic assets
import joladaRottiImg from '../assets/food/jolada_rotti_meal.png';
import ennegayiImg from '../assets/food/ennegayi.png';
import shengaChutneyImg from '../assets/food/shenga_chutney.png';
import girmitImg from '../assets/food/girmit.png';
import dharwadPedaImg from '../assets/food/dharwad_peda.png';
import kayiHoligeImg from '../assets/food/kayi_holige.png';

const categories = [
  { name: 'Rotti', img: joladaRottiImg },
  { name: 'Chutney', img: shengaChutneyImg },
  { name: 'Meals', img: ennegayiImg },
  { name: 'Street Food', img: girmitImg },
  { name: 'Sweets', img: dharwadPedaImg },
  { name: 'Holige', img: kayiHoligeImg }
];

const bestSellers = [
  { id: 1, name: 'Jolada Rotti Meal', price: 150, oldPrice: 180, discount: '15% OFF', img: joladaRottiImg, rating: 4.9 },
  { id: 2, name: 'Ennegayi Curry', price: 120, oldPrice: 150, discount: '20% OFF', img: ennegayiImg, rating: 4.8 },
  { id: 3, name: 'Shenga Chutney', price: 40, oldPrice: 50, discount: '20% OFF', img: shengaChutneyImg, rating: 4.7 },
  { id: 4, name: 'Dharwad Peda', price: 200, oldPrice: 240, discount: '15% OFF', img: dharwadPedaImg, rating: 5.0 }
];

const LandingPage = () => {
  const [dynamicCategories, setDynamicCategories] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredProducts, setFilteredProducts] = React.useState(bestSellers);
  const { addToCart } = useCart();

  React.useEffect(() => {
    categoryService.getStats()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setDynamicCategories(res.data);
        } else {
          setDynamicCategories(categories);
        }
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        setDynamicCategories(categories);
      });
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = bestSellers.filter(p => 
      p.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  const displayCategories = dynamicCategories.length > 0 ? dynamicCategories : categories;

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <motion.div 
          className="container hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Delicious Homemade Food <br /> Delivered to Your Doorstep</h1>
          <p>Authentic taste, hygienic cooking, made by home chefs</p>
          
          <div className="hero-search">
            <Search className="hero-search-icon" size={24} />
            <input 
              type="text" 
              placeholder="What are you craving today?" 
              value={searchQuery}
              onChange={handleSearch}
            />
            <button className="btn-primary">Find Food</button>
          </div>
        </motion.div>
      </section>

      {/* Feature Highlights */}
      <section className="container features-section">
        <div className="features-grid">
          <motion.div className="feature-card" whileHover={{ y: -10 }}>
            <div className="feature-icon"><UtensilsCrossed size={32} /></div>
            <h3>Homemade & Hygienic</h3>
            <p>Prepared with love and strictly hygiene standards.</p>
          </motion.div>
          <motion.div className="feature-card" whileHover={{ y: -10 }}>
            <div className="feature-icon"><Truck size={32} /></div>
            <h3>Fast Delivery</h3>
            <p>Lightning fast delivery to keep your food fresh.</p>
          </motion.div>
          <motion.div className="feature-card" whileHover={{ y: -10 }}>
            <div className="feature-icon"><ShieldCheck size={32} /></div>
            <h3>Affordable Prices</h3>
            <p>Premium homemade taste that fits your budget.</p>
          </motion.div>
        </div>
      </section>

      {/* Category Section */}
      <section className="container categories-section">
        <h2 className="section-title">Explore Categories</h2>
        <div className="categories-grid">
          {displayCategories.map((cat, i) => (
            <motion.div 
              key={i} 
              className="category-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: i * 0.1 }}
            >
              <img src={cat.img || cat.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80'} alt={cat.name} className="category-img" />
              <div className="category-overlay">
                <h3>{cat.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Products */}
      <section className="container products-section">
        <div className="section-header">
          <h2 className="section-title text-left">Best Selling Products</h2>
          <button className="view-all">View All</button>
        </div>
        <div className="products-grid">
          {filteredProducts.length > 0 ? filteredProducts.map((product, i) => (
            <motion.div 
              key={product.id} 
              className="product-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="product-img-wrapper">
                <img src={product.img} alt={product.name} className="product-img" />
                {product.discount && <span className="discount-badge">{product.discount}</span>}
              </div>
              <div className="product-info">
                <div className="product-rating">
                  <Star size={14} fill="#FFB800" color="#FFB800" />
                  <span>{product.rating}</span>
                </div>
                <h3>{product.name}</h3>
                <div className="product-footer">
                  <div className="price-tag">
                    <span className="current-price">₹{product.price}</span>
                    {product.oldPrice && <span className="old-price">₹{product.oldPrice}</span>}
                  </div>
                  <button className="add-to-cart" onClick={() => addToCart(product)}>
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="no-results" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
              <p>No products found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Uttar Karnataka Food Section */}
      <UttarKarnatakaFood />

      {/* Top Savers Today - Extra Section */}
      <section className="container today-savers">
        <div className="savers-banner">
          <div className="savers-content">
            <h2>Top Savers Today!</h2>
            <p>Get up to 40% OFF on specific homemade meals. Only for today!</p>
            <button className="btn-primary">Claim Offer</button>
          </div>
          <div className="savers-image">
            <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80" alt="Special Offer" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
