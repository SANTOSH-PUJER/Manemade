import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import FoodCard from './FoodCard';
import '../styles/UttarKarnatakaFood.css';

// Import images
import joladaRottiImg from '../assets/food/jolada_rotti_meal.png';
import ennegayiImg from '../assets/food/ennegayi.png';
import shengaChutneyImg from '../assets/food/shenga_chutney.png';
import badnekayiPalyaImg from '../assets/food/badnekayi_palya.png';
import ragiMuddeImg from '../assets/food/ragi_mudde.png';
import huraliSaaruImg from '../assets/food/hurali_saaru.png';
import girmitImg from '../assets/food/girmit.png';
import mandakkiOggaraneImg from '../assets/food/mandakki_oggarane.png';
import kharadaPundiImg from '../assets/food/kharada_pundi.png';
import kayiHoligeImg from '../assets/food/kayi_holige.png';
import dharwadPedaImg from '../assets/food/dharwad_peda.png';
import shavigePayasaImg from '../assets/food/shavige_payasa.png';

const foodItems = [
  { id: 1, name: 'Jolada Rotti Meal', category: 'Meals', price: 150, rating: 4.9, image: joladaRottiImg, description: 'Traditional sorghum flatbread with assorted curries and sides.', isVeg: true, spiceLevel: 2, isPopular: true },
  { id: 2, name: 'Ennegayi', category: 'Meals', price: 120, rating: 4.8, image: ennegayiImg, description: 'Stuffed brinjal in a rich, spicy peanut and sesame gravy.', isVeg: true, spiceLevel: 3, isPopular: true },
  { id: 3, name: 'Shenga Chutney', category: 'Meals', price: 40, rating: 4.7, image: shengaChutneyImg, description: 'Spicy peanut chutney powder, a staple North Karnataka side.', isVeg: true, spiceLevel: 3, isPopular: false },
  { id: 4, name: 'Badnekayi Palya', category: 'Meals', price: 90, rating: 4.6, image: badnekayiPalyaImg, description: 'Stir-fried eggplant with traditional local spices.', isVeg: true, spiceLevel: 2, isPopular: false },
  { id: 5, name: 'Ragi Mudde + Saaru', category: 'Meals', price: 130, rating: 4.8, image: ragiMuddeImg, description: 'Finger millet ball served with traditional spicy gravy.', isVeg: true, spiceLevel: 2, isPopular: false },
  { id: 6, name: 'Hurali Saaru', category: 'Meals', price: 80, rating: 4.7, image: huraliSaaruImg, description: 'Nutritious horse gram curry with earthy flavors.', isVeg: true, spiceLevel: 2, isPopular: false },
  { id: 7, name: 'Girmit', category: 'Street Food', price: 60, rating: 4.9, image: girmitImg, description: 'Tangy puffed rice snack with spices and Mirchi Bajji.', isVeg: true, spiceLevel: 3, isPopular: false },
  { id: 8, name: 'Mandakki Oggarane', category: 'Street Food', price: 50, rating: 4.6, image: mandakkiOggaraneImg, description: 'Tempered puffed rice mixed with spices and peanuts.', isVeg: true, spiceLevel: 1, isPopular: false },
  { id: 9, name: 'Kharada Pundi', category: 'Street Food', price: 70, rating: 4.5, image: kharadaPundiImg, description: 'Spicy steamed rice balls served with coconut chutney.', isVeg: true, spiceLevel: 2, isPopular: false },
  { id: 10, name: 'Kayi Holige', category: 'Sweets', price: 35, rating: 4.9, image: kayiHoligeImg, description: 'Sweet flatbread stuffed with fresh coconut and jaggery.', isVeg: true, spiceLevel: 0, isPopular: false },
  { id: 11, name: 'Dharwad Peda', category: 'Sweets', price: 200, rating: 5.0, image: dharwadPedaImg, description: 'World-famous milk sweet with a unique caramelized flavor.', isVeg: true, spiceLevel: 0, isPopular: true },
  { id: 12, name: 'Shavige Payasa', category: 'Sweets', price: 60, rating: 4.7, image: shavigePayasaImg, description: 'Creamy vermicelli pudding with cardamom and nuts.', isVeg: true, spiceLevel: 0, isPopular: false },
];

const categories = ['All', 'Meals', 'Street Food', 'Sweets'];

const UttarKarnatakaFood = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredItems = activeFilter === 'All' 
    ? foodItems 
    : foodItems.filter(item => item.category === activeFilter);

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
          Simple, spicy, and soulful traditional meals
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
        <button className="view-full-menu-btn">
          View Full Menu <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default UttarKarnatakaFood;
