import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FoodCard from './FoodCard';
import { itemService, categoryService } from '../services/dataService';
import '../styles/UttarKarnatakaFood.css';

const UttarKarnatakaFood = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [itemsRes, catsRes] = await Promise.all([
          itemService.getAll(),
          categoryService.getAll()
        ]);
        
        setFoodItems(itemsRes.data || []);
        const catNames = catsRes.data?.map(c => c.name) || [];
        setCategories(['All', ...catNames]);
      } catch (error) {
        console.error("Failed to load food menu:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredItems = activeFilter === 'All' 
    ? foodItems 
    : foodItems.filter(item => {
        const categoryName = item.category?.name || item.categoryName;
        return categoryName === activeFilter;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--accent-strong)]" />
        <p className="font-display text-xl font-bold text-[var(--text-muted)] italic">Bringing you the taste of Hubballi-Dharwad...</p>
      </div>
    );
  }

  return (
    <section className="container uttar-karnataka-section">
      <div className="section-header-centered">
        <motion.h2 
          className="section-title-main"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Authentic Uttar Karnataka Food
        </motion.h2>
        <motion.p 
          className="section-subtitle-main"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Simple, spicy, and soulful traditional meals straight from the hearth
        </motion.p>
      </div>

      <div className="filter-tabs">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`filter-tab ${activeFilter === cat ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
            {activeFilter === cat && (
              <motion.div 
                className="filter-active-underline" 
                layoutId="activeFilter"
              />
            )}
          </button>
        ))}
      </div>

      <motion.div 
        className="food-grid"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="view-full-menu-container">
        <button className="view-full-menu-btn" onClick={() => navigate('/shop')}>
          View Full Menu <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default UttarKarnatakaFood;
