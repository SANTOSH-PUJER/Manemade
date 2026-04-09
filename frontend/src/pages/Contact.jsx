import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      showToast({ title: 'Message Sent!', description: "We'll get back to you shortly.", tone: 'success' });
      setLoading(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const contactInfo = [
    { icon: Phone, title: 'Phone', value: '+91 98765 43210', detail: 'Mon-Fri from 9am to 6pm' },
    { icon: Mail, title: 'Email', value: 'help@manemade.in', detail: 'We usually respond within 24h' },
    { icon: MapPin, title: 'Office', value: 'Hubli, Karnataka', detail: 'Artisan Hub & Main Support' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 sm:pt-24 pb-16 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-start">
          
          {/* Left Side: Contact Info */}
          <div className="space-y-10 sm:space-y-12">
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <Badge variant="primary">Contact Us</Badge>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                Let's <span className="text-[var(--accent-strong)]">Talk Flavor.</span>
              </h1>
              <p className="max-w-md mx-auto lg:mx-0 text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium">
                Have a question about our dishes, a problem with an order, or just want to share your love for homemade food? We're here for you.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {contactInfo.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl sm:rounded-[var(--radius-xl)] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-white/5 transition-transform hover:scale-[1.01]">
                  <div className="h-12 w-12 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 shadow-lg shrink-0">
                    <item.icon size={22} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-[var(--accent-strong)]">{item.title}</h3>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[var(--radius-3xl)] bg-white dark:bg-gray-800 shadow-[var(--shadow-strong)] border border-gray-100 dark:border-white/5"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid sm:grid-cols-2 gap-6">
                  <Input 
                    label="Full Name" 
                    placeholder="Santosh Pujer" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-12 sm:h-14"
                  />
                  <Input 
                    label="Email Address" 
                    type="email" 
                    placeholder="name@example.com" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-12 sm:h-14"
                  />
               </div>
               <Input 
                  label="Subject" 
                  placeholder="How can we help?" 
                  required 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="h-12 sm:h-14"
               />
               <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-gray-500">Your Message</label>
                 <textarea 
                   rows={5}
                   className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-[var(--accent-strong)] outline-none transition-all text-sm font-medium"
                   placeholder="Type your message here..."
                   required
                   value={formData.message}
                   onChange={(e) => setFormData({...formData, message: e.target.value})}
                 />
               </div>
               <Button size="lg" className="w-full h-14 sm:h-16 text-base sm:text-lg font-black uppercase tracking-widest shadow-xl premium-gradient text-white border-0" disabled={loading}>
                 {loading ? 'Sending...' : 'Send Message'}
                 {!loading && <Send size={20} className="ml-3" />}
               </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
