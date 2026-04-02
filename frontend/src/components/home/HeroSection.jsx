import { motion } from 'framer-motion';
import { MapPin, Search, Sparkles, Timer, Truck } from 'lucide-react';
import Button from '../ui/Button';

function HeroSection({ query, suggestions, onQueryChange, onSearch, heroImage, stats }) {
  return (
    <section className="relative min-h-[85vh] grid items-center gap-12 lg:grid-cols-2 pt-16 lg:pt-0">
      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-strong)]/20 bg-[var(--accent-soft)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-strong)]"
        >
          <Sparkles size={14} strokeWidth={3} />
          Premium homemade Karnataka favorites
        </motion.div>

        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-5xl font-black leading-[1.1] tracking-tight sm:text-7xl"
          >
            Homemade flavors, modern comfort, and a cleaner way to order.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl text-lg font-medium leading-relaxed text-[var(--text-secondary)]"
          >
            Discover soft jolada rotti, rich ennegayi, fiery chutneys, and everyday snack classics, all presented with a premium Manemade experience.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative max-w-2xl group"
        >
          <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-black/5 bg-[var(--surface)] p-2 shadow-[var(--shadow-strong)] transition-all group-focus-within:border-[var(--accent-strong)]/40 dark:border-white/5">
            <div className="pl-4 text-[var(--text-muted)]">
              <Search size={22} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search for Jolada Rotti, Ennegayi, or Snacks..."
              className="flex-1 bg-transparent py-4 px-2 text-lg font-medium placeholder:text-[var(--text-muted)]/60 focus:outline-none"
            />
            <Button
              size="lg"
              className="rounded-[var(--radius-sm)]"
              onClick={onSearch}
            >
              Discover
            </Button>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-[var(--radius-md)] border border-black/5 bg-[var(--surface)] p-2 shadow-[var(--shadow-strong)] backdrop-blur-3xl z-30 dark:border-white/5">
              {suggestions.slice(0, 5).map((s, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--accent-strong)] rounded-[var(--radius-sm)]"
                  onClick={() => {
                    onQueryChange(s);
                    onSearch();
                  }}
                >
                  <Search size={14} className="text-[var(--text-muted)]" />
                  {s}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Features Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-6"
        >
          <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-secondary)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--accent-strong)]">
              <Truck size={18} />
            </div>
            Fast Delivery
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-secondary)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--accent-strong)]">
              <Timer size={18} />
            </div>
            Daily Fresh
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-secondary)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--accent-strong)]">
              <MapPin size={18} />
            </div>
            Regional Choice
          </div>
        </motion.div>
      </div>

      {/* Visual Column */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative perspective-1000 hidden lg:block"
      >
        <div className="relative z-10 overflow-hidden rounded-[var(--radius-xl)] border-[12px] border-white bg-white/20 shadow-[var(--shadow-strong)] dark:border-white/10">
          <img
            src={heroImage || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80'}
            alt="Premium Regional Food"
            className="h-[600px] w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Floaters */}
          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between gap-4 rounded-[var(--radius-lg)] bg-[var(--surface-glass)]/95 p-6 shadow-2xl backdrop-blur-xl">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-black text-[var(--accent-strong)]">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Background Accents */}
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[var(--accent-strong)]/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />
      </motion.div>
    </section>
  );
}

export default HeroSection;
