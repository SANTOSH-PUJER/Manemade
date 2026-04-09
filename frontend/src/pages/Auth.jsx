import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, ShieldCheck, Mail, Lock, User, Phone, Smartphone, Hash, Send, RefreshCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useMenuData from '../hooks/useMenuData';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { sendOtpEmail } from '../services/mailService';

function Auth({ mode: initialMode, adminOnly = false }) {
  const [mode, setMode] = useState(adminOnly ? 'login' : initialMode);
  const [loginType, setLoginType] = useState('password'); // 'password' or 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', email: '', phone: '', password: '', otp: ['', '', '', '', '', '']
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { login, loginWithOtp, register, isAuthenticated, loadingAuth } = useAuth();
  const redirectTo = location.state?.from || '/';
  const { menuItems } = useMenuData();
  const showcaseImage = menuItems[4]?.image || menuItems[0]?.image;
  const otpInputs = useRef([]);
  
  useEffect(() => {
    if (!loadingAuth && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, loadingAuth, navigate, redirectTo]);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleOtpDigitChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...formData.otp];
    newOtp[index] = value.substring(value.length - 1);
    setFormData(prev => ({ ...prev, otp: newOtp }));
    if (value && index < 5) otpInputs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email or Mobile is required';
    } else if (loginType === 'password' && !formData.email.includes('@') && formData.email.length < 10) {
      newErrors.email = 'Valid email or 10-digit mobile required';
    }
    
    if (loginType === 'password' && formData.password.length < 6) {
      newErrors.password = 'Min 6 characters';
    }

    if (loginType === 'otp' && otpSent && formData.otp.join('').length < 6) {
      newErrors.otp = '6-digit code required';
    }
    
    if (mode === 'register') {
      if (!formData.firstName) newErrors.firstName = 'Required';
      if (!formData.lastName) newErrors.lastName = 'Required';
      if (formData.phone.length < 10) newErrors.phone = '10 digits required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      showToast({ title: 'Identification Required', description: 'Enter email or mobile to receive code', tone: 'warning' });
      return;
    }
    
    setLoading(true);
    try {
      const { authService } = await import('../services/userService');
      const response = await authService.generateOtp(formData.email);
      const { otp, email: registeredEmail } = response.data;

      await sendOtpEmail(registeredEmail, formData.firstName || 'User', otp);
      
      setOtpSent(true);
      setOtpTimer(60);
      showToast({ 
        title: 'Security Code Sent', 
        description: `Code sent to your registered email ending in ${registeredEmail.split('@')[1]}`,
        tone: 'success' 
      });
    } catch (error) {
      showToast({ 
        title: 'Delivery Failed', 
        description: error.response?.data?.message || 'Could not send verification code.',
        tone: 'error' 
      });
    } finally {
      setLoading(false);
    }
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
          role: 'USER'
        });
        showToast({ title: 'Account created!', description: 'Please login now.', tone: 'success' });
        setMode('login');
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        if (loginType === 'password') {
          await login({ username: formData.email, password: formData.password });
        } else {
          await loginWithOtp({ email: formData.email, otp: formData.otp.join('') });
        }
        showToast({ title: 'Welcome back!', description: 'Access Granted.', tone: 'success' });
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      showToast({ 
        title: 'Authentication Error', 
        description: error.response?.data?.message || (loginType === 'otp' ? 'Invalid OTP code.' : 'Invalid credentials.'),
        tone: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[var(--radius-xl)] bg-white shadow-[var(--shadow-strong)] lg:grid lg:grid-cols-2 dark:bg-gray-900 transition-all duration-500">
      {/* Left: Imagery */}
      <div className="relative hidden lg:block h-full min-h-[800px]">
        <img 
          src={showcaseImage} 
          alt="Premium food" 
          className="h-full w-full object-cover transition-transform duration-[20s] hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute inset-x-12 bottom-12 space-y-4">
           <Badge variant="primary" className="shadow-2xl">Premium Access</Badge>
           <h2 className="font-display text-5xl font-black text-white leading-[1.1] tracking-tight">
             Regional flavors, <br /> delivered with <span className="text-orange-600">excellence.</span>
           </h2>
           <p className="max-w-md text-lg font-medium text-white/70">
             Join our community of food connoisseurs and experience the true taste of North Karnataka.
           </p>
        </div>
      </div>

      {/* Right: Forms */}
      <div className="flex flex-col p-6 sm:p-12 lg:p-16 lg:overflow-y-auto lg:max-h-[800px] scrollbar-hide">
        <div className="w-full max-w-sm mx-auto">
          {/* Tab Selection (Register / Login) */}
          {!adminOnly && (
            <div className="mb-6 sm:mb-8 inline-flex w-full rounded-2xl bg-gray-100 p-1.5 shadow-inner dark:bg-gray-800">
              {['login', 'register'].map((t) => (
                <button
                  key={t}
                  onClick={() => { setMode(t); setErrors({}); setOtpSent(false); }}
                  className={`flex-1 rounded-xl py-3 text-[10px] sm:text-sm font-black uppercase tracking-widest transition-all duration-300 ${mode === t ? 'bg-white text-gray-900 shadow-lg dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-${loginType}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">
                  {adminOnly ? 'Administrator Access' : (mode === 'login' ? 'Access your account' : 'Join the experience')}
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  {adminOnly ? 'ManeMade Admin Portal.' : (mode === 'login' ? 'Welcome back.' : 'Experience the joy of food.')}
                </h1>
              </div>

              {/* Password vs OTP Toggle for Login */}
              {mode === 'login' && !adminOnly && (
                <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl">
                  {['password', 'otp'].map((type) => (
                    <button
                      key={type}
                      onClick={() => { setLoginType(type); setErrors({}); setOtpSent(false); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${loginType === type ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400'}`}
                    >
                      {type === 'password' ? <Lock size={12} /> : <Smartphone size={12} />}
                      {type}
                    </button>
                  ))}
                </div>
              )}

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
                  label={mode === 'register' || loginType === 'otp' ? "Email Address" : "Email or Mobile Number"} 
                  name="email" 
                  type={mode === 'register' || loginType === 'otp' ? "email" : "text"}
                  value={formData.email} 
                  onChange={handleChange} 
                  error={errors.email}
                  icon={mode === 'register' || loginType === 'otp' ? Mail : Hash}
                  placeholder={mode === 'register' || loginType === 'otp' ? "e.g. alex@example.com" : "Email or Phone"}
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

                {loginType === 'password' || mode === 'register' ? (
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
                ) : (
                  <AnimatePresence>
                    {otpSent && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                        <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Verification Code</label>
                        <div className="flex justify-between gap-2">
                          {formData.otp.map((digit, idx) => (
                            <input
                              key={idx}
                              ref={el => otpInputs.current[idx] = el}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              className="w-full h-12 text-center text-lg font-bold bg-black/5 dark:bg-white/5 border-2 border-transparent rounded-xl focus:border-[var(--accent-strong)] outline-none transition-all"
                            />
                          ))}
                        </div>
                        {otpTimer > 0 ? (
                           <p className="text-[10px] text-center font-bold text-gray-400">Resend in {otpTimer}s</p>
                        ) : (
                          <button type="button" onClick={handleSendOtp} className="w-full text-[10px] font-black uppercase tracking-widest text-[var(--accent-strong)] hover:underline flex items-center justify-center gap-2">
                            <RefreshCcw size={12} /> Resend Code
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {mode === 'login' && loginType === 'password' && (
                  <div className="flex items-center justify-between">
                    <Link to="/forgot-password" size="sm" className="text-xs font-bold text-[var(--accent-strong)] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  {loginType === 'otp' && !otpSent && mode === 'login' ? (
                    <Button 
                      type="button"
                      size="lg" 
                      className="w-full py-6 text-lg shadow-xl" 
                      disabled={loading}
                      onClick={handleSendOtp}
                    >
                      {loading ? 'Sending...' : 'Request Login Code'}
                      {!loading && <Send size={20} className="ml-2" />}
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      className="w-full py-6 text-lg shadow-xl" 
                      disabled={loading}
                    >
                      {loading ? 'Authenticating...' : (adminOnly ? 'Authenticate as Admin' : (mode === 'login' ? 'Confirm & Secure Login' : 'Create My Account'))}
                      {!loading && <ArrowRight size={20} className="ml-2" />}
                    </Button>
                  )}
                </div>
              </form>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Verified Entry</span>
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
