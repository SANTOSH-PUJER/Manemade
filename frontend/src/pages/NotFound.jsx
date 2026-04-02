import { motion } from 'framer-motion';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl px-6 pt-32 pb-40 text-center">
      <Card className="flex flex-col items-center p-12 sm:p-20 space-y-10 shadow-2xl border-black/5 dark:border-white/5 relative overflow-hidden">
        {/* Abstract Background Decor */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent-strong)]/5 blur-3xl transition-transform duration-1000 group-hover:scale-150" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl transition-transform duration-1000 group-hover:scale-150" />

        <motion.div 
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex h-32 w-32 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--accent-strong)] shadow-inner group"
        >
          <Compass size={64} strokeWidth={1.5} className="transition-transform duration-700 group-hover:rotate-180" />
        </motion.div>

        <div className="space-y-4 relative z-10">
          <h1 className="font-display text-6xl font-black tracking-tighter leading-none opacity-10">404</h1>
          <h2 className="text-3xl font-black tracking-tight mt-[-2rem]">Lost in the flavors?</h2>
          <p className="text-sm font-medium text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
            The page you're searching for has either been moved or doesn't exist in our current menu. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
          <Button size="lg" onClick={() => navigate('/')} icon={Home}>
            Back to Home
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate(-1)} icon={ArrowLeft}>
            Previous Page
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default NotFound;
