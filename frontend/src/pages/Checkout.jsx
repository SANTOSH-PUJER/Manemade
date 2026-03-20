import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, Trash2, Plus, Minus, CreditCard, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    
    setLoading(true);
    try {
      // Dummy user and address for now since auth integration is partial
      const orderData = {
        userId: 1, // Default user from DataInitializer
        addressId: 1, // Default address if exists
        items: cartItems.map(item => ({
          itemId: item.id,
          quantity: item.quantity
        }))
      };

      await axios.post('http://localhost:8081/api/order/place', orderData);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error('Order placement failed:', err);
      alert('Failed to place order. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container checkout-success">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="success-card"
        >
          <div className="success-icon">✅</div>
          <h2>Order Placed Successfully!</h2>
          <p>Your delicious homemade meal is being prepared with love.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Back to Home</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container checkout-page">
      <div className="checkout-header">
        <h1>Your Shopping Cart</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link> <ChevronRight size={14} /> <span>Checkout</span>
        </div>
      </div>

      <div className="checkout-content">
        <div className="cart-list-section">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={64} />
              <p>Your cart is empty</p>
              <Link to="/" className="btn-primary">Browse Food</Link>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map((item) => (
                <motion.div 
                  key={item.id} 
                  layout 
                  className="cart-item-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="price">₹{item.price}</p>
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
                  </div>
                  <div className="cart-item-total">
                    ₹{item.price * item.quantity}
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="order-summary-section">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹40</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total Payable</span>
              <span>₹{cartTotal + (cartItems.length > 0 ? 40 : 0)}</span>
            </div>
            
            <div className="delivery-info">
              <h4><MapPin size={18} /> Delivery Address</h4>
              <p>Default Home Address (1st Block, Rajajinagar, Bangalore)</p>
            </div>

            <button 
              className="place-order-btn" 
              disabled={cartItems.length === 0 || loading}
              onClick={handlePlaceOrder}
            >
              {loading ? 'Processing...' : (
                <>
                  <CreditCard size={20} /> Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
