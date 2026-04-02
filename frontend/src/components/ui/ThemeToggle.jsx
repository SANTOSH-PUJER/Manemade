import { motion, AnimatePresence } from 'framer-motion';
import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-black/8 bg-[var(--surface)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-strong)] dark:border-white/10 active:scale-95"
      aria-label="Toggle dark mode"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.3, ease: 'backOut' }}
          className="flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <SunMedium size={20} className="text-amber-400" />
          ) : (
            <MoonStar size={20} className="text-[var(--text-primary)]" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export default ThemeToggle;
