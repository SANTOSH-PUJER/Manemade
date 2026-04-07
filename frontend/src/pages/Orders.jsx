import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  PackageCheck, Clock, CheckCircle2, ChevronRight, 
  MapPin, ShoppingBag, ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/userService';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/order/user/${user.id}`);
        setOrders(response.data || []);
      } catch (error) {
        showToast({ title: 'Error', description: 'Failed to load order history.' });
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [showToast, user?.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 pt-24 pb-32 space-y-8">
        <Skeleton height="h-12" width="w-48" />
        <div className="space-y-4">
          <Skeleton height="h-40" className="rounded-[var(--radius-lg)]" />
          <Skeleton height="h-40" className="rounded-[var(--radius-lg)]" />
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'cancelled': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-32 bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-500">
      <div className="mb-12 flex items-center justify-between">
        <div className="space-y-2">
          <Badge variant="primary">History</Badge>
          <h1 className="font-display text-5xl font-black tracking-tight">Your Orders</h1>
        </div>
        <Button variant="ghost" onClick={() => navigate('/shop')} icon={ArrowLeft}>
          Back to Shop
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-20 text-center space-y-6 bg-gray-50 border-dashed border-2 dark:bg-gray-800/50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl text-[var(--text-muted)] dark:bg-gray-800">
            <ShoppingBag size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black">No orders found.</h3>
            <p className="text-sm font-bold text-[var(--text-secondary)] max-w-xs mx-auto">
              Once you place an order, it will appear here with real-time status updates.
            </p>
          </div>
          <Button onClick={() => navigate('/shop')}>Start Ordering</Button>
        </Card>
      ) : (
        <div className="space-y-8">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group relative overflow-hidden p-8 shadow-xl border-black/5 dark:border-white/5 hover:border-[var(--accent-strong)]/20 transition-all duration-500">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    {/* Visual Status Indicator */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--accent-strong)]">
                       <PackageCheck size={32} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                         <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Order #{order.id}</p>
                         <div className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                            {order.status}
                         </div>
                      </div>
                      <h3 className="font-display text-2xl font-black truncate max-w-md">
                              {order.items?.map(i => i.itemName).join(', ') || 'Homemade order'}
                      </h3>
                      <div className="flex items-center gap-4 text-xs font-black text-[var(--text-secondary)]">
                         <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(order.createdTs).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                         <span className="h-1 w-1 rounded-full bg-black/10" />
                         <span className="flex items-center gap-1.5"><MapPin size={14} /> Local Pickup</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex border-t border-black/5 pt-8 lg:border-none lg:pt-0 items-center justify-between lg:justify-end gap-12">
                     <div className="text-left lg:text-right space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Paid Amount</p>
                        <p className="text-3xl font-black">₹{order.totalAmount}</p>
                     </div>
                     <button 
                       onClick={() => navigate(`/checkout`)} // Logic for "Order Again" could go here
                       className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--text-primary)] transition-all hover:bg-black hover:text-white group-hover:translate-x-2"
                     >
                       <ChevronRight size={24} />
                     </button>
                  </div>
                </div>

                {/* Status Dot */}
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-12 -translate-y-12 rotate-45 bg-[var(--accent-strong)]/5" />
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;

