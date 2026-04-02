import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import Card from '../ui/Card';

export default function TestimonialsSection({ testimonials }) {
  return (
    <section className="space-y-12 py-20 relative">
      {/* Background Accent */}
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-500/5 blur-[100px] -z-10" />

      <div className="space-y-2 text-center">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">
          Wall of love
        </p>
        <h2 className="font-display text-4xl font-black tracking-tight">
          What our Foodies Say
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full flex flex-col p-8 space-y-6 relative overflow-hidden group">
              {/* Quote Icon Background */}
              <div className="absolute -right-4 -top-4 text-[var(--accent-strong)]/5 rotate-12 transition-transform duration-500 group-hover:rotate-0">
                <Quote size={120} />
              </div>

              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>

              <blockquote className="text-lg font-bold leading-relaxed text-[var(--text-primary)] relative z-10">
                "{t.quote}"
              </blockquote>

              <div className="mt-auto flex items-center gap-4 border-t border-black/5 pt-6 dark:border-white/5 relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-gradient)] text-sm font-bold text-white shadow-md">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--text-primary)]">{t.name}</h4>
                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
