import { motion } from 'framer-motion';
import { Gift, Sparkles, Tag, Zap } from 'lucide-react';
import Card from '../ui/Card';

const icons = [Gift, Tag, Zap, Sparkles];

export default function OffersSection({ offers }) {
  return (
    <section className="space-y-12 py-16">
      <div className="space-y-2 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-primary)]">
          Limited Time Deals
        </p>
        <h2 className="font-display text-5xl font-black tracking-tight">
          Today's Specials
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {offers.map((offer, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group relative overflow-hidden flex flex-col items-center justify-center p-12 text-center transition-all bg-[var(--surface)] border-[var(--border-light)] hover:shadow-[var(--shadow-lg)] dark:bg-white/5" radius="xl">
                {/* Background Accent */}
                <div className="absolute right-0 top-0 h-40 w-40 translate-x-10 translate-y-[-10px] rounded-full bg-[var(--accent-primary)]/5 transition-transform duration-700 group-hover:scale-150" />
                
                <div className="relative mb-8 flex h-20 w-20 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-gradient)] text-white shadow-2xl shadow-[var(--accent-primary)]/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Icon size={36} />
                </div>
                
                <div className="space-y-4 relative">
                  <span className="inline-flex rounded-full bg-[var(--accent-primary)]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--accent-primary)]">
                    {offer.badge}
                  </span>
                  <h3 className="text-3xl font-black tracking-tight">
                    {offer.title}
                  </h3>
                  <p className="text-sm font-bold leading-relaxed text-[var(--text-secondary)] max-w-sm mx-auto">
                    {offer.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
