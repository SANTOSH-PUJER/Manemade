import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';

function SearchBar({ value, onChange, onSubmit, suggestions = [], placeholder = 'Search for jolada rotti, ennegayi, chutney, snacks...' }) {
  const visibleSuggestions = suggestions.slice(0, 5);

  return (
    <div className="relative">
      <div className="flex flex-col gap-3 rounded-[32px] border border-white/15 bg-white/70 p-3 shadow-[var(--shadow-strong)] backdrop-blur-2xl dark:bg-white/5 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-[24px] px-3 py-2">
          <Search size={18} className="text-[var(--text-muted)]" />
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onSubmit();
              }
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)] sm:text-base"
          />
        </div>
        <button type="button" onClick={onSubmit} className="rounded-[22px] bg-[var(--accent-gradient)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5">
          Search dishes
        </button>
      </div>

      <AnimatePresence>
        {value && visibleSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute left-0 right-0 top-[calc(100%+12px)] rounded-[28px] border border-white/15 bg-[var(--surface)]/95 p-2 shadow-[var(--shadow-strong)] backdrop-blur-2xl"
          >
            {visibleSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onChange(suggestion)}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm text-[var(--text-secondary)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--text-primary)]"
              >
                <span>{suggestion}</span>
                <Search size={15} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;
