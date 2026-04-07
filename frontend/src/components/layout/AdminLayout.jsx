import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, ListTree, 
  ShoppingBag, Users, LogOut, Menu, X, Bell, User, Settings, CreditCard
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/admin' },
  { id: 'categories', label: 'Categories', icon: ListTree, path: '/admin/categories' },
  { id: 'items', label: 'Inventory', icon: Package, path: '/admin/items' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
  { id: 'users', label: 'Customers', icon: Users, path: '/admin/users' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  { id: 'payments', label: 'Payments', icon: CreditCard, path: '/admin/payments' },
];

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-500">
      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(true)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-gray-800 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center justify-between px-8 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg">M</div>
             <span className="text-xl font-black tracking-tight">MANEMADE</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center gap-4 rounded-2xl px-6 py-4 text-sm font-black transition-all duration-300
                ${isActive ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
           <button 
             onClick={handleLogout}
             className="flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-sm font-black text-rose-500 hover:bg-rose-500/5 transition-all duration-300"
           >
             <LogOut size={20} />
             Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex h-20 items-center justify-between px-8 bg-white border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-6 ml-auto">
             <button className="relative text-gray-500 hover:text-orange-500 transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
             </button>
             <div className="h-10 w-[1px] bg-gray-100 dark:bg-gray-700" />
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                   <User size={20} />
                </div>
             </div>
          </div>
        </header>

        <main className="p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
