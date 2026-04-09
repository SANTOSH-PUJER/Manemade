import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Eye, CheckCircle, Package, Truck, XCircle, User, Filter, ArrowRight, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminService } from '../services/dataService';
import AdminLayout from '../components/layout/AdminLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const { showToast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const resp = await adminService.getAllOrders();
      setOrders(resp.data);
    } catch (err) {
      showToast({ title: 'Error', description: 'Failed to load orders.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateOrderStatus(id, status);
      showToast({ title: 'Status Updated', description: `Order is now ${status.toLowerCase()}.`, tone: 'success' });
      
      // Update local state instead of full reload for smoother experience
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
    } catch (err) {
      showToast({ title: 'Error', description: 'Failed to update order status.' });
    }
  };

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

  const filtered = orders.filter(o => {
    const matchesSearch = o.id.toString().includes(searchQuery) || o.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'ALL' || o.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs = ['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'OUT FOR DELIVERY', 'DELIVERED', 'CANCELLED'];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-10">
        <div className="space-y-1">
          <Badge variant="primary" className="bg-orange-500 text-white border-0">Operations</Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight">Fulfillment Hub</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block pr-4 border-r border-black/5 dark:border-white/5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In Pipeline</p>
                <p className="text-xl sm:text-2xl font-black">{orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length}</p>
            </div>
            <Button variant="secondary" icon={Clock} onClick={loadOrders} className="w-full sm:w-auto">Refresh</Button>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl w-full sm:w-fit overflow-x-auto scrollbar-hide">
         {tabs.map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`flex-shrink-0 px-4 sm:px-6 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
               activeTab === tab ? 'bg-white dark:bg-zinc-700 text-orange-500 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
             }`}
           >
             {tab}
           </button>
         ))}
      </div>

      <Card className="overflow-hidden border-black/5 dark:border-white/5 shadow-2xl">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by ID or Customer..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 sm:h-auto bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 dark:bg-gray-900"
                />
            </div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-widest sm:px-4 whitespace-nowrap">
                Showing {filtered.length} Orders
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order Ref</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer Details</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Payment</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Current Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map((order) => {
                const config = getStatusConfig(order.status);
                const currentIndex = orderFlow.indexOf(order.status);
                const nextStatus = (currentIndex !== -1 && currentIndex < orderFlow.length - 1) 
                  ? orderFlow[currentIndex + 1] 
                  : null;

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/50 group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 dark:text-white text-lg">#{10000 + order.id}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                           {new Date(order.createdTs).toLocaleDateString()} at {new Date(order.createdTs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors">
                            <User size={18} />
                         </div>
                         <div className="flex flex-col">
                            <span className="font-black text-gray-900 dark:text-white capitalize leading-none mb-1">{order.userName}</span>
                            <span className="text-[10px] font-bold text-gray-400">{order.userMobile}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="font-black text-emerald-600 leading-none mb-1">₹{order.totalAmount}</span>
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{order.paymentMode || 'Prepaid'}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className={`flex w-fit items-center gap-1.5 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm ${config.color}`}>
                          <config.icon size={12} /> {config.label}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          {nextStatus && (
                             <button 
                                onClick={() => updateStatus(order.id, nextStatus)}
                                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-gray-900 text-white hover:bg-orange-500 shadow-lg`}
                             >
                                Next <ArrowRight size={14} />
                             </button>
                          )}
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-xl transition-all"
                          >
                            <Eye size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Enhanced Detail View Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl bg-white rounded-2xl sm:rounded-[32px] p-6 sm:p-10 shadow-huge dark:bg-gray-800 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-6 sm:mb-10 flex items-center justify-between">
                <div className="space-y-1 sm:space-y-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h3 className="text-xl sm:text-3xl font-black tracking-tight">Order Details</h3>
                        <Badge variant="primary" className="bg-orange-500 text-white border-0 py-1 font-black">#{10000 + selectedOrder.id}</Badge>
                    </div>
                    <p className="text-gray-500 text-[10px] sm:text-sm font-bold flex items-center gap-2">
                        <Clock size={12} className="sm:size-[14px]" /> Received on {new Date(selectedOrder.createdTs).toLocaleString()}
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
                            <User size={14} /> Customer Profile
                        </h4>
                        <div className="p-6 bg-gray-50 rounded-3xl dark:bg-gray-900 border border-black/5 dark:border-white/5 space-y-4">
                           <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center font-black text-xl text-orange-500 shadow-sm">
                                 {selectedOrder.userName?.[0]}
                              </div>
                              <div className="min-w-0">
                                 <p className="font-black text-lg truncate capitalize">{selectedOrder.userName}</p>
                                 <p className="text-sm font-bold text-gray-500">{selectedOrder.userMobile}</p>
                              </div>
                           </div>
                           <div className="pt-4 border-t border-black/5 dark:border-white/5">
                              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Delivery Location</p>
                              <p className="text-sm font-bold leading-relaxed dark:text-gray-300">{selectedOrder.deliveryAddress}</p>
                           </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
                           <Truck size={14} /> Delivery Workflow
                        </h4>
                        <div className="relative flex flex-col gap-4">
                           {orderFlow.map((status, idx) => {
                               const isActive = selectedOrder.status === status;
                               const isCompleted = orderFlow.indexOf(selectedOrder.status) > idx;
                               return (
                                  <div key={status} className="flex items-center gap-4 relative">
                                     {idx < orderFlow.length - 1 && (
                                        <div className={`absolute left-4 top-8 w-0.5 h-6 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                     )}
                                     <div className={`h-8 w-8 rounded-full flex items-center justify-center z-10 transition-colors ${
                                        isActive ? 'bg-orange-500 text-white shadow-glow' : 
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
                        </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
                           <ShoppingBag size={14} /> Cart Breakdown
                        </h4>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                           {selectedOrder.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-black/5 dark:border-white/5 hover:scale-[1.02] transition-transform">
                                 <div className="flex flex-col">
                                    <p className="text-sm font-black">{item.itemName}</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.attributeQuantity} • <span className="text-orange-500">Qty: {item.quantity}</span></p>
                                 </div>
                                 <p className="text-sm font-black font-mono">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                           ))}
                        </div>
                    </div>
                    
                    <div className="pt-6 sm:pt-8 border-t-2 border-black/5 dark:border-white/5 space-y-6 sm:space-y-8">
                       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                          <div>
                             <p className="text-xs sm:text-sm font-black text-gray-400 uppercase tracking-widest">Grand Total</p>
                             <p className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                          </div>
                          <Badge variant="success" className="w-fit px-4 py-2 bg-emerald-500/10 text-emerald-600 font-black border-0 rounded-xl">PAID • ONLINE</Badge>
                       </div>

                       <div className="flex flex-col gap-3 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                              <Button variant="secondary" className="border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white" onClick={() => updateStatus(selectedOrder.id, 'CANCELLED')}>Cancel Order</Button>
                              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-xl" onClick={() => updateStatus(selectedOrder.id, 'DELIVERED')}>Mark Delivered</Button>
                          </div>
                          <p className="text-[10px] font-black text-center text-gray-400 uppercase tracking-widest mt-2">Manage using the pipeline flow for automatic tracking</p>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
