import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "Is the food truly homemade?",
    answer: "Absolutely! ManeMade partners only with experienced home-cooks and small artisan kitchens. We maintain strict quality checks to ensure that everything you eat is prepared with the same care and traditional methods used in a home kitchen."
  },
  {
    question: "How long does delivery take?",
    answer: "Since our food is prepared fresh on order (not pre-made), delivery typically takes between 45 to 60 minutes depending on your distance from the kitchen. This ensures you receive high-quality, authentic flavors."
  },
  {
    question: "What is your cancellation policy?",
    answer: "You can cancel your order within 5 minutes of placing it for a full refund. Since our artisans start prepping immediately after that, cancellations after 5 minutes may only be partially refunded or not eligible for refund depending on the preparation stage."
  },
  {
    question: "Are there specific North Karnataka specialties?",
    answer: "Yes! ManeMade specialized in the authentic flavors of Hubli, Dharwad, and Belgaum regions. Look for our signature Jowar Roti, Shenga Holige, and authentic spice mixes in the shop."
  },
  {
    question: "Do you offer bulk orders for events?",
    answer: "Yes, we do! For bulk orders or catering requests, please use our Contact page or call our support line. We recommend placing bulk orders at least 24-48 hours in advance."
  },
  {
    question: "Can I customize the spice levels?",
    answer: "Most of our artisans allow spice customization. You can add specific instructions in the 'Order Notes' section during checkout, and our cooks will do their best to accommodate your taste."
  }
];

function FaqItem({ question, answer, isOpen, toggle }) {
  return (
    <div className="border-b border-gray-100 dark:border-white/5 last:border-0 overflow-hidden">
      <button 
        onClick={toggle}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-lg font-black transition-colors ${isOpen ? 'text-[var(--accent-strong)]' : 'text-gray-900 dark:text-white group-hover:text-[var(--accent-strong)]'}`}>
          {question}
        </span>
        <motion.div
           animate={{ rotate: isOpen ? 180 : 0 }}
           className={`flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 transition-colors ${isOpen ? 'bg-[var(--accent-strong)] text-white' : 'text-gray-500'}`}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="pb-8 text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-3xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <div className="text-center space-y-4 mb-20">
          <Badge variant="primary">Common Questions</Badge>
          <h1 className="font-display text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            Frequently Asked <span className="text-[var(--accent-strong)]">Questions.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
            Everything you need to know about the ManeMade experience, delivery, and quality standards.
          </p>
        </div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-[var(--radius-3xl)] p-8 md:p-12 shadow-[var(--shadow-strong)] border border-gray-100 dark:border-white/5"
        >
          {faqs.map((faq, i) => (
            <FaqItem 
              key={i} 
              {...faq} 
              isOpen={openIndex === i} 
              toggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </motion.div>

        {/* Still Have Questions? */}
        <div className="mt-20 p-12 rounded-[var(--radius-3xl)] bg-black text-white text-center space-y-8 relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="font-display text-3xl font-black mb-4">Still have questions?</h2>
              <p className="text-gray-400 font-medium max-w-lg mx-auto mb-8">
                If you couldn't find your answer here, our friendly support team is always ready to help you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Button className="rounded-full px-10 h-14 font-black uppercase tracking-widest text-sm">
                   <MessageCircle size={18} className="mr-2" /> Start Live Chat
                 </Button>
                 <Link to="/contact">
                   <Button variant="outline" className="rounded-full px-10 h-14 font-black uppercase tracking-widest text-sm border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                     Visit Contact Page
                   </Button>
                 </Link>
              </div>
           </div>
           
           {/* Decorative background circle */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[var(--accent-strong)]/10 blur-[100px] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
