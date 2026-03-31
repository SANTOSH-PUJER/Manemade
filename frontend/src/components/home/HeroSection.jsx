import { motion } from 'framer-motion';
import { MapPin, Sparkles, TimerReset, Truck } from 'lucide-react';
import SearchBar from '../ui/SearchBar';

function HeroSection({ query, suggestions, onQueryChange, onSearch, heroImage, stats }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/60 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] shadow-[var(--shadow-soft)] dark:bg-white/5">
          <Sparkles size={16} className="text-[var(--accent-strong)]" />
          Curated home-style menus from North Karnataka
        </motion.div>

        <div className="space-y-5">
          <h1 className="font-display text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            A premium food delivery experience for dishes that still feel like home.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Discover jolada rotti, fiery chutneys, festive holige, and chef-made regional meals with a richer visual experience, faster ordering flow, and elevated packaging story.
          </p>
        </div>

        <SearchBar value={query} onChange={onQueryChange} onSubmit={onSearch} suggestions={suggestions} />

        <div className="grid gap-3 text-sm text-[var(--text-secondary)] sm:grid-cols-3">
          <div className="rounded-[24px] border border-white/15 bg-white/65 p-4 shadow-[var(--shadow-soft)] dark:bg-white/5">
            <MapPin size={18} className="mb-3 text-[var(--accent-strong)]" />
            Live in Hubballi, Dharwad, and Bengaluru
          </div>
          <div className="rounded-[24px] border border-white/15 bg-white/65 p-4 shadow-[var(--shadow-soft)] dark:bg-white/5">
            <Truck size={18} className="mb-3 text-[var(--accent-strong)]" />
            Fast doorstep delivery with premium packaging
          </div>
          <div className="rounded-[24px] border border-white/15 bg-white/65 p-4 shadow-[var(--shadow-soft)] dark:bg-white/5">
            <TimerReset size={18} className="mb-3 text-[var(--accent-strong)]" />
            Chef pickup windows optimized for freshness
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="relative">
        <div className="absolute -left-6 top-8 hidden rounded-[28px] border border-white/10 bg-[var(--surface)]/85 p-4 shadow-[var(--shadow-strong)] backdrop-blur-xl sm:block">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Chef curated</p>
          <p className="mt-2 max-w-[11rem] text-sm font-medium">Menus crafted around authentic home recipes and seasonal ingredients.</p>
        </div>

        <div className="overflow-hidden rounded-[40px] border border-white/10 bg-white/40 p-3 shadow-[var(--shadow-strong)] backdrop-blur-2xl dark:bg-white/5">
          <img src={heroImage} alt="Premium North Karnataka platter" className="h-[520px] w-full rounded-[30px] object-cover" />
        </div>

        <div className="absolute -bottom-6 right-6 grid min-w-[220px] grid-cols-3 gap-3 rounded-[28px] border border-white/10 bg-[var(--surface)]/90 p-4 shadow-[var(--shadow-strong)] backdrop-blur-xl">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-lg font-semibold sm:text-xl">{stat.value}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
