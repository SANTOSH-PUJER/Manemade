import { motion } from 'framer-motion';
import { 
  Settings, Store, Truck, Percent, 
  Bell, Shield, Save, RefreshCcw, 
  CreditCard, MapPin, Image as ImageIcon, 
  Trash2, Plus, Info
} from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/userService';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    SHOP_STATUS: 'OPEN',
    DELIVERY_FEE: '40',
    TAX_PERCENT: '5',
    FREE_DELIVERY_THRESHOLD: '500',
    OFFER_BANNER_TEXT: 'Special discounts on home-made pickles!',
    OFFER_BANNER_URL: '',
    SHOP_NOTICE: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const resp = await api.get('/admin/stats'); // We can get initial state from stats
        setSettings(prev => ({
            ...prev,
            SHOP_STATUS: resp.data.shopStatus || 'OPEN'
        }));
        // In a real scenario, we'd have a dedicated GET /admin/settings endpoint
        // Let's simulate for now or assume we'll add it
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async (key, value) => {
    setSaving(true);
    try {
      await api.post('/admin/settings', { key, value });
      setSettings(prev => ({ ...prev, [key]: value }));
      showToast({ title: 'Success', description: `${key} updated successfully.`, tone: 'success' });
    } catch (err) {
      showToast({ title: 'Error', description: `Failed to update ${key}.` });
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      id: 'platform',
      title: 'Platform Control',
      icon: Store,
      color: 'text-orange-500',
      description: 'Manage shop availability and core operations.',
      fields: [
        { key: 'SHOP_STATUS', label: 'Store Status', type: 'toggle', options: ['OPEN', 'CLOSED'] },
        { key: 'SHOP_NOTICE', label: 'Dashboard Notice', type: 'textarea', placeholder: 'Important message for users...' }
      ]
    },
    {
      id: 'logistics',
      title: 'Financials & Logistics',
      icon: Truck,
      color: 'text-blue-500',
      description: 'Configure delivery fees and tax rates.',
      fields: [
        { key: 'DELIVERY_FEE', label: 'Base Delivery Fee (₹)', type: 'number' },
        { key: 'TAX_PERCENT', label: 'Platform Tax (%)', type: 'number' },
        { key: 'FREE_DELIVERY_THRESHOLD', label: 'Free Delivery Min. Order (₹)', type: 'number' }
      ]
    },
    {
      id: 'promotions',
      title: 'Promotional Hub',
      icon: Percent,
      color: 'text-emerald-500',
      description: 'Manage banners and seasonal offers.',
      fields: [
        { key: 'OFFER_BANNER_TEXT', label: 'Promo Banner Text', type: 'text' },
        { key: 'OFFER_BANNER_URL', label: 'Promo Image Link', type: 'text' }
      ]
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-12">
        <div className="space-y-1">
          <Badge variant="primary" className="bg-orange-500 text-white border-0">Global Control</Badge>
          <h1 className="font-display text-4xl font-black tracking-tight leading-tight">Admin Settings</h1>
        </div>
        <div className="flex items-center gap-4">
            {saving && (
                <div className="flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-widest animate-pulse">
                    <RefreshCcw size={14} className="animate-spin" /> Synchronizing...
                </div>
            )}
            <Button variant="secondary" icon={Shield}>Export System Log</Button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
         {sections.map((section, idx) => (
            <motion.div
               key={section.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
            >
               <Card className="p-8 space-y-8 shadow-xl border-black/5 dark:border-white/5 h-full">
                  <div className="flex items-start gap-4">
                     <div className={`h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-900 ${section.color} flex items-center justify-center shadow-inner`}>
                        <section.icon size={24} />
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-xl font-black tracking-tight">{section.title}</h3>
                        <p className="text-sm font-bold text-gray-400">{section.description}</p>
                     </div>
                  </div>

                  <div className="space-y-6 pt-4">
                     {section.fields.map(field => (
                        <div key={field.key} className="space-y-3">
                           <div className="flex justify-between items-center">
                              <label className="text-xs font-black uppercase tracking-widest text-gray-500">{field.label}</label>
                              {field.type === 'toggle' && (
                                 <Badge className={`${settings[field.key] === 'OPEN' ? 'bg-emerald-500' : 'bg-rose-500'} text-white border-0 py-0.5 px-3`}>
                                    {settings[field.key]}
                                 </Badge>
                              )}
                           </div>

                           {field.type === 'toggle' ? (
                              <div className="flex p-1.5 bg-gray-100 dark:bg-gray-900 rounded-2xl gap-1">
                                 {field.options.map(opt => (
                                    <button
                                       key={opt}
                                       onClick={() => handleUpdate(field.key, opt)}
                                       className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                          settings[field.key] === opt ? 'bg-white dark:bg-zinc-800 text-orange-500 shadow-md scale-[1.02]' : 'text-gray-400 opacity-60'
                                       }`}
                                    >
                                       {opt}
                                    </button>
                                 ))}
                              </div>
                           ) : field.type === 'textarea' ? (
                              <textarea
                                 className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 dark:bg-gray-900 resize-none h-24"
                                 placeholder={field.placeholder}
                                 value={settings[field.key]}
                                 onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                 onBlur={() => handleUpdate(field.key, settings[field.key])}
                              />
                           ) : (
                              <div className="relative group">
                                 <input
                                    type={field.type}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-2 focus:ring-orange-500/20 dark:bg-gray-900"
                                    value={settings[field.key]}
                                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                    onBlur={() => handleUpdate(field.key, settings[field.key])}
                                 />
                                 <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Save size={16} className="text-gray-300" />
                                 </div>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </Card>
            </motion.div>
         ))}

         {/* Additional Settings / Security */}
         <div className="space-y-8">
            <Card className="p-8 bg-gray-900 text-white relative overflow-hidden group shadow-2xl">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Shield size={24} className="text-orange-500" />
                     </div>
                     <Badge className="bg-orange-500 text-white border-0">High Security</Badge>
                  </div>
                  <div>
                     <h3 className="text-2xl font-black tracking-tight">Access Logs</h3>
                     <p className="text-sm font-bold opacity-60 mt-1">Audit all administrative actions performed on this platform.</p>
                  </div>
                  <button className="w-full py-4 rounded-2xl bg-white text-gray-900 text-xs font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl">
                     View Complete Audit Trail
                  </button>
               </div>
               <div className="absolute -right-12 -bottom-12 h-64 w-64 bg-orange-500 opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity" />
            </Card>

            <Card className="p-8 border-dashed border-2 border-black/5 dark:border-white/5 space-y-4">
               <div className="flex items-center gap-3">
                  <Info className="text-blue-500" size={18} />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500">Platform Integrity</span>
               </div>
               <p className="text-sm font-bold text-gray-400 leading-relaxed">
                  Settings changed here are updated globally across all user sessions using real-time synchronization. Be careful when updating financial constants like Tax % or Delivery Fees.
               </p>
            </Card>
         </div>
      </div>
    </AdminLayout>
  );
}
