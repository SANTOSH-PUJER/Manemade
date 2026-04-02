import artisanCraftHero from '../assets/food/artisan_craft_hero_premium.png';
import badnekayiPalya from '../assets/food/badnekayi_palya.png';
import dharwadPeda from '../assets/food/dharwad_peda_premium.png';
import ennegayi from '../assets/food/ennegayi_curry_premium.png';
import girmit from '../assets/food/girmit.png';
import huraliSaaru from '../assets/food/hurali_saaru.png';
import joladaRotti from '../assets/food/jolada_rotti_hero.png';
import kayiHolige from '../assets/food/kayi_holige.png';
import kharadaPundi from '../assets/food/kharada_pundi.png';
import mandakkiOggarane from '../assets/food/mandakki_oggarane.png';
import ragiMudde from '../assets/food/ragi_mudde.png';
import shengaChutney from '../assets/food/shenga_chutney.png';

export const dishes = [
  { id: 1, slug: 'jolada-rotti-signature-meal', name: 'Jolada Rotti Signature Meal', category: 'Jolada Rotti', price: 189, rating: 4.9, reviews: 412, type: 'veg', deliveryTime: '24 mins', image: joladaRotti, description: 'Hand-pressed millet rotis paired with ennegayi, shenga chutney, and farm-style sides for a comforting North Karnataka spread.', ingredients: ['Jowar flour', 'Brinjal masala', 'Groundnut chutney', 'Onion kosambari'], tags: ['Best Seller', 'Chef Special', 'Family Favorite'], highlight: 'Stone-ground grains and wood-fired flavor.' },
  { id: 2, slug: 'ennegayi-curry-bowl', name: 'Ennegayi Curry Bowl', category: 'North Karnataka Meals', price: 169, rating: 4.8, reviews: 286, type: 'veg', deliveryTime: '21 mins', image: ennegayi, description: 'Tender baby brinjals simmered in a roasted peanut and sesame masala that tastes slow-cooked and deeply festive.', ingredients: ['Baby brinjal', 'Groundnut', 'Sesame', 'Dry coconut'], tags: ['Rich Gravy', 'Comfort Bowl'], highlight: 'Balanced spice with a velvety, nutty finish.' },
  { id: 3, slug: 'girmit-street-mix', name: 'Girmit Street Mix', category: 'Street Food', price: 119, rating: 4.7, reviews: 193, type: 'veg', deliveryTime: '18 mins', image: girmit, description: 'Hubballi-style puffed rice tossed with mandakki, masala, and crunch for an evening snack that feels instantly nostalgic.', ingredients: ['Puffed rice', 'Onion', 'Chilli powder', 'Coriander'], tags: ['Snackable', 'Light Bite'], highlight: 'Crisp, spicy, and made for chai time.' },
  { id: 4, slug: 'shenga-chutney-podi', name: 'Shenga Chutney Podi', category: 'Chutney', price: 79, rating: 4.9, reviews: 158, type: 'veg', deliveryTime: '16 mins', image: shengaChutney, description: 'Roasted groundnut chutney powder with a smoky kick, perfect with rotti, idli, rice, or a spoonful of ghee.', ingredients: ['Groundnut', 'Byadgi chilli', 'Garlic', 'Curry leaves'], tags: ['Pantry Hero', 'House Blend'], highlight: 'A punchy condiment that upgrades everything.' },
  { id: 5, slug: 'dharwad-peda-premium-box', name: 'Dharwad Peda Premium Box', category: 'Sweets', price: 249, rating: 5, reviews: 227, type: 'veg', deliveryTime: '28 mins', image: dharwadPeda, description: 'Caramelized milk fudge with the signature grainy texture and mellow sweetness that made Dharwad famous.', ingredients: ['Milk solids', 'Sugar', 'Ghee'], tags: ['Gift Pick', 'Festival Favorite'], highlight: 'Beautifully boxed and celebration-ready.' },
  { id: 6, slug: 'kayi-holige-dessert-fold', name: 'Kayi Holige Dessert Fold', category: 'Holige', price: 139, rating: 4.8, reviews: 141, type: 'veg', deliveryTime: '22 mins', image: kayiHolige, description: 'Thin festive flatbread stuffed with coconut jaggery filling, finished with ghee for a soft and fragrant dessert.', ingredients: ['Maida', 'Coconut', 'Jaggery', 'Cardamom'], tags: ['Dessert', 'Ghee Finish'], highlight: 'Soft layers with warm jaggery sweetness.' },
  { id: 7, slug: 'ragi-mudde-saaru-combo', name: 'Ragi Mudde Saaru Combo', category: 'North Karnataka Meals', price: 179, rating: 4.6, reviews: 104, type: 'veg', deliveryTime: '25 mins', image: ragiMudde, description: 'Wholesome finger millet dumplings paired with rustic saaru for a protein-rich meal that feels grounding and earthy.', ingredients: ['Ragi flour', 'Lentil broth', 'Garlic tempering'], tags: ['Healthy', 'Traditional'], highlight: 'A hearty regional staple with clean nutrition.' },
  { id: 8, slug: 'mandakki-oggarane-quick-bowl', name: 'Mandakki Oggarane Quick Bowl', category: 'Street Food', price: 109, rating: 4.5, reviews: 88, type: 'veg', deliveryTime: '17 mins', image: mandakkiOggarane, description: 'Tempered puffed rice with peanuts and spice, built for a fast lunch that still feels homemade and regional.', ingredients: ['Puffed rice', 'Peanuts', 'Turmeric', 'Green chilli'], tags: ['Quick Bite', 'Budget Pick'], highlight: 'Fast, warm, and wonderfully craveable.' },
  { id: 9, slug: 'hurali-saaru-soul-bowl', name: 'Hurali Saaru Soul Bowl', category: 'North Karnataka Meals', price: 149, rating: 4.7, reviews: 93, type: 'veg', deliveryTime: '20 mins', image: huraliSaaru, description: 'Horse gram broth layered with spices and slow-simmered depth, served as a warm bowl for rainy evenings and light dinners.', ingredients: ['Horse gram', 'Tomato', 'Garlic', 'Pepper'], tags: ['High Protein', 'Soul Food'], highlight: 'Peppery, hearty, and deeply restorative.' },
  { id: 10, slug: 'badnekayi-palya-home-thali', name: 'Badnekayi Palya Home Thali', category: 'North Karnataka Meals', price: 159, rating: 4.6, reviews: 76, type: 'veg', deliveryTime: '23 mins', image: badnekayiPalya, description: 'Simple home-style brinjal stir-fry with soft phulkas and rice for the kind of weekday meal that travels well and comforts instantly.', ingredients: ['Brinjal', 'Onion', 'Mustard seeds', 'Coconut'], tags: ['Home Style', 'Lunch Pick'], highlight: 'Balanced, familiar, and everyday-perfect.' },
  { id: 11, slug: 'kharada-pundi-spice-bites', name: 'Kharada Pundi Spice Bites', category: 'Street Food', price: 129, rating: 4.5, reviews: 57, type: 'veg', deliveryTime: '19 mins', image: kharadaPundi, description: 'Steamed rice bites with chilli-forward seasoning and soft texture, served with chutney for a proper teatime snack.', ingredients: ['Rice flour', 'Chilli', 'Coconut', 'Mustard'], tags: ['Spicy', 'Evening Snack'], highlight: 'Gentle chew with a big spicy payoff.' },
];

