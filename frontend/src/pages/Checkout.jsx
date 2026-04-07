import { motion } from 'framer-motion';
import { CreditCard, Landmark, MapPin, Smartphone, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import QuantitySelector from '../components/ui/QuantitySelector';
import Skeleton from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/dataService';
import { addressService } from '../services/userService';

const paymentOptions = [
  { id: 'upi', label: 'UPI', icon: Smartphone, description: 'Pay via PhonePe, GPay' },
  { id: 'card', label: 'Card', icon: CreditCard, description: 'Debit or Credit cards' },
  { id: 'cod', label: 'Cash', icon: Landmark, description: 'Pay at your door' },
];

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, loadingCart, cartSubtotal, deliveryFee, taxes, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState([]);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  useEffect(() => {
    if (!user?.id) return;
    const loadAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const response = await addressService.getAddresses(user.id);
        const nextAddresses = response.data || [];
        setAddresses(nextAddresses);
        const defaultAddr = nextAddresses.find((a) => a.default) || nextAddresses[0];
        setSelectedAddressId(defaultAddr?.id || null);
      } catch (error) {
        showToast({ title: 'Error', description: 'Could not load your saved addresses.' });
      } finally {
        setLoadingAddresses(false);
      }
    };
    loadAddresses();
  }, [showToast, user?.id]);

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      showToast({ title: 'Address missing', description: 'Please select a delivery address.' });
      return;
    }

    setPlacingOrder(true);
    try {
      const response = await orderService.placeOrder({
        userId: user.id,
        addressId: selectedAddressId,
        paymentMode: paymentMethod,
        items: cartItems.map((item) => ({ itemId: item.id, quantity: item.quantity })),
      });
      await clearCart();
      showToast({ title: 'Success', description: 'Your order has been placed!', tone: 'success' });
      navigate('/order-success', { state: { order: response.data, paymentMethod } });
    } catch (error) {
      showToast({ title: 'Checkout failed', description: 'Payment or placement failed. Try again.' });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loadingCart) {
    return (
      <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-24 pb-32">
        <Skeleton height="h-[600px]" className="rounded-[var(--radius-xl)]" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-12 pb-32 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 py-20 rounded-[var(--radius-xl)] border-2 border-dashed border-black/5 dark:border-white/5">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--accent-strong)]">
            <ShoppingBag size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-4xl font-black">Your basket is empty.</h1>
            <p className="text-[var(--text-muted)] font-medium max-w-md mx-auto">Looks like you haven't added any North Karnataka delights to your basket yet.</p>
          </div>
          <Button size="lg" onClick={() => navigate('/shop')} className="px-12">
            Discover Flavors
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-24 pb-32">
      <div className="mb-12 flex items-center justify-between">
        <h1 className="font-display text-5xl font-black tracking-tight">Your Basket</h1>
        <button onClick={clearCart} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-500 hover:underline">
          <Trash2 size={14} />
          Clear All
        </button>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* Left: Cart Items */}
        <section className="space-y-6">
          {cartItems.map((item) => (
            <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="group relative flex flex-col gap-6 rounded-[var(--radius-lg)] border border-black/5 bg-[var(--surface)] p-6 shadow-sm transition-all hover:bg-[var(--surface-muted)] dark:border-white/5 sm:flex-row sm:items-center">
                <img src={item.image} alt={item.name} className="h-28 w-28 rounded-[24px] object-cover shadow-md transition-transform duration-500 group-hover:scale-105" />
                <div className="flex-1 space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-strong)]">{item.deliveryTime}</p>
                   <h3 className="font-display text-2xl font-black">{item.name}</h3>
                   <p className="text-sm font-bold text-[var(--text-muted)]">₹{item.price} per unit</p>
                </div>
                <div className="flex items-center gap-8">
                  <QuantitySelector 
                    size="sm" 
                    quantity={item.quantity} 
                    onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                    onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                  />
                  <p className="w-24 text-right text-2xl font-black">₹{item.price * item.quantity}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-[var(--text-muted)] hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Right: Checkout Sidebar */}
        <aside className="sticky top-28 h-fit space-y-8">
          <Card className="p-8 space-y-8 border-[var(--accent-strong)]/10 shadow-2xl">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-black leading-tight">Order Summary</h2>
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{cartItems.length} items to be delivered</p>
            </div>

            <div className="space-y-4 text-sm font-bold">
              <div className="flex justify-between text-[var(--text-secondary)]"><span>Subtotal</span><span>₹{cartSubtotal}</span></div>
              <div className="flex justify-between text-[var(--text-secondary)]"><span>Delivery</span><span>₹{deliveryFee}</span></div>
              <div className="flex justify-between text-[var(--text-secondary)]"><span>Taxes</span><span>₹{taxes}</span></div>
              <div className="pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex justify-between text-2xl font-black text-[var(--accent-strong)]"><span>Total</span><span>₹{cartTotal}</span></div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Deliver to</p>
                    <Link to="/profile" className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-strong)] hover:underline">Manage</Link>
                  </div>
                  {loadingAddresses ? (
                    <div className="space-y-2">
                      <Skeleton height="h-20" className="rounded-2xl" />
                      <Skeleton height="h-20" className="rounded-2xl" />
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="space-y-3">
                      {addresses.map(addr => (
                        <label 
                          key={addr.id} 
                          className={`group relative flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-5 transition-all duration-300 
                            ${selectedAddressId === addr.id 
                              ? 'border-[var(--accent-strong)] bg-[var(--accent-soft)] shadow-lg scale-[1.02]' 
                              : 'border-black/8 bg-[var(--surface)] hover:border-black/20 hover:bg-[var(--surface-muted)] dark:border-white/10 dark:hover:border-white/20'
                            }`}
                        >
                          <div className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors 
                            ${selectedAddressId === addr.id ? 'border-[var(--accent-strong)] bg-[var(--accent-strong)]' : 'border-[var(--text-muted)]'}`}
                          >
                            {selectedAddressId === addr.id && <div className="h-2 w-2 rounded-full bg-white" />}
                          </div>
                          <input 
                            type="radio" 
                            className="SR-only hidden" 
                            name="address"
                            checked={selectedAddressId === addr.id} 
                            onChange={() => setSelectedAddressId(addr.id)} 
                          />
                           <div className="min-w-0 flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg text-xs ${addr.addressType === 'Home' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                       {addr.addressType || 'Home'}
                                    </div>
                                    <p className={`text-base font-black transition-colors ${selectedAddressId === addr.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                      {addr.recipientName || user.firstName}
                                    </p>
                                 </div>
                                 {addr.default && <Badge variant="primary" className="scale-75 origin-right">Default</Badge>}
                              </div>
                              <p className={`text-sm font-bold transition-colors ${selectedAddressId === addr.id ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
                                {addr.line1}, {addr.city}
                              </p>
                              <p className="text-[10px] font-bold opacity-70">{addr.recipientPhone || user.mobileNumber}</p>
                           </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <Link to="/profile" className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-rose-500/30 bg-rose-500/5 p-8 text-center transition-all hover:bg-rose-500/10 hover:border-rose-500/50">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                        <MapPin size={24} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-rose-600">No addresses found</p>
                        <p className="text-xs font-bold text-rose-500/70">Add a delivery address to proceed with your order</p>
                      </div>
                      <Button variant="secondary" size="sm" className="mt-2 h-10 px-8 text-rose-600 border-rose-500/20">Add Address</Button>
                    </Link>
                  )}
               </div>

               <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Payment Mode</p>
                  <div className="grid gap-2">
                    {paymentOptions.map(opt => (
                      <button key={opt.id} onClick={() => setPaymentMethod(opt.id)} className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${paymentMethod === opt.id ? 'border-[var(--accent-strong)] bg-black text-white shadow-xl' : 'border-black/5 hover:bg-[var(--surface-muted)]'}`}>
                        <opt.icon size={20} className={paymentMethod === opt.id ? 'text-[var(--accent-strong)]' : 'text-[var(--text-muted)]'} />
                        <div>
                          <p className="text-sm font-black">{opt.label}</p>
                          <p className={`text-[10px] font-bold ${paymentMethod === opt.id ? 'text-white/60' : 'text-[var(--text-muted)]'}`}>{opt.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <Button size="lg" className="w-full py-8 text-xl shadow-2xl" disabled={placingOrder || !selectedAddressId} onClick={handleCheckout}>
              {placingOrder ? 'Confirming...' : 'Place Order'}
              {!placingOrder && <ArrowRight size={22} className="ml-2" />}
            </Button>
          </Card>
          
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Powered by Secure Gateway
          </p>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;

