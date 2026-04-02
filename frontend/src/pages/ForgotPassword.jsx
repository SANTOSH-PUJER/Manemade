import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send, ShieldCheck, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/userService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Connect to backend generate-otp
      await authService.generateOtp(email);
      
      showToast({
        title: 'OTP Sent Successfuly',
        description: `Please check your email (${email}) for the 6-digit code.`,
        tone: 'success',
      });
      // Navigate to separate reset-password page
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      console.error('Failed to send OTP:', error);
      showToast({
        title: 'Error',
        description: error.response?.data?.message || 'Could not send verification email.',
        tone: 'error',
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
             <Mail size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-4xl font-black tracking-tight">Recover Password</h1>
            <p className="text-sm font-medium text-[var(--text-muted)] max-w-sm">
              Enter your registered email address and we'll send you an OTP to verify your identity.
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSendOtp}>
          <Input 
            type="email" 
            label="Email Address"
            placeholder="e.g. alex@example.com"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            icon={Mail}
            required 
          />
          <Button 
            size="lg" 
            className="w-full py-6 text-lg shadow-xl" 
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send Verification Code'}
            {!loading && <Send size={20} className="ml-2" />}
          </Button>
        </form>

        <div className="pt-6 text-center border-t border-black/5 dark:border-white/5">
          <button 
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[var(--accent-strong)] hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>
      </Card>
    </div>
  );
}

export default ForgotPassword;


