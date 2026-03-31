import { useEffect, useMemo, useState } from 'react';
import { CreditCard, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuantitySelector from '../components/ui/QuantitySelector';
import SectionHeading from '../components/ui/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { addressService } from '../services/userService';
import api from '../services/userService';

function Checkout() {
  const { user } = useAuth();
  const { cartItems, cartSubtotal, deliveryFee, taxes, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState([]);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const loadAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const response = await addressService.getAddresses(user.id);
        setAddresses(response.data || []);
      } catch (error) {
        showToast({ title: 'Could not load addresses', description: error.response?.data?.message || 'Please add an address before checkout.' });
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [showToast, user?.id]);

  const selectedAddress = useMemo(() => addresses.find((address) => address.default) || addresses[0], [addresses]);

  const handleCheckout = async () => {
    if (!user?.id || !selectedAddress) {
      showToast({ title: 'Address required', description: 'Please save a delivery address before placing the order.' });
      return;
    }

    setPlacingOrder(true);
    try {
      await api.post('/order/place', {
        userId: user.id,
        addressId: selectedAddress.id,
        items: cartItems.map((item) => ({ itemId: item.id, quantity: item.quantity })),
      });
      clearCart();
      showToast({ title: 'Order placed successfully', description: 'Your meal is now being prepared.', tone: 'success' });
    } catch (error) {
      showToast({ title: 'Checkout failed', description: error.response?.data?.message || 'Please verify your cart items and try again.' });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="rounded-[40px] border border-dashed border-white/15 bg-white/60 p-12 text-center shadow-[var(--shadow-soft)] dark:bg-white/5">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]"><ShoppingBag size={28} /></div>
        <h1 className="mt-6 font-display text-4xl font-semibold">Your cart is empty</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">The cart page now has a cleaner premium layout with room for payment, address, coupon, and delivery integrations.</p>
        <Link to="/shop" className="mt-8 inline-flex rounded-full bg-[var(--accent-gradient)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)]">Browse dishes</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6">
        <SectionHeading eyebrow="Cart" title="A cleaner checkout flow with emphasis on quantity control and order clarity" description="This screen is redesigned to highlight what matters most before payment: items, totals, and clear actions." />

        <div className="space-y-4">
          {cartItems.map((item) => (
            <article key={item.id} className="grid gap-4 rounded-[32px] border border-white/10 bg-white/70 p-5 shadow-[var(--shadow-soft)] dark:bg-white/5 sm:grid-cols-[120px_1fr_auto]">
              <img src={item.image} alt={item.name} className="h-28 w-full rounded-[24px] object-cover sm:h-32" />
              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">{item.deliveryTime}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">{item.name}</h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">Rs. {item.price} each</p>
                <QuantitySelector compact quantity={item.quantity} onDecrease={() => updateQuantity(item.id, item.quantity - 1)} onIncrease={() => updateQuantity(item.id, item.quantity + 1)} />
              </div>
              <div className="flex flex-col items-start justify-between sm:items-end">
                <p className="text-2xl font-semibold">Rs. {item.price * item.quantity}</p>
                <button type="button" onClick={() => removeFromCart(item.id)} className="text-sm font-medium text-rose-500 transition hover:text-rose-600">Remove</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="space-y-6 rounded-[36px] border border-white/10 bg-white/70 p-7 shadow-[var(--shadow-strong)] dark:bg-white/5">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">Order summary</p>
          <h2 className="mt-3 font-display text-3xl font-semibold">Ready for checkout</h2>
        </div>

        <div className="space-y-4 rounded-[28px] bg-[var(--surface-muted)] p-5">
          <div className="flex items-center justify-between text-sm"><span className="text-[var(--text-secondary)]">Subtotal</span><span>Rs. {cartSubtotal}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-[var(--text-secondary)]">Delivery</span><span>Rs. {deliveryFee}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-[var(--text-secondary)]">Taxes</span><span>Rs. {taxes}</span></div>
          <div className="border-t border-white/10 pt-4"><div className="flex items-center justify-between text-lg font-semibold"><span>Total</span><span>Rs. {cartTotal}</span></div></div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[var(--surface-muted)] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">Delivery address</p>
          {loadingAddresses ? (
            <p className="mt-3 text-sm text-[var(--text-secondary)]">Loading saved addresses...</p>
          ) : selectedAddress ? (
            <div className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>{selectedAddress.line1}</p>
              {selectedAddress.line2 && <p>{selectedAddress.line2}</p>}
              <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-rose-500">No saved address found for this account.</p>
          )}
        </div>

        <button type="button" onClick={handleCheckout} disabled={placingOrder || loadingAddresses || !selectedAddress} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-gradient)] px-6 py-4 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"><CreditCard size={18} />{placingOrder ? 'Placing order...' : 'Proceed to Checkout'}</button>
        <button type="button" onClick={clearCart} className="w-full rounded-full border border-white/15 px-6 py-4 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">Clear cart</button>
      </aside>
    </div>
  );
}

export default Checkout;
