import { motion } from 'framer-motion';
import { 
  BarChart3, Package, ShieldCheck, Users, 
  TrendingUp, ArrowUpRight, DollarSign, Activity 
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

const stats = [
  { label: 'Total Orders', value: '1,284', trend: '+12.5%', icon: Package, color: 'text-blue-500' },
  { label: 'Active Customers', value: '842', trend: '+5.2%', icon: Users, color: 'text-purple-500' },
  { label: 'Revenue Today', value: '₹42,500', trend: '+18.7%', icon: DollarSign, color: 'text-emerald-500' },
  { label: 'Fulfillment Rate', value: '99.2%', trend: '+0.4%', icon: ShieldCheck, color: 'text-orange-500' },
];

function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-24 pb-32">
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Badge variant="primary">Management</Badge>
          <h1 className="font-display text-5xl font-black tracking-tight leading-tight">Admin Console</h1>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="secondary">Download Report</Button>
           <Button>Add New Item</Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 space-y-4 shadow-xl border-black/5 dark:border-white/5 relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  {stat.trend}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{stat.label}</p>
                <p className="text-3xl font-black">{stat.value}</p>
              </div>
              
              {/* Abs Decor */}
              <div className="absolute -bottom-4 -right-4 h-20 w-20 bg-black/5 rounded-full blur-2xl group-hover:bg-[var(--accent-strong)]/10 transition-colors duration-500" />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
         {/* placeholder for recent activity */}
         <Card className="lg:col-span-2 p-8 space-y-6 shadow-xl border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black tracking-tight">Recent Orders</h3>
               <button className="text-xs font-black uppercase tracking-widest text-[var(--accent-strong)] hover:underline flex items-center gap-1">
                  View All <ArrowUpRight size={14} />
               </button>
            </div>
            <div className="space-y-4">
               {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-black/5 dark:border-white/5 last:border-none">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-[var(--surface-muted)] flex items-center justify-center text-xs font-black">
                           #{1024 + i}
                        </div>
                        <div>
                           <p className="text-sm font-black">Customer #{i}</p>
                           <p className="text-xs font-medium text-[var(--text-muted)]">2 mins ago</p>
                        </div>
                     </div>
                     <div className="text-right space-y-1">
                        <p className="text-sm font-black">₹{1200 + i * 150}</p>
                        <Badge>Processing</Badge>
                     </div>
                  </div>
               ))}
            </div>
         </Card>

         <Card className="p-8 space-y-8 shadow-xl border-black/5 dark:border-white/5 bg-black text-white border-none">
            <div className="space-y-2">
               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-strong)] text-white shadow-lg">
                  <Activity size={24} />
               </div>
               <h3 className="text-2xl font-black tracking-tight pt-4">System Health</h3>
               <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Real-time status</p>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/70">
                     <span>Server Load</span>
                     <span>42%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full w-[42%] bg-[var(--accent-strong)]" />
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/70">
                     <span>Database Latency</span>
                     <span>12ms</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full w-[12%] bg-emerald-500" />
                  </div>
               </div>
            </div>

            <Button className="w-full bg-white text-black hover:bg-white/90">Open System Logs</Button>
         </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;

