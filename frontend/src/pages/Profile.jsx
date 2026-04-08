import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, Shield, CreditCard, Bell, LogOut, ChevronRight, 
  Map as MapIcon, Camera, Home, Briefcase, Info, Navigation,
  Star, MapPin, Plus, Trash2, Clock3, PackageCheck, Save,
  Settings, Heart, LayoutDashboard, Lock, Globe, Moon, Sun,
  Smartphone, Mail, CheckCircle2, AlertCircle, TrendingUp
} from 'lucide-react';
import { getCurrentPosition, reverseGeocodeBatch } from '../utils/geoUtils';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api, { addressService, authService } from '../services/userService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';

const emptyAddress = { 
  line1: '', 
  line2: '', 
  city: '', 
  state: '', 
  pincode: '', 
  recipientName: '', 
  recipientPhone: '', 
  addressType: 'Home', 
  isDefault: false 
};

// Local avatar upload handles the profile picture instead of a picker.

// --- Sub-components for a cleaner Profile page ---

const StatCard = ({ icon: Icon, label, value, trend, colorClass }) => (
  <Card className="p-6 border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-sm group hover:border-[var(--accent-strong)]/30 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
          <TrendingUp size={10} />
          {trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  </Card>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div className="space-y-1">
      <h2 className="text-3xl font-black tracking-tight">{title}</h2>
      {subtitle && <p className="text-[var(--text-muted)] font-medium text-sm">{subtitle}</p>}
    </div>
    {action}
  </div>
);

function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', email: '', mobileNumber: '' });
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  // Derived stats for the "Overview" tab
  const stats = useMemo(() => ({
    totalOrders: orders.length,
    defaultAddress: addresses.find(a => a.default) || addresses[0],
    loyaltyPoints: 2450, // Mock for now
    rank: 'Spice Master' // Mock for now
  }), [orders, addresses]);

  useEffect(() => {
    if (!user?.id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const [profileResponse, addressResponse, orderResponse] = await Promise.all([
          authService.getUserProfile(user.id),
          addressService.getAddresses(user.id),
          api.get(`/order/user/${user.id}`),
        ]);
        setProfileForm(profileResponse.data);
        setAddresses(addressResponse.data || []);
        setOrders(orderResponse.data || []);
      } catch (error) {
        showToast({ title: 'Error', description: 'Failed to load profile data.' });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [showToast, user?.id]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const response = await authService.updateUserProfile(user.id, profileForm);
      updateUser(response.data);
      showToast({ title: 'Success', description: 'Profile updated.', tone: 'success' });
    } catch (error) {
      showToast({ title: 'Error', description: 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      let response;
      if (editingId) {
        response = await addressService.updateAddress(user.id, editingId, addressForm);
        setAddresses(prev => prev.map(a => a.id === editingId ? response.data : response.data.default ? { ...a, default: false } : a));
      } else {
        response = await addressService.addAddress(user.id, addressForm);
        setAddresses(prev => [...prev.filter(a => !response.data.default || !a.default), response.data]);
      }
      setAddressForm(emptyAddress);
      setEditingId(null);
      setActiveTab('addresses');
      showToast({ title: 'Success', description: editingId ? 'Address updated.' : 'Address added.', tone: 'success' });
    } catch (error) {
      showToast({ title: 'Error', description: `Failed to ${editingId ? 'update' : 'add'} address.` });
    } finally {
      setSavingAddress(false);
    }
  };

  const handleEditAddress = (addr) => {
    setAddressForm({
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      recipientName: addr.recipientName || user.firstName + ' ' + user.lastName,
      recipientPhone: addr.recipientPhone || user.mobileNumber,
      addressType: addr.addressType || 'Home',
      isDefault: addr.default || false
    });
    setEditingId(addr.id);
    setActiveTab('addresses-new');
  };

  const handleUseLocation = async () => {
    setGeolocating(true);
    try {
      const coords = await getCurrentPosition();
      const address = await reverseGeocodeBatch(coords.latitude, coords.longitude);
      if (address) {
        setAddressForm(prev => ({
          ...prev,
          line1: address.line1,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        }));
        showToast({ title: 'Location detected', description: 'Address fields have been auto-filled.', tone: 'success' });
      } else {
        showToast({ title: 'Error', description: 'Could not resolve address.' });
      }
    } catch (error) {
      showToast({ title: 'Geolocation failure', description: 'Please check your permissions and try again.' });
    } finally {
      setGeolocating(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast({ title: 'File too large', description: 'Maximum size is 5MB.', tone: 'error' });
      return;
    }

    setUploadingAvatar(true);
    try {
      const response = await authService.uploadAvatar(user.id, file);
      updateUser(response.data);
      showToast({ title: 'Success', description: 'Profile photo updated.', tone: 'success' });
    } catch (error) {
      showToast({ title: 'Error', description: 'Failed to upload photo.', tone: 'error' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressService.setDefaultAddress(user.id, id);
      setAddresses(prev => prev.map(a => ({ ...a, default: a.id === id })));
      showToast({ title: 'Success', description: 'Default address updated.', tone: 'success' });
    } catch (error) {
      showToast({ title: 'Error', description: 'Failed to set default address.' });
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await addressService.deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
      showToast({ title: 'Removed', description: 'Address deleted.', tone: 'success' });
    } catch (error) {
      showToast({ title: 'Error', description: 'Failed to delete address.' });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-24 pb-32">
        <Skeleton height="h-[600px]" className="rounded-[var(--radius-xl)]" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Personal Info', icon: UserIcon },
    { id: 'orders', label: 'Order History', icon: PackageCheck },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-24 pb-32 bg-[var(--background)] min-h-screen">
      {/* Hero Header Section */}
      <div className="relative mb-12 overflow-hidden rounded-[var(--radius-xl)] bg-black p-8 text-white shadow-2xl lg:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00] via-[#FF8C37] to-black opacity-30"></div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF6B00] blur-[120px] opacity-40"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="relative group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-40 w-40 rounded-full border-4 border-white/20 p-1.5 backdrop-blur-md shadow-2xl transition-all relative overflow-hidden ring-8 ring-white/5"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="h-full w-full rounded-full object-cover shadow-inner" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#FFB37C] text-4xl font-black shadow-inner">
                     {profileForm.firstName?.[0]}{profileForm.lastName?.[0]}
                  </div>
                )}
                
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                   <Camera size={24} className="text-white" />
                   <span className="text-[10px] font-black uppercase text-white">Change Photo</span>
                </div>
              </motion.div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>

            <div className="text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <h1 className="text-4xl font-black tracking-tight">{profileForm.firstName} {profileForm.lastName}</h1>
                <Badge variant="primary" className="bg-white/20 text-white backdrop-blur-md border-white/10 px-3 py-1 text-[10px] uppercase font-black tracking-widest leading-none">
                  PRO MEMBER
                </Badge>
              </div>
              <p className="flex items-center justify-center gap-2 text-sm font-medium text-white/70 md:justify-start">
                <Mail size={14} /> {profileForm.email}
              </p>
              <p className="flex items-center justify-center gap-2 text-sm font-medium text-white/70 md:justify-start">
                <Smartphone size={14} /> {profileForm.mobileNumber}
              </p>
            </div>
          </div>

          <div className="flex gap-4 sm:gap-8">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Total Orders</p>
              <p className="text-2xl font-black">{stats.totalOrders}</p>
            </div>
            <div className="h-10 w-px bg-white/10 self-center"></div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Reward Points</p>
              <p className="text-2xl font-black">{stats.loyaltyPoints}</p>
            </div>
            <div className="h-10 w-px bg-white/10 self-center"></div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Member Since</p>
              <p className="text-2xl font-black">2024</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block">
          <nav className="glass-card rounded-[var(--radius-xl)] p-4 space-y-1 sticky top-32">
            <p className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-50">Manage Account</p>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'sidebar-item-active' : 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5">
              <button 
                onClick={logout}
                className="flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-sm font-black text-rose-500 hover:bg-rose-500/5 transition-all duration-300"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </nav>
        </aside>

        {/* Tab Content Area */}
        <main className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <SectionHeader 
                  title="Account Overview" 
                  subtitle="A summary of your recent activity and saved preferences."
                  action={
                    <Button 
                      variant="primary" 
                      onClick={() => navigate('/shop')}
                      className="font-black h-14 px-10 shadow-xl premium-gradient border-0 text-white"
                    >
                      Order Now
                    </Button>
                  }
                />

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <StatCard icon={PackageCheck} label="Past Orders" value={stats.totalOrders} trend="+12%" colorClass="bg-blue-500" />
                  <StatCard icon={Star} label="Loyalty Points" value={stats.loyaltyPoints} colorClass="bg-amber-500" />
                  <StatCard icon={MapPin} label="Saved Address" value={addresses.length} colorClass="bg-purple-500" />
                </div>

                <div className="grid gap-8 lg:grid-cols-2 mt-12">
                  {/* Recent Order Preview */}
                  <Card className="p-8 border-black/5 dark:border-white/5 shadow-xl glass-card overflow-hidden relative">
                    <div className="absolute -right-8 -bottom-8 opacity-5 text-black dark:text-white rotate-12">
                      <Clock3 size={160} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-strong)] mb-4">Latest Order</p>
                      {orders.length > 0 ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-black">Order #{orders[0].id}</h3>
                              <p className="text-xs font-bold text-[var(--text-muted)]">{new Date(orders[0].createdTs).toLocaleDateString()} • {orders[0].items?.length} Items</p>
                            </div>
                            <Badge variant={orders[0].status === 'DELIVERED' ? 'success' : 'primary'}>{orders[0].status}</Badge>
                          </div>
                          <div className="flex -space-x-4 overflow-hidden py-2">
                             {orders[0].items?.slice(0, 3).map((item, i) => (
                               <img key={i} src={item.image} alt={item.itemName} className="inline-block h-12 w-12 rounded-full border-4 border-white dark:border-zinc-900 object-cover" />
                             ))}
                             {orders[0].items?.length > 3 && (
                               <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white dark:border-zinc-900 bg-gray-100 text-[10px] font-black">
                                 +{orders[0].items.length - 3}
                               </div>
                             )}
                          </div>
                          <Button variant="secondary" size="sm" onClick={() => setActiveTab('orders')} className="w-full mt-2 font-black border-2 border-black/5">View All Orders</Button>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                           <p className="text-sm font-bold text-[var(--text-muted)]">No orders yet.</p>
                           <Button 
                             variant="primary" 
                             size="sm" 
                             className="mt-4 px-8 font-black shadow-lg"
                             onClick={() => navigate('/shop')}
                           >
                             Order Now
                           </Button>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Primary Address */}
                  <Card className="p-8 border-black/5 dark:border-white/5 shadow-xl glass-card overflow-hidden relative">
                    <div className="absolute -right-8 -bottom-8 opacity-5 text-black dark:text-white -rotate-12">
                      <MapIcon size={160} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-strong)] mb-4">Primary Address</p>
                      {stats.defaultAddress ? (
                         <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               <div className="p-2 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                                  {stats.defaultAddress.addressType === 'Home' ? <Home size={20} /> : <Briefcase size={20} />}
                               </div>
                               <div>
                                  <h3 className="font-black">{stats.defaultAddress.addressType || 'Home'}</h3>
                                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{stats.defaultAddress.recipientName}</p>
                               </div>
                            </div>
                            <p className="text-sm font-bold text-[var(--text-muted)] leading-relaxed italic">
                               "{stats.defaultAddress.line1}, {stats.defaultAddress.city}"
                            </p>
                            <Button variant="secondary" size="sm" onClick={() => setActiveTab('addresses')} className="w-full mt-2 font-black border-2 border-black/5">Manage Addresses</Button>
                         </div>
                      ) : (
                        <div className="text-center py-6">
                           <p className="text-sm font-bold text-[var(--text-muted)]">Set a default delivery point.</p>
                           <Button variant="primary" size="sm" onClick={() => setActiveTab('addresses-new')} className="mt-4 px-8 font-black shadow-lg">Add Address</Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <SectionHeader 
                  title="Profile Information" 
                  subtitle="Update your name, contact details and identity settings."
                />

                <form onSubmit={handleProfileSubmit} className="max-w-3xl glass-card p-10 rounded-[var(--radius-xl)] space-y-8 border-black/5">
                   <div className="grid gap-8 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Input 
                          label="First Name" 
                          value={profileForm.firstName} 
                          onChange={e => setProfileForm({...profileForm, firstName: e.target.value})}
                          icon={UserIcon}
                          className="h-14"
                        />
                      </div>
                      <div className="space-y-2">
                        <Input 
                          label="Last Name" 
                          value={profileForm.lastName} 
                          onChange={e => setProfileForm({...profileForm, lastName: e.target.value})}
                          className="h-14"
                        />
                      </div>
                   </div>
                   
                   <div className="grid gap-8 sm:grid-cols-2">
                    <Input 
                      label="Email Address" 
                      type="email"
                      value={profileForm.email} 
                      onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                      icon={Mail}
                      className="h-14"
                    />
                    <Input 
                      label="Mobile Number" 
                      value={profileForm.mobileNumber} 
                      onChange={e => setProfileForm({...profileForm, mobileNumber: e.target.value})}
                      icon={Smartphone}
                      className="h-14"
                    />
                   </div>

                   <hr className="border-black/5 dark:border-white/5" />

                   <div className="flex items-center justify-between p-6 bg-[var(--surface-muted)] rounded-[var(--radius-lg)]">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <p className="font-black">Identity Verified</p>
                          <p className="text-xs font-bold text-[var(--text-muted)]">Your account is fully secured and verified.</p>
                        </div>
                      </div>
                      <Badge variant="success" className="px-4 py-2 font-black">VERIFIED</Badge>
                   </div>

                   <div className="flex justify-end pt-4">
                     <Button size="lg" className="px-12 py-7 text-lg shadow-xl premium-gradient text-white border-0" disabled={savingProfile}>
                       {savingProfile ? 'Saving...' : 'Update Details'}
                     </Button>
                   </div>
                </form>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <SectionHeader 
                  title="Order History" 
                  subtitle="Browse and track all your previous North Karnataka meals."
                />

                <div className="space-y-8">
                   {orders.length === 0 ? (
                     <div className="py-24 text-center rounded-[var(--radius-xl)] border-2 border-dashed border-black/8 dark:border-white/8 glass-card">
                       <PackageCheck size={64} className="mx-auto mb-6 text-[var(--text-muted)] opacity-20" />
                       <h3 className="text-2xl font-black mb-2 text-[var(--text-primary)]">Hungry? Feed yourself!</h3>
                       <p className="text-[var(--text-muted)] font-bold max-w-sm mx-auto">You haven't placed any orders yet. Start exploring the authentic taste of Karnataka.</p>
                       <Button variant="primary" className="mt-8 px-10 h-14 font-black premium-shadow" onClick={() => window.location.href='/shop'}>Go to Shop</Button>
                     </div>
                   ) : (
                     <div className="grid gap-6">
                       {orders.map(order => (
                         <motion.div
                           initial={{ opacity: 0, scale: 0.98 }}
                           whileInView={{ opacity: 1, scale: 1 }}
                           viewport={{ once: true }}
                           key={order.id}
                         >
                           <Card className="p-8 border-black/5 shadow-xl glass-card hover:shadow-2xl transition-all group">
                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/5 dark:border-white/5">
                               <div className="flex items-center gap-5">
                                 <div className="h-16 w-16 rounded-3xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent-strong)]">
                                   <PackageCheck size={32} />
                                 </div>
                                 <div className="space-y-1">
                                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-strong)]">Transaction ID #{order.id}</p>
                                   <div className="flex items-center gap-3">
                                      <p className="text-xl font-black">₹{order.totalAmount}</p>
                                      <Badge variant={order.status === 'DELIVERED' ? 'success' : 'primary'} className="font-black px-4 py-1 rounded-full text-[10px]">
                                        {order.status}
                                      </Badge>
                                   </div>
                                 </div>
                               </div>
                               <div className="flex items-center gap-4 text-[var(--text-muted)] font-black text-sm">
                                  <Clock3 size={16} />
                                  {new Date(order.createdTs).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                               </div>
                             </div>
                             
                             <div className="py-6 space-y-5">
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between group/item">
                                    <div className="flex items-center gap-6">
                                      <div className="h-14 w-14 rounded-2xl bg-[var(--surface-muted)] overflow-hidden border border-black/5 shadow-inner">
                                        <img src={item.image} alt={item.itemName} className="h-full w-full object-cover transition-transform group-hover/item:scale-110" />
                                      </div>
                                      <div>
                                        <p className="text-base font-black truncate max-w-[200px]">{item.itemName}</p>
                                        <p className="text-xs font-bold text-[var(--text-muted)]">Qty: {item.quantity} × <span className="text-[var(--text-primary)]">₹{item.unitPrice}</span></p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                       <p className="font-black">₹{item.quantity * item.unitPrice}</p>
                                    </div>
                                  </div>
                                ))}
                             </div>

                             <div className="pt-6 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between gap-4">
                                <p className="text-[10px] font-bold text-[var(--text-muted)] italic">"Traditional recipes, delivered with care."</p>
                                <div className="flex gap-4">
                                   <Button variant="secondary" size="sm" className="px-6 font-black border-2 border-black/5 hover:bg-black/5 transition-colors">Order Details</Button>
                                   <Button size="sm" className="px-6 font-black premium-shadow bg-black text-white dark:bg-white dark:text-black">Reorder Items</Button>
                                </div>
                             </div>
                           </Card>
                         </motion.div>
                       ))}
                     </div>
                   )}
                </div>
              </motion.div>
            )}

            {/* Addresses Tab */}
            {(activeTab === 'addresses' || activeTab === 'addresses-new') && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                {activeTab === 'addresses' ? (
                  <>
                    <SectionHeader 
                      title="Address Book" 
                      subtitle="Keep your delivery locations organized for swift checkouts."
                      action={
                        <Button 
                          variant="primary" 
                          onClick={() => { setAddressForm(emptyAddress); setEditingId(null); setActiveTab('addresses-new'); }} 
                          icon={Plus} 
                          className="font-black h-14 px-8 shadow-xl premium-gradient border-0 text-white"
                        >
                          Add New Point
                        </Button>
                      }
                    />

                    <div className="grid gap-8 sm:grid-cols-2">
                       {addresses.length === 0 ? (
                         <div className="col-span-full py-24 text-center glass-card border-none rounded-[var(--radius-xl)] shadow-lg">
                           <MapPin size={64} className="mx-auto mb-6 text-[var(--text-muted)] opacity-20" />
                           <h3 className="text-2xl font-black mb-2">No addresses found</h3>
                           <p className="text-[var(--text-muted)] font-bold max-w-xs mx-auto">We need to know where to bring the delicious food!</p>
                         </div>
                       ) : addresses.map(addr => (
                         <motion.div layout key={addr.id}>
                           <Card className={`relative group p-8 space-y-6 shadow-xl glass-card transition-all hover:shadow-2xl border-2 ${addr.default ? 'border-[var(--accent-strong)]' : 'border-transparent'}`}>
                             {addr.default && (
                               <div className="absolute top-0 right-0 p-1">
                                  <Badge variant="primary" className="rounded-bl-xl rounded-tr-xl border-0 font-black px-4 py-2 bg-[var(--accent-strong)] text-white shadow-lg">DEFAULT</Badge>
                               </div>
                             )}
                             <div className="flex items-start justify-between">
                                <div className={`flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] shadow-lg ${addr.addressType === 'Home' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                  {addr.addressType === 'Home' ? <Home size={32} /> : <Briefcase size={32} />}
                                </div>
                             </div>
                             
                             <div className="space-y-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{addr.addressType || 'Other'} ADDRESS</span>
                                  </div>
                                  <h3 className="text-xl font-black">{addr.recipientName || 'Resident'}</h3>
                                  <p className="text-sm font-bold text-[var(--accent-strong)]">{addr.recipientPhone || 'No Contact'}</p>
                                </div>
                                
                                <p className="text-base font-bold text-[var(--text-muted)] leading-relaxed italic opacity-80 min-h-[3rem]">
                                  "{addr.line1}, {addr.line2 && `${addr.line2}, `}{addr.city} - {addr.pincode}"
                                </p>
                                
                                <div className="pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-4">
                                   <div className="flex gap-4">
                                      <button 
                                        onClick={() => handleEditAddress(addr)}
                                        className="text-xs font-black uppercase tracking-widest hover:text-[var(--accent-strong)] transition-colors"
                                      >
                                        Edit
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteAddress(addr.id)}
                                        className="text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-colors"
                                      >
                                        Delete
                                      </button>
                                   </div>
                                   {!addr.default && (
                                     <button 
                                       onClick={() => handleSetDefault(addr.id)}
                                       className="text-[10px] font-black uppercase tracking-tighter text-[var(--text-muted)] underline underline-offset-4 hover:text-black dark:hover:text-white transition-all"
                                     >
                                       Mark as Default
                                     </button>
                                   )}
                                </div>
                             </div>
                           </Card>
                         </motion.div>
                       ))}
                    </div>
                  </>
                ) : (
                  <div className="max-w-3xl">
                    <button 
                      onClick={() => setActiveTab('addresses')} 
                      className="group flex items-center gap-3 mb-8 text-[var(--text-muted)] hover:text-black dark:hover:text-white transition-all"
                    >
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--surface-muted)] group-hover:bg-black group-hover:text-white transition-all duration-300">
                        <Star className="-rotate-90" size={18} />
                      </div>
                      <span className="font-black text-sm uppercase tracking-widest">Back to List</span>
                    </button>

                    <div className="glass-card rounded-[var(--radius-xl)] p-10 shadow-2xl border-black/5">
                        <SectionHeader 
                          title={editingId ? 'Edit Delivery Point' : 'Add New Location'} 
                          subtitle="Precision matters for prompt deliveries."
                        />

                        <form onSubmit={handleAddressSubmit} className="space-y-10 mt-8">
                           <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center p-6 bg-[var(--accent-soft)] rounded-3xl border border-[var(--accent-strong)]/10">
                              <div>
                                <h4 className="font-black text-sm">Real-time Location</h4>
                                <p className="text-[10px] font-bold text-[var(--accent-strong)]">Detect your coordinates for accuracy</p>
                              </div>
                              <Button 
                                type="button" 
                                variant="primary" 
                                loading={geolocating}
                                onClick={handleUseLocation}
                                icon={Navigation}
                                className="h-14 px-8 font-black text-[11px] uppercase tracking-widest bg-[var(--accent-strong)] text-white shadow-lg border-0"
                              >
                                {geolocating ? 'Locating...' : 'Fetch My Location'}
                              </Button>
                           </div>

                           <div className="grid gap-8 sm:grid-cols-2">
                              <Input label="Recipient's Name" placeholder="Who's eating?" value={addressForm.recipientName} onChange={e => setAddressForm({...addressForm, recipientName: e.target.value})} required className="h-14" />
                              <Input label="Phone Number" placeholder="10-digit mobile" value={addressForm.recipientPhone} onChange={e => setAddressForm({...addressForm, recipientPhone: e.target.value})} maxLength={10} required className="h-14" />
                           </div>

                           <Input label="House / Street Info" placeholder="Flat No, Wing, Building Name" value={addressForm.line1} onChange={e => setAddressForm({...addressForm, line1: e.target.value})} icon={MapPin} required className="h-14" />
                           <Input label="Landmark (Handy for Rider)" placeholder="Near Market, ATM, etc." value={addressForm.line2} onChange={e => setAddressForm({...addressForm, line2: e.target.value})} className="h-14" />

                           <div className="grid gap-8 sm:grid-cols-3">
                              <Input label="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} required className="h-14" />
                              <Input label="State" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} required className="h-14" />
                              <Input label="Pincode" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} maxLength={6} required className="h-14" />
                           </div>

                           <div className="space-y-4">
                              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">Location Identity</p>
                              <div className="flex flex-wrap gap-4">
                                {['Home', 'Work', 'Other'].map(type => (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() => setAddressForm({...addressForm, addressType: type})}
                                    className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-[var(--radius-lg)] border-2 transition-all font-black text-sm ${addressForm.addressType === type ? 'border-black bg-black text-white shadow-xl scale-105' : 'border-black/5 hover:bg-black/5 text-[var(--text-muted)]'}`}
                                  >
                                    {type === 'Home' ? <Home size={18} /> : type === 'Work' ? <Briefcase size={18} /> : <Navigation size={18} />}
                                    {type}
                                  </button>
                                ))}
                              </div>
                           </div>

                           <div className="flex items-center gap-4 py-4 px-6 bg-[var(--surface-muted)] rounded-3xl">
                              <input 
                                type="checkbox" 
                                id="isDefault" 
                                className="h-6 w-6 rounded-lg border-black/10 accent-[var(--accent-strong)]"
                                checked={addressForm.isDefault}
                                onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})}
                              />
                              <label htmlFor="isDefault" className="text-sm font-black cursor-pointer">Set as Primary Address</label>
                           </div>

                           <div className="flex gap-6 pt-10">
                             <Button variant="secondary" onClick={() => setActiveTab('addresses')} className="flex-1 h-16 text-lg font-bold border-2 border-black/5">Dismiss</Button>
                             <Button className="flex-[2] h-16 text-lg font-black premium-gradient text-white border-0 shadow-2xl" disabled={savingAddress}>
                               {savingAddress ? 'Processing...' : editingId ? 'Commit Changes' : 'Confirm Save'}
                             </Button>
                           </div>
                        </form>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Other Tab Placeholders for Profession Look */}
            {['favorites', 'security', 'preferences'].includes(activeTab) && (
              <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="space-y-10"
              >
                 <SectionHeader 
                   title={tabs.find(t => t.id === activeTab).label} 
                   subtitle="Feature coming soon to enhance your experience."
                 />
                 <div className="py-32 text-center glass-card border-none rounded-[var(--radius-xl)] shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-soft)] to-transparent opacity-30"></div>
                    <div className="relative z-10 flex flex-col items-center">
                       <div className="h-24 w-24 rounded-full bg-white dark:bg-zinc-800 shadow-2xl flex items-center justify-center mb-8 animate-bounce">
                          {activeTab === 'favorites' && <Heart size={40} className="text-rose-500" fill="currentColor" />}
                          {activeTab === 'security' && <Shield size={40} className="text-blue-500" fill="currentColor" />}
                          {activeTab === 'preferences' && <Settings size={40} className="text-amber-500" fill="currentColor" />}
                       </div>
                       <h3 className="text-3xl font-black mb-4">Under Development</h3>
                       <p className="text-[var(--text-muted)] font-bold max-w-md mx-auto leading-relaxed px-6">
                         We are currently cooking up this section to give you the best experience. Check back soon for more updates!
                       </p>
                       <Button variant="secondary" className="mt-12 px-12 h-14 font-black border-2 border-black/10" onClick={() => setActiveTab('overview')}>Back to Dashboard</Button>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default Profile;
