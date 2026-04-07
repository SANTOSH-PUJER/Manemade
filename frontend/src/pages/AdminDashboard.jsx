import { motion } from 'framer-motion';
import { 
  Package, Users, DollarSign, Activity, 
  TrendingUp, ArrowUpRight, ShoppingBag, 
  ChevronRight, Star, Clock, AlertCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/userService';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import AdminLayout from '../components/layout/AdminLayout';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsResp, trendsResp, topItemsResp, ordersResp] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/trends'),
          api.get('/admin/top-items'),
          api.get('/admin/orders')
        ]);
        
        setStats(statsResp.data);
        setTrends(trendsResp.data);
        setTopItems(topItemsResp.data);
        setRecentOrders(ordersResp.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, sub: stats?.todayRevenue > 0 ? `+₹${stats.todayRevenue} today` : 'No sales today', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, sub: `${stats?.todayOrders || 0} today`, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Customers', value: stats?.totalUsers || 0, sub: 'Active base', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Total Items', value: stats?.totalItems || 0, sub: 'Available menu', icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  if (loading) {
     return (
       <AdminLayout>
         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
           {[1, 2, 3, 4].map(i => <Skeleton key={i} height="h-32" />)}
         </div>
         <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <Skeleton className="lg:col-span-2" height="h-96" />
            <Skeleton height="h-96" />
         </div>
       </AdminLayout>
     );
  }

  // Simple SVG Chart Logic
  const maxRevenue = Math.max(...trends.map(t => t.revenue), 1000);
  const chartPoints = trends.map((t, i) => {
    const x = (i / (trends.length - 1)) * 100;
    const y = 100 - (t.revenue / maxRevenue) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <AdminLayout>
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="bg-orange-500 text-white border-0">Live Systems</Badge>
            {stats?.shopStatus === 'OPEN' ? (
                <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest pl-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Shop Open
                </span>
            ) : (
                <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-500 uppercase tracking-widest pl-2">
                    <div className="h-2 w-2 rounded-full bg-rose-500" /> Shop Closed
                </span>
            )}
          </div>
          <h1 className="font-display text-5xl font-black tracking-tight leading-tight">Overview</h1>
        </div>
        <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Server Time</p>
                 <p className="text-sm font-black">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
             </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 space-y-4 shadow-xl border-black/5 dark:border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                  <stat.icon size={24} />
                </div>
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={16} />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                </div>
                <p className="text-[10px] font-bold text-gray-400">{stat.sub}</p>
              </div>
              
              <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-current opacity-[0.03] rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500" style={{ color: 'inherit' }} />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
         {/* Revenue Trends Chart */}
         <Card className="lg:col-span-2 p-8 space-y-8 shadow-xl border-black/5 dark:border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-2xl font-black tracking-tight">Revenue Trends</h3>
                  <p className="text-sm font-bold text-gray-400">Past 30 days performance</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <div className="h-3 w-3 rounded-full bg-orange-500 shadow-glow" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Gross Sales</span>
                  </div>
               </div>
            </div>
            
            <div className="h-64 w-full relative pt-4">
               {trends.length > 1 ? (
                 <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path 
                        d={`M 0,100 L ${chartPoints} L 100,100 Z`} 
                        fill="url(#chartGradient)" 
                    />
                    <polyline
                        fill="none"
                        stroke="#FF6B00"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={chartPoints}
                        className="drop-shadow-lg"
                    />
                 </svg>
               ) : (
                 <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl dark:border-gray-800">
                    <p className="text-gray-400 font-bold">Accumulating more data...</p>
                 </div>
               )}
            </div>
            
            <div className="flex justify-between px-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <span>{trends[0]?.date || ''}</span>
                <span>{trends[Math.floor(trends.length/2)]?.date || ''}</span>
                <span>{trends[trends.length-1]?.date || 'Today'}</span>
            </div>
         </Card>

         {/* Top Performing Items */}
         <Card className="p-8 space-y-8 shadow-xl border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black tracking-tight">Best Sellers</h3>
               <Link to="/admin/items" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <ChevronRight size={20} />
               </Link>
            </div>
            
            <div className="space-y-6">
               {topItems.length > 0 ? topItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                     <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black flex-shrink-0">
                           #{idx + 1}
                        </div>
                        <div className="min-w-0">
                           <p className="font-black truncate group-hover:text-orange-500 transition-colors">{item.name}</p>
                           <p className="text-[10px] font-bold text-gray-400">{item.orders} Orders</p>
                        </div>
                     </div>
                     <div className="h-2 w-24 bg-gray-100 rounded-full dark:bg-gray-800 overflow-hidden hidden sm:block">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(item.orders / topItems[0].orders) * 100}%` }}
                           className="h-full bg-orange-500" 
                        />
                     </div>
                  </div>
               )) : (
                 <div className="py-12 text-center space-y-3">
                    <Star size={32} className="mx-auto text-gray-200" />
                    <p className="text-xs font-bold text-gray-400">No sales data yet</p>
                 </div>
               )}
            </div>
            
            <div className="pt-4 border-t border-black/5 dark:border-white/5">
                <div className="p-4 rounded-2xl bg-gray-900 dark:bg-zinc-800 text-white space-y-3">
                    <div className="flex items-center gap-3">
                        <Activity className="text-orange-500" size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">Platform Activity</span>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold opacity-60">
                            <span>System Load</span>
                            <span>Optimal</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full">
                            <div className="h-full w-1/4 bg-emerald-500 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
         </Card>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
         {/* Recent Orders List */}
         <Card className="p-8 space-y-6 shadow-xl border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black tracking-tight">Recent Activity</h3>
               <Link to="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:underline">View All Orders</Link>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="border-b border-black/5 dark:border-white/5">
                     <tr>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order</th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                     {recentOrders.length > 0 ? recentOrders.map((order) => (
                        <tr key={order.id} className="group">
                           <td className="py-4">
                              <span className="font-black">#{10000 + order.id}</span>
                           </td>
                           <td className="py-4">
                              <p className="text-sm font-bold truncate max-w-[120px]">{order.userName}</p>
                           </td>
                           <td className="py-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                                 order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-600' : 
                                 order.status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-600' : 'bg-orange-500/10 text-orange-600'
                              }`}>
                                 {order.status}
                              </span>
                           </td>
                           <td className="py-4 text-right">
                              <span className="font-black font-mono">₹{order.totalAmount}</span>
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan="4" className="py-12 text-center text-gray-400 font-bold">No recent orders</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </Card>

         {/* Quick Actions & System Info */}
         <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 bg-orange-500 text-white space-y-4 hover:shadow-2xl hover:shadow-orange-500/20 transition-all cursor-pointer group">
                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock size={20} />
                </div>
                <div>
                    <h4 className="font-black text-lg">Shift Control</h4>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Toggle Shop Availability</p>
                </div>
            </Card>
            
            <Card className="p-6 bg-white dark:bg-gray-800 border-black/5 dark:border-white/5 space-y-4 hover:shadow-2xl transition-all cursor-pointer group">
                <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertCircle size={20} className="text-orange-500" />
                </div>
                <div>
                    <h4 className="font-black text-lg">Alerts</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">3 Items Out of Stock</p>
                </div>
            </Card>

            <Card className="col-span-2 p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Star size={20} />
                        </div>
                        <Badge variant="primary" className="bg-white/20 border-0 text-[10px]">Cloud Pro</Badge>
                    </div>
                    <div>
                        <h4 className="font-black text-xl leading-tight">Industry Level Integration Complete</h4>
                        <p className="text-xs font-bold opacity-80 mt-1">Full control + Advanced Analytics + Global Settings active.</p>
                    </div>
                </div>
                <div className="absolute -right-8 -bottom-8 h-48 w-48 bg-white/10 rounded-full blur-3xl" />
            </Card>
         </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
