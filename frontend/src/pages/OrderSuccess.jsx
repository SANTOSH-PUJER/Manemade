import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ArrowRight, Home } from 'lucide-react';
import { Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const paymentMethod = location.state?.paymentMethod;

  if (!order) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-32">
      <div className="flex flex-col items-center text-center space-y-12">
        {/* Animated Success Icon */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative"
        >
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-2xl shadow-emerald-500/20">
            <CheckCircle2 size={64} strokeWidth={2.5} />
          </div>
          {/* Decorative Rings */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 -z-10 rounded-full border-2 border-emerald-500/20" 
          />
        </motion.div>

        <div className="space-y-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl font-black tracking-tight"
          >
            Order Confirmed!
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-medium text-[var(--text-secondary)] max-w-lg mx-auto"
          >
            Your order <span className="text-[var(--text-primary)] font-black">#{order.id}</span> has been placed and is now heading to our kitchen.
          </motion.p>
        </div>

        {/* Order Details Card */}
        <motion.div
           initial={{ y: 30, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="w-full"
        >
          <Card className="grid gap-8 p-8 border-black/5 dark:border-white/5 sm:grid-cols-3 bg-[var(--surface-muted)]/50">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Delivery Status</p>
              <p className="text-xl font-black text-emerald-500 italic">Preparing</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Total Amount</p>
              <p className="text-xl font-black text-[var(--accent-strong)]">₹{order.totalAmount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Payment</p>
              <p className="text-xl font-black text-[var(--text-primary)] uppercase">{paymentMethod || 'Paid'}</p>
            </div>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
           initial={{ y: 30, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="flex flex-wrap items-center justify-center gap-6"
        >
          <Button size="lg" className="px-12 py-6 text-lg" onClick={() => navigate('/orders')}>
            Track Your Order
            <ArrowRight size={20} className="ml-2" />
          </Button>
          <Button variant="ghost" size="lg" className="px-12 py-6 text-lg" onClick={() => navigate('/shop')}>
            Back to Shop
          </Button>
        </motion.div>

        {/* Informational Note */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="flex items-center gap-3 pt-12 text-[var(--text-muted)]"
        >
          <ShoppingBag size={18} />
          <p className="text-xs font-bold uppercase tracking-widest">A copy of your receipt has been sent to your email.</p>
        </motion.div>
      </div>
    </div>
  );
}

export default OrderSuccess;

