import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, ShieldCheck, Mail, Lock, User, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useMenuData from '../hooks/useMenuData';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

function Auth({ mode: initialMode }) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', email: '', phone: '', password: '' 
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { login, register } = useAuth();
  const redirectTo = location.state?.from || '/';
  const { menuItems } = useMenuData();
  const showcaseImage = menuItems[4]?.image || menuItems[0]?.image;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    
    if (mode === 'register') {
      if (!formData.firstName) newErrors.firstName = 'Required';
      if (!formData.lastName) newErrors.lastName = 'Required';
      if (formData.phone.length < 10) newErrors.phone = '10 digits required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (mode === 'register') {
        await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobileNumber: formData.phone,
          password: formData.password,
        });
      } else {
        await login({ 
          username: formData.email, 
          password: formData.password 
        });
      }
      
      showToast({ 
        title: mode === 'login' ? 'Welcome back!' : 'Account created!', 
        description: 'Happy ordering!',
        tone: 'success' 
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      showToast({ title: 'Error', description: error.response?.data?.message || 'Authentication failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[var(--radius-xl)] bg-[var(--surface)] shadow-[var(--shadow-strong)] lg:grid lg:grid-cols-2">
      {/* Left: Imagery */}
      <div className="relative hidden lg:block h-[800px]">
        <img 
          src={showcaseImage} 
          alt="Premium food" 
          className="h-full w-full object-cover transition-transform duration-[20s] hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute inset-x-12 bottom-12 space-y-4">
           <Badge variant="primary" className="shadow-2xl">Premium Access</Badge>
           <h2 className="font-display text-5xl font-black text-white leading-[1.1] tracking-tight">
             Regional flavors, <br /> delivered with <span className="text-[var(--accent-strong)]">excellence.</span>
           </h2>
           <p className="max-w-md text-lg font-medium text-white/70">
             Join our community of food connoisseurs and experience the true taste of North Karnataka.
           </p>
        </div>
      </div>

      {/* Right: Forms */}
      <div className="flex flex-col p-8 sm:p-12 lg:p-16 overflow-y-auto max-h-[800px] scrollbar-hide">
        <div className="w-full max-w-sm mx-auto">
          {/* Tab Selection */}
          <div className="mb-12 inline-flex w-full rounded-2xl bg-[var(--surface-muted)] p-1.5 shadow-inner">
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => { setMode(t); setErrors({}); }}
                className={`flex-1 rounded-xl py-3 text-sm font-black uppercase tracking-widest transition-all duration-300 ${mode === t ? 'bg-white text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-strong)]">
                  {mode === 'login' ? 'Access your account' : 'Join the experience'}
                </p>
                <h1 className="font-display text-4xl font-black tracking-tight leading-tight">
                  {mode === 'login' ? 'Welcome back to Manemade.' : 'Start your flavor journey here.'}
                </h1>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input 
                      label="First Name" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      error={errors.firstName}
                      icon={User}
                    />
                    <Input 
                      label="Last Name" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      error={errors.lastName}
                    />
                  </div>
                )}

                <Input 
                  label="Email Address" 
                  name="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleChange} 
                  error={errors.email}
                  icon={Mail}
                />

                {mode === 'register' && (
                  <Input 
                    label="Phone Number" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    error={errors.phone}
                    icon={Phone}
                  />
                )}

                <div className="relative">
                  <Input 
                    label="Password" 
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    value={formData.password} 
                    onChange={handleChange} 
                    error={errors.password}
                    icon={Lock}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-10 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {mode === 'login' && (
                  <div className="flex items-center justify-between">
                    <Link to="/forgot-password" size="sm" className="text-xs font-bold text-[var(--accent-strong)] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                )}

                <Button 
                  size="lg" 
                  className="w-full py-6 text-lg shadow-xl" 
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : mode === 'login' ? 'Confirm & Secure Login' : 'Create My Account'}
                  {!loading && <ArrowRight size={20} className="ml-2" />}
                </Button>
              </form>

              <div className="flex items-center gap-4 py-4">
                <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Verified Entry</span>
                <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
              </div>

              <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/5 p-4 text-emerald-600">
                <ShieldCheck size={18} />
                <p className="text-xs font-bold uppercase tracking-widest">End-to-End Encrypted Access</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Auth;

