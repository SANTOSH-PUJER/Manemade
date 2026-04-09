import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, User, Trash2, Eye, Mail, 
  Phone, Calendar, ShieldCheck, 
  ShieldAlert, UserPlus, UserMinus, 
  ShoppingBag, Star, MoreHorizontal, XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminService } from '../services/dataService';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const resp = await adminService.getAllUsers();
      setUsers(resp.data);
    } catch (err) {
      showToast({ title: 'Error', description: 'Failed to load users.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await adminService.deleteUser(id);
      showToast({ title: 'Deactivated', description: 'User account removed.', tone: 'success' });
      loadUsers();
    } catch (err) {
      showToast({ title: 'Error', description: 'Failed to deactivate user.' });
    }
  };

  const updateRole = async (id, role) => {
    try {
      await adminService.updateUserRole(id, role);
      showToast({ title: 'Role Updated', description: `User promoted to ${role}.`, tone: 'success' });
      loadUsers();
    } catch (err) {
      showToast({ title: 'Error', description: 'Failed to update user role.' });
    }
  };

  const filtered = users.filter(u => 
    u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.mobileNumber.includes(searchQuery)
  );

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-12">
        <div className="space-y-1">
          <Badge variant="primary" className="bg-purple-500 text-white border-0">Customer Success</Badge>
          <h1 className="font-display text-4xl font-black tracking-tight leading-tight">Access Control</h1>
        </div>
        <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block pr-6 border-r border-black/5 dark:border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Active</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{users.filter(u => !u.isDeleted).length}</p>
            </div>
            <Button variant="secondary" icon={UserPlus}>Onboard Admin</Button>
        </div>
      </div>

      <Card className="overflow-hidden border-black/5 dark:border-white/5 shadow-2xl">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by Name, Email, or Mobile..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 dark:bg-gray-900"
                />
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 whitespace-nowrap">
                {filtered.length} Customer Record(s) Found
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Communication</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Permissions</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Account Health</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/50 group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-purple-500/10 group-hover:text-purple-600 transition-colors">
                          <User size={24} />
                       </div>
                       <div>
                         <p className="font-black text-lg text-gray-900 dark:text-white capitalize leading-tight">{u.firstName} {u.lastName}</p>
                         <p className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">
                            <Calendar size={10} /> Joined Oct 2026
                         </p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="space-y-1.5">
                        <a href={`mailto:${u.email}`} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-600 transition-colors">
                           <Mail size={14} /> {u.email}
                        </a>
                        <a href={`tel:${u.mobileNumber}`} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors">
                           <Phone size={14} /> {u.mobileNumber}
                        </a>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     {u.role === 'ADMIN' ? (
                        <div className="flex items-center gap-2">
                           <Badge variant="primary" className="bg-orange-500 text-white border-0 py-1 font-black shadow-glow flex items-center gap-1.5">
                              <ShieldCheck size={12} /> Root Admin
                           </Badge>
                           <button onClick={() => updateRole(u.id, 'USER')} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all" title="Demote to User">
                              <UserMinus size={16} />
                           </button>
                        </div>
                     ) : (
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                           <Badge variant="secondary" className="px-3 py-1 font-black bg-gray-100 dark:bg-gray-800 text-gray-600 border-0">
                               Customer
                           </Badge>
                           <button onClick={() => updateRole(u.id, 'ADMIN')} className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-xl transition-all" title="Promote to Admin">
                              <ShieldAlert size={16} />
                           </button>
                        </div>
                     )}
                  </td>
                  <td className="px-8 py-6">
                     {!u.isDeleted ? (
                       <Badge variant="success" className="px-4 py-1.5 font-black text-[10px] uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border-0 rounded-full">
                          Live Active
                       </Badge>
                     ) : (
                       <Badge variant="warning" className="px-4 py-1.5 font-black text-[10px] uppercase tracking-widest bg-rose-500/10 text-rose-600 border-0 rounded-full">
                          Deactivated
                       </Badge>
                     )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                         onClick={() => setSelectedUser(u)}
                         className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-purple-600 hover:bg-purple-500/10 rounded-xl transition-all"
                       >
                         <Eye size={18} />
                       </button>
                       {!u.isDeleted && (
                         <button 
                           onClick={() => handleDelete(u.id)} 
                           className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                         >
                           <Trash2 size={18} />
                         </button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Portfolio Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="w-full max-w-4xl bg-white rounded-[40px] shadow-huge dark:bg-gray-800 overflow-hidden"
            >
               <div className="flex flex-col md:flex-row h-full">
                  {/* Sidebar Info */}
                  <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-900 p-10 border-r border-black/5 dark:border-white/5 space-y-10">
                     <div className="text-center space-y-4">
                        <div className="h-24 w-24 rounded-[32px] bg-purple-600 text-white font-black text-4xl flex items-center justify-center mx-auto shadow-xl shadow-purple-600/20">
                           {selectedUser.firstName?.[0]}
                        </div>
                        <div>
                           <h3 className="text-2xl font-black">{selectedUser.firstName} {selectedUser.lastName}</h3>
                           <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest">{selectedUser.role} Account</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-2">
                           <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Lifetime Value</p>
                           <p className="text-3xl font-black text-emerald-600">₹1,450.00</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Orders Placed</p>
                           <div className="flex items-center gap-2">
                              <ShoppingBag className="text-blue-500" size={18} />
                              <span className="text-xl font-black leading-none">12 Orders</span>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Platform Rank</p>
                           <div className="flex items-center gap-2">
                              <Star className="text-amber-500" size={18} />
                              <span className="text-xl font-black leading-none">Power User</span>
                           </div>
                        </div>
                     </div>

                     <div className="pt-8">
                        <Button variant="secondary" className="w-full bg-rose-500/10 text-rose-600 border-0 hover:bg-rose-500 hover:text-white" onClick={() => handleDelete(selectedUser.id)}>Terminate Account</Button>
                     </div>
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 p-10 flex flex-col relative min-h-[500px]">
                     <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <XCircle size={24} />
                     </button>
                     
                     <div className="flex items-center justify-between mb-8">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Activity Journal</h4>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-0">Healthy Account</Badge>
                     </div>

                     <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                        <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                           <MoreHorizontal size={32} />
                        </div>
                        <div>
                           <p className="font-black text-gray-900 dark:text-white">Detailed Activity Feed</p>
                           <p className="text-sm font-bold text-gray-500">Coming in next platform update</p>
                        </div>
                     </div>
                     
                     <div className="mt-auto grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-1">
                           <p className="text-[9px] font-black uppercase text-blue-500">Last Authentication</p>
                           <p className="text-lg font-black leading-none uppercase">Oct 24, 18:32</p>
                        </div>
                        <div className="p-4 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-1">
                           <p className="text-[9px] font-black uppercase text-amber-500">Risk Profile</p>
                           <p className="text-lg font-black leading-none uppercase tracking-widest">Very Low</p>
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
