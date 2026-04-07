import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { cartService } from '../services/dataService';

const CartContext = createContext(undefined);

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
    rating: 4.5, // Default UI fallback
    deliveryTime: formatDeliveryTime(25),
    category: item.categoryName,
    quantity: item.quantity,
  }));

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    const syncBackendCart = async () => {
      if (!isAuthenticated || !user?.id) {
        setCartItems([]);
        setLoadingCart(false);
        return;
      }

      setLoadingCart(true);
      try {
        const response = await cartService.getCart(user.id);
        setCartItems(normalizeServerCart(response.data));
      } catch (error) {
        showToast({ 
          title: 'Cart sync failed', 
          description: error.response?.data?.message || 'Could not load your cart from the backend.',
          variant: 'error'
        });
        setCartItems([]);
      } finally {
        setLoadingCart(false);
      }
    };

    syncBackendCart();
  }, [isAuthenticated, showToast, user?.id]);


  const addToCart = async (item, quantity = 1) => {
    if (!isAuthenticated || !user?.id) {
      showToast({ 
        title: 'Login Required', 
        description: 'Please login to add items to your cart.',
        variant: 'warning'
      });
      return;
    }

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

    try {
      const response = await cartService.addItem({ userId: user.id, itemId: item.id, quantity });
      setCartItems(normalizeServerCart(response.data));
      showToast({ title: 'Added to cart', description: `${item.name} added successfully.` });
    } catch (error) {
      showToast({ 
        title: 'Sync failed', 
        description: 'Could not sync item with server.', 
        variant: 'error' 
      });
      // Revert optimistic update by refetching
      const response = await cartService.getCart(user.id);
      setCartItems(normalizeServerCart(response.data));
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
