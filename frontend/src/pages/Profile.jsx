import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, User, MapPin, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios';
import '../styles/Checkout.css'; // Reusing some base styles

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 1; // Default user for demo

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/order/user/${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container profile-page" style={{ paddingTop: '100px', marginBottom: '50px' }}>
      <div className="profile-header" style={{ marginBottom: '30px' }}>
        <h1>My Profile</h1>
        <div className="user-brief" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
          <div className="user-avatar" style={{ width: '60px', height: '60px', background: '#FF7043', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white' }}>
            <User size={30} style={{ margin: 'auto' }} />
          </div>
          <div>
            <h3>Santosh Pujer</h3>
            <p style={{ color: '#718096' }}>santosh@example.com</p>
          </div>
        </div>
      </div>

      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <section className="orders-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Package size={22} color="#FF7043" />
            <h2 style={{ fontSize: '1.5rem' }}>Order History</h2>
          </div>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="empty-orders" style={{ textAlign: 'center', padding: '40px', background: '#f7fafc', borderRadius: '12px' }}>
              <Package size={48} color="#CBD5E0" style={{ marginBottom: '10px' }} />
              <p>No orders yet. Time to order some delicious food!</p>
            </div>
          ) : (
            <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {orders.map((order) => (
                <motion.div 
                  key={order.id} 
                  className="order-card"
                  whileHover={{ scale: 1.01 }}
                  style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #edf2f7' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '700', color: '#2D3748' }}>Order #{order.id}</span>
                    <span style={{ 
                      background: order.status === 'PLACED' ? '#EBF8FF' : '#F0FFF4', 
                      color: order.status === 'PLACED' ? '#3182CE' : '#38A169',
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                    }}>{order.status}</span>
                  </div>
                  <div style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '10px' }}>
                    <Clock size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                    {new Date(order.createdTs).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#4A5568' }}>{order.items.length} Items</span>
                    <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>₹{order.totalAmount}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="addresses-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <MapPin size={22} color="#FF7043" />
            <h2 style={{ fontSize: '1.5rem' }}>Saved Addresses</h2>
          </div>
          <div className="address-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '2px solid #FF7043', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#FF7043', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>DEFAULT</span>
            <h4>Home</h4>
            <p style={{ color: '#4A5568', marginTop: '10px' }}>
              1st Block, Rajajinagar<br />
              Bangalore, Karnataka - 560010
            </p>
          </div>
          <button style={{ 
            marginTop: '20px', width: '100%', padding: '12px', background: 'none', border: '2px dashed #CBD5E0', 
            borderRadius: '12px', color: '#718096', fontWeight: 'bold', cursor: 'pointer' 
          }}>
            + Add New Address
          </button>
        </section>
      </div>
    </div>
  );
};

export default Profile;
