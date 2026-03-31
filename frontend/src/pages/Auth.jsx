import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dishes } from '../data/catalog';
import { authService } from '../services/userService';

function FloatingInput({ label, name, type = 'text', value, onChange, error }) {
  return (
    <label className="relative block">
      <input name={name} type={type} value={value} onChange={onChange} placeholder=" " className={`peer w-full rounded-[22px] border bg-white/70 px-4 py-4 text-sm outline-none transition dark:bg-white/5 ${error ? 'border-rose-400' : 'border-white/15 focus:border-[var(--accent-strong)]'}`} required />
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-transparent px-1 text-sm text-[var(--text-muted)] transition-all peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:bg-[var(--surface)] peer-focus:text-xs peer-focus:text-[var(--accent-strong)] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:bg-[var(--surface)] peer-[:not(:placeholder-shown)]:text-xs">{label}</span>
      {error && <span className="mt-2 block text-xs text-rose-500">{error}</span>}
    </label>
  );
}

function validate(mode, formData) {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (formData.password.trim().length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (mode === 'register') {
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!/^\d{10,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Phone should be 10 to 15 digits';
    }
  }
  return errors;
}

function Auth({ mode: initialMode }) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { login } = useAuth();
  const redirectTo = location.state?.from || '/';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(mode, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const response = await authService.register({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, mobileNumber: formData.phone, password: formData.password });
        login(response.data);
        showToast({ title: 'Registration complete', description: 'Your account has been created and signed in.', tone: 'success' });
        navigate(redirectTo, { replace: true });
      } else {
        const response = await authService.login({ username: formData.email, password: formData.password });
        login(response.data);
        showToast({ title: 'Welcome back', description: 'You are now signed in to Manemade.', tone: 'success' });
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      showToast({ title: 'Authentication failed', description: error.response?.data?.message || 'Please check your credentials and try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[40px] border border-white/10 bg-white/70 shadow-[var(--shadow-strong)] dark:bg-white/5 lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={dishes[4].image} alt="Premium dessert plating" className="h-full min-h-[720px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/35 to-transparent" />
        <div className="absolute inset-x-10 bottom-10 rounded-[30px] border border-white/10 bg-white/10 p-8 text-white backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.24em] text-white/70">Member benefits</p>
          <h2 className="mt-3 font-display text-4xl font-semibold">A polished split-screen auth flow with motion and floating labels.</h2>
          <p className="mt-4 text-sm leading-7 text-white/80">Sign in faster, save addresses, reorder favorites, and manage premium meal subscriptions from one place.</p>
        </div>
      </div>

      <div className="p-6 sm:p-10 lg:p-14">
        <div className="mx-auto max-w-md">
          <div className="inline-flex rounded-full border border-white/10 bg-[var(--surface-muted)] p-1">
            {['login', 'register'].map((tab) => (
              <button key={tab} type="button" onClick={() => { setMode(tab); setErrors({}); }} className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition ${mode === tab ? 'bg-[var(--accent-gradient)] text-white shadow-[var(--shadow-soft)]' : 'text-[var(--text-secondary)]'}`}>
                {tab}
              </button>
            ))}
          </div>

          <motion.div key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-muted)]">{mode === 'login' ? 'Welcome back' : 'Create account'}</p>
              <h1 className="mt-3 font-display text-4xl font-semibold">{mode === 'login' ? 'Login to continue ordering' : 'Register for a premium food account'}</h1>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Clean split layouts, strong visual rhythm, and smooth interactions help this screen feel shipping-ready.</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[var(--surface-muted)] p-4 text-sm text-[var(--text-secondary)]"><div className="flex items-center gap-3"><ShieldCheck size={16} className="text-[var(--accent-strong)]" />Secure checkout, saved addresses, and order history all connect from this account flow.</div></div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <FloatingInput label="First name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
                  <FloatingInput label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
                </div>
              )}

              <FloatingInput label="Email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
              {mode === 'register' && <FloatingInput label="Phone number" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />}

              <label className="relative block">
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder=" " className={`peer w-full rounded-[22px] border bg-white/70 px-4 py-4 pr-12 text-sm outline-none transition dark:bg-white/5 ${errors.password ? 'border-rose-400' : 'border-white/15 focus:border-[var(--accent-strong)]'}`} required />
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-transparent px-1 text-sm text-[var(--text-muted)] transition-all peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:bg-[var(--surface)] peer-focus:text-xs peer-focus:text-[var(--accent-strong)] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:bg-[var(--surface)] peer-[:not(:placeholder-shown)]:text-xs">Password</span>
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                {errors.password && <span className="mt-2 block text-xs text-rose-500">{errors.password}</span>}
              </label>

              <div className="flex items-center justify-between pt-1 text-sm">
                <Link to="/forgot-password" className="text-[var(--accent-strong)]">Forgot password?</Link>
                <p className="text-[var(--text-muted)]">{mode === 'login' ? 'New here?' : 'Already have an account?'}</p>
              </div>

              <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-gradient)] px-6 py-4 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? 'Please wait...' : mode === 'login' ? 'Login now' : 'Create account'}
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
