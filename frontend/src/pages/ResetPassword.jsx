import { motion } from 'framer-motion';
import { Lock, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/userService';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const email = location.state?.email;

  // Redirect if no email in state
  if (!email) {
    navigate('/forgot-password');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      showToast({ title: 'Error', description: 'Passwords do not match', tone: 'error' });
      return;
    }

    if (formData.newPassword.length < 6) {
      showToast({ title: 'Error', description: 'Password must be at least 6 characters', tone: 'error' });
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      showToast({
        title: 'Success!',
        description: 'Your password has been reset. Please login with your new password.',
        tone: 'success'
      });
      navigate('/login');
    } catch (error) {
      console.error('Reset password error:', error);
      showToast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reset password. Please check your OTP.',
        tone: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-6 pt-24 pb-32">
      <Card className="p-8 sm:p-12 shadow-2xl border-black/5 dark:border-white/5 space-y-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent-gradient)] text-white shadow-xl">
             <ShieldCheck size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-4xl font-black tracking-tight">Set New Password</h1>
            <p className="text-sm font-medium text-[var(--text-muted)] max-w-sm">
              We've sent a 6-digit code to <span className="text-[var(--text-primary)] font-bold">{email}</span>. 
              Enter it along with your new password.
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input 
            label="Verification Code"
            name="otp"
            placeholder="6-digit OTP"
            value={formData.otp} 
            onChange={handleChange} 
            icon={ShieldCheck}
            maxLength={6}
            required 
          />
          
          <Input 
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Min 6 characters"
            value={formData.newPassword} 
            onChange={handleChange} 
            icon={Lock}
            required 
          />

          <Input 
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            value={formData.confirmPassword} 
            onChange={handleChange} 
            icon={Lock}
            required 
          />

          <Button 
            size="lg" 
            className="w-full py-6 text-lg shadow-xl" 
            disabled={loading}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
            {!loading && <ArrowRight size={20} className="ml-2" />}
          </Button>
        </form>

        <div className="pt-6 text-center border-t border-black/5 dark:border-white/5">
          <button 
            onClick={() => navigate('/forgot-password')}
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={16} />
            Change Email
          </button>
        </div>
      </Card>
    </div>
  );
}

export default ResetPassword;
