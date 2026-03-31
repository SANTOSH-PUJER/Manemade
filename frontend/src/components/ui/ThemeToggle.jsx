import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/45 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 dark:bg-white/5"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
    </button>
  );
}

export default ThemeToggle;
