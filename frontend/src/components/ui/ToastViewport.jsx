import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X } from 'lucide-react';

function ToastViewport({ toasts, onClose }) {
  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[60] flex w-[min(92vw,360px)] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 24, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.98 }}
            className="pointer-events-auto rounded-3xl border border-white/15 bg-[var(--surface)]/95 p-4 shadow-[var(--shadow-strong)] backdrop-blur-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-2xl bg-[var(--accent-soft)] p-2 text-[var(--accent-strong)]">
                {toast.tone === 'success' ? <CheckCircle2 size={16} /> : <Info size={16} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description && <p className="mt-1 text-sm text-[var(--text-secondary)]">{toast.description}</p>}
              </div>
              <button type="button" onClick={() => onClose(toast.id)} className="text-[var(--text-muted)]">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastViewport;
