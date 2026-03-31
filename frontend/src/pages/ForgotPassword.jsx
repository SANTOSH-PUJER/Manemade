import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();
    showToast({
      title: 'Reset link requested',
      description: `A password reset flow can be connected here for ${email}.`,
      tone: 'success',
    });
  };

  return (
    <div className="mx-auto max-w-2xl rounded-[40px] border border-white/10 bg-white/70 p-8 shadow-[var(--shadow-soft)] dark:bg-white/5 sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]"><Mail size={22} /></div>
      <h1 className="mt-6 text-center font-display text-4xl font-semibold">Reset your password</h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-7 text-[var(--text-secondary)]">The supporting auth pages now match the rest of the redesign, with smoother spacing, better hierarchy, and premium card treatment.</p>

      <form className="mx-auto mt-8 max-w-md space-y-4" onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" className="w-full rounded-[22px] border border-white/15 bg-[var(--surface-muted)] px-4 py-4 outline-none transition focus:border-[var(--accent-strong)]" required />
        <button type="submit" className="w-full rounded-full bg-[var(--accent-gradient)] px-6 py-4 text-sm font-semibold text-white shadow-[var(--shadow-soft)]">Send reset link</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
