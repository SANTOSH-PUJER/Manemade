import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, Send, CheckCircle2, AlertCircle, RefreshCcw, ArrowRight } from 'lucide-react';
import { authService } from '../services/userService';
import { sendOtpEmail } from '../services/mailService';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

function OtpDemo() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const otpInputs = useRef([]);

  // Handle OTP digit change
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus move next
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  // Resend timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Generate OTP in Backend
      const response = await authService.generateOtp(email);
      const generatedOtp = response.data.otp;

      // 2. Send OTP via EmailJS
      await sendOtpEmail(email, 'User', generatedOtp);

      showToast({
        title: 'OTP Sent!',
        description: `Verification code sent to ${email}`,
        tone: 'success',
      });
      
      setStep(2);
      setTimer(60); // 1 minute cooldown for resend
    } catch (error) {
      console.error('Failed to send OTP:', error);
      showToast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send OTP. Is the email registered?',
        tone: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) {
      showToast({ title: 'Invalid OTP', description: 'Please enter all 6 digits', tone: 'warning' });
      return;
    }

    setLoading(true);
    try {
      // 3. Verify OTP in Backend
      const response = await authService.verifyOtp({ email, otp: otpString });
      
      if (response.data === true) {
        showToast({
          title: 'Verified!',
          description: 'Your identity has been confirmed successfully.',
          tone: 'success',
        });
        setStep(3); // Success state
      } else {
        showToast({
          title: 'Verification Failed',
          description: 'The code you entered is incorrect or expired.',
          tone: 'error',
        });
      }
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Something went wrong during verification.',
        tone: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-6 py-12">
      <Card className="max-w-md w-full p-8 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Progress header */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-black/5">
           <motion.div 
             className="h-full bg-[var(--accent-gradient)]" 
             initial={{ width: '0%' }}
             animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
           />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 mb-4">
                  <Mail size={32} />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Email Verification</h2>
                <p className="text-[var(--text-muted)]">Enter your email to receive a login code</p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <Input 
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full py-4 rounded-xl" 
                  disabled={loading}
                  glow
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                  {!loading && <Send size={18} className="ml-2" />}
                </Button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Enter Code</h2>
                <p className="text-[var(--text-muted)]">
                  Sent to <span className="font-bold text-[var(--text-primary)]">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => otpInputs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-12 h-14 text-center text-2xl font-bold bg-[var(--bg-secondary)] border-2 border-black/5 dark:border-white/5 rounded-xl focus:border-blue-500 focus:ring-0 transition-all outline-none"
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full py-4 rounded-xl" 
                    disabled={loading}
                    glow
                  >
                    {loading ? 'Verifying...' : 'Confirm OTP'}
                    {!loading && <ArrowRight size={18} className="ml-2" />}
                  </Button>
                  
                  <div className="text-center">
                    <button 
                      type="button"
                      disabled={timer > 0 || loading}
                      onClick={handleSendOtp}
                      className="inline-flex items-center gap-2 text-sm font-bold text-blue-500 hover:text-blue-600 disabled:text-[var(--text-muted)] transition-colors"
                    >
                      <RefreshCcw size={14} className={timer > 0 ? 'animate-spin' : ''} />
                      {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6"
            >
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
                  <CheckCircle2 size={64} />
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-2">Success!</h2>
                <p className="text-[var(--text-muted)] max-w-xs mx-auto text-lg">
                  Your account has been successfully verified. Welcome to ManeMade!
                </p>
              </div>
              
              <Button 
                onClick={() => setStep(1)} 
                variant="outline"
                className="rounded-xl px-8"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

export default OtpDemo;
