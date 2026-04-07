import { motion } from 'framer-motion';
import { 
  CreditCard, Search, ArrowUpRight, 
  CheckCircle, XCircle, Clock, 
  Filter, Download, Calendar, 
  DollarSign, Activity, FileText
} from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/userService';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const { showToast } = useToast();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/admin/payments');
      setPayments(resp.data);
    } catch (err) {
      showToast({ title: 'Error', description: 'Failed to load transaction logs.' });
    } finally {
      setLoading(false);
    }
  };

  const filtered = payments.filter(p => {
    const matchesSearch = p.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.user?.mobileNumber?.includes(searchQuery);
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: payments.reduce((acc, p) => acc + (p.status === 'SUCCESS' ? p.amount : 0), 0),
    count: payments.filter(p => p.status === 'SUCCESS').length,
    failed: payments.filter(p => p.status === 'FAILED').length
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-12">
        <div className="space-y-1">
          <Badge variant="primary" className="bg-emerald-500 text-white border-0">Financial Hub</Badge>
          <h1 className="font-display text-4xl font-black tracking-tight leading-tight">Transactions</h1>
        </div>
        <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest border border-black/5 dark:border-white/5 hover:bg-gray-50 transition-all">
                <Download size={14} /> Export CSV
            </button>
            <div className="h-10 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2" />
            <div className="text-right">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Gross Volume</p>
                <p className="text-2xl font-black">₹{stats.total.toLocaleString()}</p>
            </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3 mb-10">
          <Card className="p-6 bg-emerald-500 text-white space-y-4 shadow-xl shadow-emerald-500/10">
              <div className="flex justify-between items-start">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <CheckCircle size={20} />
                  </div>
                  <ArrowUpRight size={18} className="opacity-40" />
              </div>
              <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 text-white">Successful</p>
                  <p className="text-2xl font-black">{stats.count} Transfers</p>
              </div>
          </Card>
          <Card className="p-6 bg-rose-500 text-white space-y-4 shadow-xl shadow-rose-500/10">
              <div className="flex justify-between items-start">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <XCircle size={20} />
                  </div>
                  <Activity size={18} className="opacity-40" />
              </div>
              <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 text-white">Failures</p>
                  <p className="text-2xl font-black">{stats.failed} Declined</p>
              </div>
          </Card>
          <Card className="p-6 bg-gray-900 text-white space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <DollarSign size={20} className="text-orange-500" />
                  </div>
                  <FileText size={18} className="opacity-40" />
              </div>
              <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg. Ticket</p>
                  <p className="text-2xl font-black">₹{(stats.total / (stats.count || 1)).toFixed(2)}</p>
              </div>
          </Card>
      </div>

      <Card className="overflow-hidden border-black/5 dark:border-white/5 shadow-2xl">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full max-w-md">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search Transaction ID or Phone..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 dark:bg-gray-900"
                />
            </div>
            <div className="flex gap-2 p-1.5 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                {['ALL', 'SUCCESS', 'FAILED', 'PENDING'].map(s => (
                    <button 
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            filterStatus === s ? 'bg-white dark:bg-zinc-700 text-orange-500 shadow-sm' : 'text-gray-400'
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction ID</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Time & Method</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Payer Details</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/50 group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                            <FileText size={16} />
                        </div>
                        <span className="font-black text-sm font-mono tracking-tighter text-gray-900 dark:text-white uppercase">
                            {p.transactionId || `PAY-${p.id}`}
                        </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-900 dark:text-white">
                           {new Date(p.createdTs).toLocaleDateString()} • {new Date(p.createdTs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[9px] font-black uppercase text-orange-500 tracking-widest mt-1">
                           {p.method || 'Online Payment'}
                        </span>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-lg text-emerald-600">₹{p.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-900 dark:text-white capitalize">{p.user?.firstName} {p.user?.lastName}</span>
                        <span className="text-[10px] font-bold text-gray-400">{p.user?.mobileNumber}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className={`flex w-fit items-center gap-2 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest shadow-sm ${
                        p.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-600' : 
                        p.status === 'FAILED' ? 'bg-rose-500/10 text-rose-600' : 'bg-orange-500/10 text-orange-600'
                     }`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${p.status === 'SUCCESS' ? 'bg-emerald-500' : p.status === 'FAILED' ? 'bg-rose-500' : 'bg-orange-500'}`} />
                        {p.status}
                     </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                    <td colSpan="5" className="py-20 text-center space-y-3">
                        <Search className="mx-auto text-gray-200" size={48} />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No transactions match your search</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="mt-8 p-6 bg-blue-500/10 rounded-[32px] flex items-center gap-4 border border-blue-500/10">
         <div className="h-12 w-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Calendar size={24} />
         </div>
         <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">Reconciliation Note</p>
            <p className="text-sm font-bold text-gray-600 dark:text-gray-400">All payments are reconciled every 24 hours. Refunds and manual adjustments should be initiated via the Payment Gateway provider dashboard.</p>
         </div>
      </div>
    </AdminLayout>
  );
}
