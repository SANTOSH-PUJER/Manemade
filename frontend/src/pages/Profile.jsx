import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  User as UserIcon, Shield, CreditCard, Bell, LogOut, ChevronRight, 
  Map as MapIcon, Camera, Home, Briefcase, Info, Navigation,
  Star, MapPin, Plus, Trash2, Clock3, PackageCheck, Save
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

const avatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Scooter'
];

function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', email: '', mobileNumber: '' });
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

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

  const handleUpdateAvatar = async (url) => {
    setSavingProfile(true);
    try {
      const resp = await authService.updateUserProfile(user.id, { ...profileForm, avatarUrl: url });
      updateUser(resp.data);
      setShowAvatarPicker(false);
      showToast({ title: 'Avatar updated', tone: 'success' });
    } catch (err) {
      showToast({ title: 'Error updating avatar' });
    } finally {
      setSavingProfile(false);
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
        <Skeleton height="h-[400px]" className="rounded-[var(--radius-xl)]" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: UserIcon },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-24 pb-32">
      <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
        {/* Sidebar Nav */}
        <aside className="space-y-8">
           <div className="flex flex-col items-center rounded-[var(--radius-xl)] border border-black/8 bg-[var(--surface)] px-6 py-8 text-center shadow-[var(--shadow-soft)] dark:border-white/8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
                >
                  <Camera size={16} />
                </button>
              </div>

              {showAvatarPicker ? (
                <div className="grid grid-cols-5 gap-2 w-full p-2 bg-[var(--surface-muted)] rounded-[var(--radius-lg)] mb-4 animate-in slide-in-from-top-4">
                  {avatars.map((url, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleUpdateAvatar(url)}
                      className="rounded-full overflow-hidden border-2 border-transparent hover:border-[var(--accent-strong)] transition-all"
                    >
                      <img src={url} alt={`Avatar ${i}`} className="w-full h-full" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[var(--accent-gradient)] text-white shadow-[var(--shadow-strong)] relative mb-4 ring-4 ring-black/5">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black">{profileForm.firstName?.[0] || 'M'}{profileForm.lastName?.[0] || 'M'}</span>
                  )}
                  <button 
                    onClick={() => setShowAvatarPicker(true)}
                    className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[var(--accent-strong)] text-white border-2 border-white dark:border-zinc-900 shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera size={14} />
                  </button>
                </div>
              )}

              <div className="space-y-1">
                 <h2 className="text-2xl font-black tracking-tight">{profileForm.firstName} {profileForm.lastName}</h2>
                 <p className="text-sm font-semibold text-[var(--text-secondary)]">{profileForm.email}</p>
                 <div className="mt-2 flex justify-center gap-2">
                    <Badge variant="primary" className="text-[10px] uppercase font-black tracking-widest px-3">Premium</Badge>
                    <Badge variant="secondary" className="text-[10px] uppercase font-black tracking-widest px-3">Expert</Badge>
                 </div>
              </div>
           </div>

           <nav className="space-y-1">
              {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-sm font-black transition-all duration-300 ${activeTab === tab.id ? 'bg-black text-white shadow-xl' : 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'}`}
                 >
                    <tab.icon size={18} className={activeTab === tab.id ? 'text-[var(--accent-strong)]' : ''} />
                    {tab.label}
                 </button>
              ))}
              <button 
                onClick={logout}
                className="flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-sm font-black text-rose-500 hover:bg-rose-500/5 transition-all duration-300"
              >
                <LogOut size={18} />
                Sign Out
              </button>
           </nav>

           <Card className="border-black/8 bg-[var(--surface)] p-6 shadow-[var(--shadow-strong)] dark:border-white/8">
              <div className="flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                    <Star size={20} fill="currentColor" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Loyalty Points</p>
                    <p className="text-xl font-black text-[var(--text-primary)]">2,450 XP</p>
                 </div>
              </div>
              <p className="mt-4 text-[10px] font-bold leading-relaxed text-[var(--text-muted)]">
                You're nearly at the "Spice Master" tier. 550 more points for free delivery!
              </p>
           </Card>
        </aside>

        {/* Content Area */}
        <main className="min-h-[600px]">
           <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                 <motion.div
                   key="profile"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-10"
                 >
                    <div className="space-y-2">
                       <h1 className="font-display text-4xl font-black tracking-tight leading-tight">Profile Information</h1>
                       <p className="text-[var(--text-muted)] font-medium">Keep your account details up to date for a smoother experience.</p>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-8 max-w-2xl">
                       <div className="grid gap-6 sm:grid-cols-2">
                          <Input 
                            label="First Name" 
                            value={profileForm.firstName} 
                            onChange={e => setProfileForm({...profileForm, firstName: e.target.value})}
                            icon={UserIcon}
                          />
                          <Input 
                            label="Last Name" 
                            value={profileForm.lastName} 
                            onChange={e => setProfileForm({...profileForm, lastName: e.target.value})}
                          />
                       </div>
                       <Input 
                         label="Email Address" 
                         type="email"
                         value={profileForm.email} 
                         onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                         icon={Bell}
                       />
                       <Input 
                         label="Mobile Number" 
                         value={profileForm.mobileNumber} 
                         onChange={e => setProfileForm({...profileForm, mobileNumber: e.target.value})}
                         icon={CreditCard}
                       />
                       <Button size="lg" className="px-12 py-6 text-lg shadow-xl" disabled={savingProfile}>
                         {savingProfile ? 'Saving...' : 'Update Details'}
                       </Button>
                    </form>
                 </motion.div>
              )}

              {(activeTab === 'addresses' || activeTab === 'addresses-new') && (
                 <motion.div
                   key="addresses"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-10"
                 >
                    {activeTab === 'addresses' ? (
                       <>
                         <div className="flex items-center justify-between">
                            <div className="space-y-2">
                               <h1 className="font-display text-4xl font-black tracking-tight leading-tight text-[var(--text-primary)]">Saved Addresses</h1>
                               <p className="text-[var(--text-muted)] font-semibold">Manage your delivery locations for faster checkout.</p>
                            </div>
                            <Button 
                              variant="secondary" 
                              onClick={() => { setAddressForm(emptyAddress); setEditingId(null); setActiveTab('addresses-new'); }} 
                              icon={Plus} 
                              className="font-black h-12 shadow-[var(--shadow-soft)]"
                            >
                              Add New
                            </Button>
                         </div>

                         <div className="grid gap-6 sm:grid-cols-2">
                            {addresses.length === 0 ? (
                              <div className="col-span-full py-16 text-center rounded-[var(--radius-xl)] border-2 border-dashed border-black/8 dark:border-white/8">
                                <MapPin size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-20" />
                                <p className="text-[var(--text-muted)] font-bold">No addresses found. Add your first delivery location!</p>
                              </div>
                            ) : addresses.map(addr => (
                               <Card key={addr.id} className={`group p-6 space-y-4 shadow-[var(--shadow-soft)] border-black/8 dark:border-white/8 transition-all hover:shadow-[var(--shadow-strong)] ${addr.default ? 'ring-2 ring-[var(--accent-strong)] ring-offset-4 dark:ring-offset-[var(--surface)]' : ''}`}>
                                  <div className="flex items-start justify-between">
                                     <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--accent-strong)] shadow-inner">
                                        <MapPin size={24} />
                                     </div>
                                     {addr.default && <Badge variant="primary" className="font-black">Default</Badge>}
                                  </div>
                                   <div className="space-y-1.5">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className={`p-1.5 rounded-lg ${addr.addressType === 'Home' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                          {addr.addressType === 'Home' ? <Home size={14} /> : addr.addressType === 'Work' ? <Briefcase size={14} /> : <MapPin size={14} />}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{addr.addressType || 'Other'}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <p className="text-base font-black text-[var(--text-primary)]">{addr.recipientName || user.firstName}</p>
                                        <p className="text-[10px] font-bold opacity-70">{addr.recipientPhone || user.mobileNumber}</p>
                                      </div>
                                      <p className="text-sm font-bold text-[var(--text-secondary)]">
                                         {addr.line1}, {addr.line2 && `${addr.line2}, `}{addr.city}, {addr.pincode}
                                      </p>
                                      <p className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)] opacity-60">{addr.state}</p>
                                   </div>
                                  <div className="flex items-center gap-6 pt-5 border-t border-black/8 dark:border-white/8">
                                     {!addr.default && (
                                       <button 
                                         onClick={() => handleSetDefault(addr.id)}
                                         className="text-xs font-black uppercase tracking-widest text-[var(--accent-strong)] hover:scale-105 active:scale-95 transition-transform"
                                       >
                                         Set Default
                                       </button>
                                     )}
                                     <div className="flex-1" />
                                     <button 
                                       onClick={() => handleEditAddress(addr)}
                                       className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105 active:scale-95 transition-transform"
                                     >
                                       Edit
                                     </button>
                                     <button 
                                       onClick={() => handleDeleteAddress(addr.id)}
                                       className="text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 hover:scale-105 active:scale-95 transition-transform"
                                     >
                                       Remove
                                     </button>
                                  </div>
                               </Card>
                            ))}
                         </div>
                       </>
                    ) : (
                       <div className="max-w-2xl space-y-10">
                          <div className="flex items-center gap-4">
                            <button onClick={() => setActiveTab('addresses')} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-black hover:text-white transition-all shadow-[var(--shadow-soft)]">
                              <Star className="rotate-[-90deg]" size={18} />
                            </button>
                            <div className="space-y-1">
                              <h1 className="font-display text-4xl font-black tracking-tight leading-tight text-[var(--text-primary)]">{editingId ? 'Edit' : 'Add New'} Address</h1>
                              <p className="text-[var(--text-muted)] font-semibold">Enter your delivery details below.</p>
                            </div>
                          </div>

                          <form onSubmit={handleAddressSubmit} className="space-y-8 p-8 rounded-[var(--radius-xl)] bg-[var(--surface)] border border-black/8 shadow-[var(--shadow-strong)] dark:border-white/8">
                             <div className="flex justify-end">
                                <Button 
                                  type="button" 
                                  variant="secondary" 
                                  size="sm" 
                                  loading={geolocating}
                                  onClick={handleUseLocation}
                                  icon={Navigation}
                                  className="h-10 text-[10px] font-black uppercase tracking-[0.14em]"
                                >
                                  {geolocating ? 'Detecting...' : 'Use Current Location'}
                                </Button>
                             </div>

                             <div className="grid gap-6 sm:grid-cols-2">
                                <Input 
                                   label="Recipient Name" 
                                   placeholder="Who's receiving this?"
                                   value={addressForm.recipientName} 
                                   onChange={e => setAddressForm({...addressForm, recipientName: e.target.value})}
                                   required
                                />
                                <Input 
                                   label="Recipient Mobile" 
                                   placeholder="10-digit number"
                                   value={addressForm.recipientPhone} 
                                   onChange={e => setAddressForm({...addressForm, recipientPhone: e.target.value})}
                                   maxLength={10}
                                   required
                                />
                             </div>

                             <Input 
                                label="House / Flat No / Street" 
                                placeholder="E.g. #123, 1st Cross, Near Park"
                                value={addressForm.line1} 
                                onChange={e => setAddressForm({...addressForm, line1: e.target.value})}
                                icon={MapPin}
                                required
                             />
                             <Input 
                                label="Landmark (Optional)" 
                                placeholder="E.g. Beside SBI ATM"
                                value={addressForm.line2} 
                                onChange={e => setAddressForm({...addressForm, line2: e.target.value})}
                             />

                             <div className="grid gap-6 sm:grid-cols-2">
                                <Input 
                                   label="City" 
                                   placeholder="E.g. Hubballi"
                                   value={addressForm.city} 
                                   onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                                   required
                                />
                                <Input 
                                   label="Pincode" 
                                   placeholder="6-digit code"
                                   value={addressForm.pincode} 
                                   onChange={e => setAddressForm({...addressForm, pincode: e.target.value})}
                                   maxLength={6}
                                   required
                                />
                             </div>
                             
                             <Input 
                                label="State" 
                                placeholder="E.g. Karnataka"
                                value={addressForm.state} 
                                onChange={e => setAddressForm({...addressForm, state: e.target.value})}
                                required
                             />

                             <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Address Type</p>
                                <div className="flex gap-4">
                                  {['Home', 'Work', 'Other'].map(type => (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => setAddressForm({...addressForm, addressType: type})}
                                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 transition-all font-black text-xs ${addressForm.addressType === type ? 'border-black bg-black text-white shadow-lg scale-105' : 'border-black/5 hover:bg-[var(--surface-muted)] text-[var(--text-muted)]'}`}
                                    >
                                      {type === 'Home' ? <Home size={14} /> : type === 'Work' ? <Briefcase size={14} /> : <Navigation size={14} />}
                                      {type}
                                    </button>
                                  ))}
                                </div>
                             </div>

                             <div className="flex items-center gap-3 py-2">
                                <input 
                                  type="checkbox" 
                                  id="isDefault" 
                                  className="h-5 w-5 rounded border-black/8 accent-[var(--accent-strong)]"
                                  checked={addressForm.isDefault}
                                  onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})}
                                />
                                <label htmlFor="isDefault" className="text-sm font-bold text-[var(--text-primary)] cursor-pointer">Set as default delivery address</label>
                             </div>

                             <div className="flex gap-4 pt-4">
                               <Button variant="secondary" onClick={() => setActiveTab('addresses')} className="flex-1 py-6 text-lg">Cancel</Button>
                               <Button size="lg" className="flex-[2] py-6 text-lg shadow-xl font-bold text-white bg-[var(--accent-strong)] hover:bg-[color-mix(in_srgb,var(--accent-strong),black_10%)] transition-all" disabled={savingAddress}>
                                 {savingAddress ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}
                               </Button>
                             </div>
                          </form>
                       </div>
                    )}
                 </motion.div>
              )}
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default Profile;

