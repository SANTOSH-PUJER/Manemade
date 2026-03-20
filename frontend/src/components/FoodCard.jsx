import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, TrendingUp } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FoodCard = ({ item }) => {
  const { 
    name, 
    description, 
    price, 
    rating, 
    image, 
    isVeg, 
    spiceLevel, 
    isPopular 
  } = item;
  const { addToCart } = useCart();

  return (
    <motion.div 
      className="food-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="food-card-image-wrapper">
        <img src={image} alt={name} className="food-card-image" />
        {isPopular && (
          <div className="popular-tag">
            <TrendingUp size={14} />
            <span>Popular</span>
          </div>
        )}
        <div className="veg-badge-container">
          <span className={`veg-badge ${isVeg ? 'veg' : 'non-veg'}`}></span>
        </div>
      </div>

      <div className="food-card-content">
        <div className="food-card-header">
          <h3 className="food-card-title">{name}</h3>
          <div className="food-card-rating">
            <Star size={14} fill="#FFC107" color="#FFC107" />
            <span>{rating}</span>
          </div>
        </div>
        
        <p className="food-card-description">{description}</p>
        
        <div className="food-card-meta">
          <div className="spice-level">
            {[...Array(3)].map((_, i) => (
              <span 
                key={i} 
                className={`spice-chili ${i < spiceLevel ? 'active' : ''}`}
              >
                🌶️
              </span>
            ))}
          </div>
          <div className="food-card-price">₹{price}</div>
        </div>

        <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </button>
      </div>
    </motion.div>
  );
};

export default FoodCard;
