import { motion } from 'framer-motion';
import { Gift, Sparkles, Tag, Zap } from 'lucide-react';
import Card from '../ui/Card';

const icons = [Gift, Tag, Zap, Sparkles];

export default function OffersSection({ offers }) {
  return (
    <section className="space-y-10 py-12">
      <div className="space-y-2 text-center">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-strong)]">
          Limited time deals
        </p>
        <h2 className="font-display text-4xl font-black tracking-tight">
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
              <Card className="group relative overflow-hidden flex flex-col items-center justify-center p-8 text-center transition-all hover:bg-[var(--surface-muted)]">
                {/* Background Accent */}
                <div className="absolute right-0 top-0 h-40 w-40 translate-x-10 translate-y-[-10px] rounded-full bg-[var(--accent-strong)]/5 transition-transform duration-700 group-hover:scale-150" />
                
                <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-gradient)] text-white shadow-xl shadow-[var(--accent-strong)]/20 transition-transform duration-500 group-hover:rotate-6">
                  <Icon size={32} />
                </div>
                
                <div className="space-y-3 relative">
                  <span className="inline-flex rounded-full bg-[var(--accent-strong)]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--accent-strong)]">
                    {offer.badge}
                  </span>
                  <h3 className="text-2xl font-black tracking-tight underline decoration-[var(--accent-strong)]/30 decoration-4 underline-offset-4">
                    {offer.title}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-[var(--text-muted)] max-w-sm mx-auto">
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