const dishLookup = new Map(dishes.map((dish) => [dish.slug, dish]));

export const categories = [
  { name: 'Jolada Rotti', subtitle: 'Millet-first artisan rotis', image: joladaRotti },
  { name: 'Chutney', subtitle: 'House-ground accompaniments', image: shengaChutney },
  { name: 'North Karnataka Meals', subtitle: 'Comfort food from home kitchens', image: artisanCraftHero },
  { name: 'Street Food', subtitle: 'Crunchy bites and evening favorites', image: girmit },
];

export const offers = [
  { title: 'Free dessert on signature thalis', description: 'Add any premium meal and unlock a complimentary mini holige today.', badge: 'Limited Time' },
  { title: 'Save 20% on office lunch combos', description: 'Perfect for team orders, packed with fast prep and premium plating.', badge: 'Lunch Rush' },
];

export const testimonials = [
  { name: 'Ananya Kulkarni', role: 'Weekly subscriber', quote: 'This feels like restaurant-level presentation with the warmth of food from home.' },
  { name: 'Rahul Deshpande', role: 'Hubballi transplant', quote: 'The jolada rotti meal is the closest thing I have found to my grandmother\'s table.' },
  { name: 'Priya S', role: 'Busy product manager', quote: 'Fast delivery, clean packaging, and the UI finally matches the quality of the food.' },
];

export const stats = [
  { label: 'Active home chefs', value: '120+' },
  { label: 'Premium regional dishes', value: '40+' },
  { label: 'Average delivery time', value: '24 min' },
];

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/shop' },
  { label: 'Offers', to: '/shop?highlight=offers' },
  { label: 'Profile', to: '/profile' },
];

export function hydrateDish(rawDish, index = 0) {
  const fallback = dishLookup.get(rawDish.slug) || dishes[index % dishes.length];
  return {
    ...fallback,
    ...rawDish,
    category: rawDish.categoryName || fallback.category,
    image: rawDish.image || fallback.image,
    rating: fallback.rating,
    reviews: fallback.reviews,
    type: rawDish.isVeg === false ? 'non-veg' : fallback.type,
    deliveryTime: fallback.deliveryTime,
    ingredients: fallback.ingredients,
    tags: fallback.tags,
    highlight: fallback.highlight,
  };
}

export function findDishBySlug(slug, collection = dishes) {
  return collection.find((dish) => dish.slug === slug);
}
