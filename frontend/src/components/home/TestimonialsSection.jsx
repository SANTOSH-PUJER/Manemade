import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import Card from '../ui/Card';

export default function TestimonialsSection({ testimonials }) {
  return (
    <section className="space-y-12 py-24 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute bottom-[-100px] left-[-100px] h-96 w-96 rounded-full bg-orange-500/5 blur-[120px] -z-10" />

      <div className="space-y-2 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-primary)]">
          Wall of Love
        </p>
        <h2 className="font-display text-5xl font-black tracking-tight">
          What our Foodies Say
        </h2>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <Card className="h-full flex flex-col p-10 space-y-8 relative overflow-hidden group border-[var(--border-light)] bg-[var(--surface)] transition-all duration-500 hover:shadow-[var(--shadow-lg)] dark:bg-white/5" radius="xl">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <blockquote className="text-xl font-bold italic leading-relaxed text-[var(--text-primary)] relative z-10">
                "{t.quote}"
              </blockquote>

              <div className="mt-auto flex items-center gap-5 border-t border-black/5 pt-8 dark:border-white/5 relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-gradient)] text-base font-black uppercase text-white shadow-xl shadow-[var(--accent-primary)]/20 overflow-hidden">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-black text-lg text-[var(--text-primary)]">{t.name}</h4>
                  <p className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
