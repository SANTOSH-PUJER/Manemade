import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(undefined);
const CART_STORAGE_KEY = 'manemade_cart_v2';

const normalizeItem = (item, quantity = 1) => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  price: item.price,
  image: item.image,
  rating: item.rating,
  deliveryTime: item.deliveryTime,
  quantity,
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, quantity = 1) => {
    setCartItems((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem,
        );
      }
      return [...current, normalizeItem(item, quantity)];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((current) => current.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((current) =>
      current.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => setCartItems([]);

  const value = useMemo(() => {
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryFee = cartItems.length ? 48 : 0;
    const taxes = Math.round(cartSubtotal * 0.05);
    const cartTotal = cartSubtotal + deliveryFee + taxes;

    return {
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartSubtotal,
      deliveryFee,
      taxes,
      cartTotal,
    };
  }, [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
