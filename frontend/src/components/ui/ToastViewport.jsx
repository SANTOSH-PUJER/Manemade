import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, AlertTriangle, AlertCircle } from 'lucide-react';

const TONE_CONFIG = {
  success: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  error: {
    icon: AlertCircle,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20'
  },
  default: {
    icon: Info,
    color: 'text-[var(--accent-strong)]',
    bg: 'bg-[var(--accent-soft)]',
    border: 'border-[var(--accent-strong)]/10'
  }
};

function ToastViewport({ toasts, onClose }) {
  return (
    <div className="pointer-events-none fixed right-4 bottom-24 sm:bottom-12 sm:right-12 z-[100] flex w-[min(92vw,400px)] flex-col gap-4">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = TONE_CONFIG[toast.tone] || TONE_CONFIG.default;
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto group relative overflow-hidden rounded-[24px] border ${config.border} bg-[var(--surface)]/90 p-5 shadow-[var(--shadow-strong)] backdrop-blur-2xl`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${config.bg} ${config.color} shadow-inner`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-black tracking-tight">{toast.title}</p>
                  {toast.description && (
                    <p className="text-xs font-medium text-[var(--text-secondary)] leading-relaxed">
                      {toast.description}
                    </p>
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => onClose(toast.id)} 
                  className="rounded-full p-1 text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* Progress Bar placeholder - would need logic to animate based on timeout */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-black/5 dark:bg-white/5">
                 <motion.div 
                   initial={{ width: '100%' }}
                   animate={{ width: '0%' }}
                   transition={{ duration: 3.2, ease: 'linear' }}
                   className={`h-full ${config.color.replace('text-', 'bg-')}`} 
                 />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default ToastViewport;
