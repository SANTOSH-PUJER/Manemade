import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { cartService } from '../services/dataService';

const CartContext = createContext(undefined);
const CART_STORAGE_KEY = 'manemade_cart_v2';

const formatDeliveryTime = (minutes) => `${minutes || 25} mins`;

const normalizeGuestItem = (item, quantity = 1) => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  price: item.price,
  image: item.image,
  rating: item.rating ?? 4.5,
  deliveryTime: item.deliveryTime || formatDeliveryTime(item.deliveryTimeMinutes),
  category: item.category || item.categoryName,
  quantity,
});

const normalizeServerCart = (payload) =>
  (payload?.items || []).map((item) => ({
    id: item.itemId,
    slug: item.itemSlug,
    name: item.itemName,
    price: item.unitPrice,
    image: item.image,
    rating: item.rating ?? 4.5,
    deliveryTime: formatDeliveryTime(item.deliveryTimeMinutes),
    category: item.categoryName,
    quantity: item.quantity,
  }));

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    const loadGuestCart = () => {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      setCartItems(saved ? JSON.parse(saved) : []);
      setLoadingCart(false);
    };

    const syncBackendCart = async () => {
      if (!user?.id) {
        loadGuestCart();
        return;
      }

      setLoadingCart(true);
      try {
        const guestCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        if (guestCart.length > 0) {
          for (const item of guestCart) {
            await cartService.addItem(user.id, { itemId: item.id, quantity: item.quantity });
          }
          localStorage.removeItem(CART_STORAGE_KEY);
        }

        const response = await cartService.getCart(user.id);
        setCartItems(normalizeServerCart(response.data));
      } catch (error) {
        showToast({ title: 'Cart sync failed', description: error.response?.data?.message || 'Could not load your cart from the backend.' });
        setCartItems([]);
      } finally {
        setLoadingCart(false);
      }
    };

    syncBackendCart();
  }, [isAuthenticated, showToast, user?.id]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (item, quantity = 1) => {
    // Optimistic update for UI feel
    setCartItems((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem,
        );
      }
      return [...current, normalizeGuestItem(item, quantity)];
    });

    if (isAuthenticated && user?.id) {
      try {
        const response = await cartService.addItem(user.id, { itemId: item.id, quantity });
        setCartItems(normalizeServerCart(response.data));
      } catch (error) {
        showToast({ 
          title: 'Sync failed', 
          description: 'Item added locally but could not sync with server.', 
          variant: 'warning' 
        });
      }
    }
  };

  const removeFromCart = async (itemId) => {
    // Optimistic remove
    setCartItems((current) => current.filter((item) => item.id !== itemId));

    if (isAuthenticated && user?.id) {
      try {
        const response = await cartService.removeItem(user.id, itemId);
        setCartItems(normalizeServerCart(response.data));
      } catch (error) {
        showToast({ title: 'Sync failed', description: 'Item removed locally but could not sync with server.', variant: 'warning' });
      }
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    // Optimistic quantity update
    setCartItems((current) =>
      current.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
    );

    if (isAuthenticated && user?.id) {
      try {
        const response = await cartService.updateItem(user.id, itemId, { itemId, quantity });
        setCartItems(normalizeServerCart(response.data));
      } catch (error) {
        showToast({ title: 'Sync failed', description: 'Quantity updated locally but could not sync with server.', variant: 'warning' });
      }
    }
  };

  const clearCart = async () => {
    if (isAuthenticated && user?.id) {
      const response = await cartService.clearCart(user.id);
      setCartItems(normalizeServerCart(response.data));
      return;
    }

    setCartItems([]);
  };

  const value = useMemo(() => {
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryFee = cartItems.length ? 48 : 0;
    const taxes = Math.round(cartSubtotal * 0.05);
    const cartTotal = cartSubtotal + deliveryFee + taxes;

    return {
      cartItems,
      loadingCart,
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
  }, [cartItems, loadingCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
