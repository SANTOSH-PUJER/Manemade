import { motion } from 'framer-motion';
import { CreditCard, HelpCircle, Package, Search, Truck, LifeBuoy, Mail, MessageSquare, Phone } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { Link } from 'react-router-dom';

export default function Support() {
  const categories = [
    {
      icon: Package,
      title: 'Order Tracking',
      desc: 'Check the status of your current orders and delivery history.',
      to: '/orders'
    },
    {
      icon: CreditCard,
      title: 'Payments & Refunds',
      desc: 'Information about payment methods, failed transactions, and refunds.',
      to: '/faq'
    },
    {
      icon: Truck,
      title: 'Delivery Support',
      desc: 'Issues with delivery timing, address changes, or partner concerns.',
      to: '/contact'
    },
    {
      icon: HelpCircle,
      title: 'Artisan Quality',
      desc: 'Learn more about our homemade standards and food safety.',
      to: '/about'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[var(--radius-3xl)] bg-black p-12 lg:p-24 text-center">
           <div className="relative z-10 space-y-8">
              <Badge variant="primary">ManeMade Support Center</Badge>
              <h1 className="font-display text-5xl md:text-7xl font-black text-white tracking-tight">
                How can we <span className="text-[var(--accent-strong)]">help you today?</span>
              </h1>
              <div className="max-w-xl mx-auto relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--accent-strong)] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search for answers..."
                  className="w-full h-16 pl-16 pr-6 rounded-2xl bg-white/10 border-2 border-transparent focus:border-[var(--accent-strong)] focus:bg-white text-gray-900 dark:text-white outline-none transition-all font-medium"
                />
              </div>
           </div>
           
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 h-64 w-64 bg-[var(--accent-strong)]/20 blur-[100px] rounded-full" />
           <div className="absolute bottom-0 left-0 h-64 w-64 bg-blue-500/10 blur-[100px] rounded-full" />
        </div>

        {/* Categories Grid */}
        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Link key={i} to={cat.to}>
              <motion.div 
                whileHover={{ y: -10 }}
                className="h-full p-8 rounded-[var(--radius-2xl)] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-white/5 hover:border-[var(--accent-strong)] transition-all group"
              >
                <div className="h-14 w-14 rounded-2xl bg-white dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white mb-6 shadow-sm group-hover:bg-[var(--accent-strong)] group-hover:text-white transition-all">
                  <cat.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tight">{cat.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{cat.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Contact Links Section */}
        <div className="mt-32 grid lg:grid-cols-3 gap-8">
           <div className="p-10 rounded-[var(--radius-3xl)] bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Phone size={20} /></div>
              <h4 className="text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">Call Support</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">+91 98765 43210</p>
           </div>
           <div className="p-10 rounded-[var(--radius-3xl)] bg-blue-500/5 border border-blue-500/10 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white"><Mail size={20} /></div>
              <h4 className="text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">Email Us</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">help@manemade.in</p>
           </div>
           <div className="p-10 rounded-[var(--radius-3xl)] bg-[var(--accent-strong)]/5 border border-[var(--accent-strong)]/10 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-[var(--accent-strong)] flex items-center justify-center text-white"><MessageSquare size={20} /></div>
              <h4 className="text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">Live Chat</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Available 10am-8pm</p>
           </div>
        </div>

        {/* FAQ Preview */}
        <div className="mt-32 text-center space-y-8">
           <h2 className="font-display text-4xl font-black text-gray-900 dark:text-white">Quick <span className="text-[var(--accent-strong)]">Answers.</span></h2>
           <Link 
             to="/faq" 
             className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[var(--accent-strong)] hover:underline"
           >
             View All FAQs <HelpCircle size={16} />
           </Link>
        </div>
      </div>
    </div>
  );
}
