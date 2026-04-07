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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.45, 0.32, 0.9] }}
            className="font-display text-6xl font-black leading-tight tracking-tight sm:text-8xl"
          >
            Fresh Homemade Food <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-amber-500">Delivered.</span>
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
          <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-black/5 bg-[var(--surface-glass)] p-2.5 shadow-[var(--shadow-lg)] backdrop-blur-xl transition-all group-focus-within:ring-2 group-focus-within:ring-[var(--accent-primary)]/40 dark:border-white/10 dark:bg-white/5">
            <div className="pl-4 text-[var(--accent-primary)]">
              <Search size={24} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="What are you craving today? e.g. Jolada Rotti"
              className="flex-1 bg-transparent py-4 px-3 text-lg font-bold placeholder:text-[var(--text-secondary)] focus:outline-none"
            />
            <Button
              size="lg"
              className="rounded-[var(--radius-sm)] px-10 py-5 text-[15px] font-black uppercase tracking-widest shadow-xl shadow-[var(--accent-primary)]/30 hover:scale-[1.02]"
              onClick={onSearch}
            >
              Browse Menu
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
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="relative perspective-2000 hidden lg:block"
      >
        <div className="relative z-10 overflow-hidden rounded-[var(--radius-xl)] border-[16px] border-white bg-white/20 shadow-[var(--shadow-lg)] backdrop-blur-sm dark:border-white/10">
          <img
            src={heroImage || "https://images.unsplash.com/photo-1547928576-965beedf769d?q=80&w=1200&auto=format&fit=crop"}
            alt="Fresh Homemade Food"
            className="h-[650px] w-full object-cover transition-transform duration-1000 hover:scale-110"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Premium Floater: Stats */}
          <div className="absolute -bottom-8 -left-8 right-8 flex items-center justify-around gap-6 rounded-[var(--radius-lg)] border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-2xl dark:bg-black/60">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group-hover:scale-110 transition-transform">
                <p className="text-3xl font-black text-[var(--accent-primary)]">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ambient Glows */}
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[var(--accent-primary)]/15 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]" />
      </motion.div>
    </section>
  );
}

export default HeroSection;
