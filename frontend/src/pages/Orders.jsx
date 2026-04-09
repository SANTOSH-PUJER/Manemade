import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  PackageCheck, Clock, CheckCircle2, ChevronRight, 
  MapPin, ShoppingBag, ArrowLeft, XCircle, Truck, Package, CheckCircle, User, CreditCard
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/dataService';
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
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await orderService.cancelOrder(orderId, user.id);
      showToast({ title: 'Order Cancelled', description: 'Your order has been cancelled successfully.', tone: 'success' });
      
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: 'CANCELLED' });
      }
    } catch (err) {
      showToast({ title: 'Error', description: err.response?.data?.message || 'Failed to cancel order.' });
    }
  };

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

  const getStatusConfig = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING': return { icon: Clock, color: 'text-amber-500 bg-amber-500/10', label: 'Received' };
      case 'CONFIRMED': return { icon: CheckCircle, color: 'text-blue-500 bg-blue-500/10', label: 'Confirmed' };
      case 'PREPARING': return { icon: Package, color: 'text-purple-500 bg-purple-500/10', label: 'Preparing' };
      case 'OUT FOR DELIVERY': return { icon: Truck, color: 'text-orange-500 bg-orange-500/10', label: 'On Way' };
      case 'DELIVERED': return { icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10', label: 'Delivered' };
      case 'CANCELLED': return { icon: XCircle, color: 'text-rose-500 bg-rose-500/10', label: 'Cancelled' };
      default: return { icon: ShoppingBag, color: 'text-gray-500 bg-gray-500/10', label: status };
    }
  };

  const orderFlow = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT FOR DELIVERY', 'DELIVERED'];

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
              onClick={() => setSelectedOrder(order)}
              className="cursor-pointer"
            >
              <Card className="group relative overflow-hidden p-8 shadow-xl border-black/5 dark:border-white/5 hover:border-orange-500/20 transition-all duration-500 hover:shadow-2xl">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    {/* Visual Status Indicator */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--accent-strong)]">
                       <PackageCheck size={32} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                         <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Order #{order.id}</p>
                         <div className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getStatusConfig(order.status).color}`}>
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
                       className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--text-primary)] transition-all hover:bg-orange-500 hover:text-white group-hover:translate-x-2 shadow-lg"
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
       
       {/* Tracking Modal */}
       <AnimatePresence>
         {selectedOrder && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="w-full max-w-3xl bg-white rounded-2xl sm:rounded-[32px] p-6 sm:p-10 shadow-huge dark:bg-gray-800 relative max-h-[90vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}
             >
               <div className="mb-6 sm:mb-10 flex items-center justify-between">
                 <div className="space-y-1 sm:space-y-2">
                     <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                         <h3 className="text-xl sm:text-3xl font-black tracking-tight">Order Tracking</h3>
                         <Badge variant="primary" className="bg-orange-500 text-white border-0 py-1 font-black">#{10000 + selectedOrder.id}</Badge>
                     </div>
                     <p className="text-gray-500 text-[10px] sm:text-sm font-bold flex items-center gap-2">
                         <Clock size={12} className="sm:size-[14px]" /> Placed on {new Date(selectedOrder.createdTs).toLocaleString()}
                     </p>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-gray-100 flex items-center justify-center dark:hover:bg-gray-700 transition-colors">
                     <XCircle size={24} className="sm:size-[28px]" />
                 </button>
               </div>
 
               <div className="grid gap-10 lg:grid-cols-2">
                  <div className="space-y-8">
                     <div className="space-y-4">
                         <h4 className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
                             <Truck size={14} /> Tracking Progress
                         </h4>
                         <div className="relative flex flex-col gap-4 py-4 px-2">
                            {orderFlow.map((status, idx) => {
                                const isActive = selectedOrder.status === status;
                                const isCompleted = orderFlow.indexOf(selectedOrder.status) > idx;
                                return (
                                   <div key={status} className="flex items-center gap-4 relative">
                                      {idx < orderFlow.length - 1 && (
                                         <div className={`absolute left-4 top-8 w-0.5 h-6 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                      )}
                                      <div className={`h-8 w-8 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                                         isActive ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] scale-110' : 
                                         isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                                      }`}>
                                         {isCompleted ? <CheckCircle size={14} /> : idx + 1}
                                      </div>
                                      <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-orange-500' : isCompleted ? 'text-emerald-500' : 'text-gray-400'}`}>
                                         {status}
                                      </span>
                                   </div>
                                );
                            })}
                            {selectedOrder.status === 'CANCELLED' && (
                               <div className="flex items-center gap-4 relative mt-2">
                                  <div className="h-8 w-8 rounded-full flex items-center justify-center z-10 bg-rose-500 text-white shadow-glow">
                                     <XCircle size={14} />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">CANCELLED</span>
                               </div>
                            )}
                         </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
                           <MapPin size={14} /> Delivery Info
                        </h4>
                        <div className="p-6 bg-gray-50 rounded-3xl dark:bg-gray-900 border border-black/5 dark:border-white/5">
                           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Recipient & Address</p>
                           <p className="text-sm font-bold leading-relaxed dark:text-gray-300">
                             {selectedOrder.deliveryAddress || 'Pick up from Manemade Hub'}
                           </p>
                        </div>
                     </div>
                  </div>
 
                  <div className="space-y-8">
                     <div className="space-y-4">
                         <h4 className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
                            <ShoppingBag size={14} /> Order Summary
                         </h4>
                         <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                            {selectedOrder.items?.map((item, idx) => (
                               <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                                  <div className="flex flex-col">
                                     <p className="text-sm font-black">{item.itemName}</p>
                                     <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                       {item.attributeQuantity || 'Regular'} • <span className="text-orange-500">Qty: {item.quantity}</span>
                                     </p>
                                  </div>
                                  <p className="text-sm font-black">₹{(item.price * item.quantity).toLocaleString()}</p>
                               </div>
                            ))}
                         </div>
                     </div>
                     
                     <div className="pt-6 border-t-2 border-black/5 dark:border-white/5 space-y-6">
                        <div className="flex justify-between items-center">
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                              <p className="text-3xl font-black text-emerald-600">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                           </div>
                           <div className="flex flex-col items-end gap-1">
                              <Badge variant="success" className="bg-emerald-500/10 text-emerald-600 font-black border-0 rounded-xl px-4 py-2">
                                 {selectedOrder.paymentMode?.toUpperCase() || 'PREPAID'}
                              </Badge>
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                <CreditCard size={10} /> Transaction Secure
                              </span>
                           </div>
                        </div>

                        {selectedOrder.status === 'PENDING' && (
                           <div className="pt-6">
                              <Button 
                                variant="secondary" 
                                className="w-full border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl"
                                onClick={() => handleCancelOrder(selectedOrder.id)}
                              >
                                 Cancel Order
                              </Button>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
     </div>
  );
}

export default Orders;

