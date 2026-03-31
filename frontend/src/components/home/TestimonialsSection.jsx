import { Quote } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

function TestimonialsSection({ testimonials }) {
  return (
    <section className="space-y-8">
      <SectionHeading eyebrow="Social proof" title="Testimonials and trust blocks that feel credible" description="A strong testimonial layer makes the premium redesign feel like a real production food product instead of a student project." align="center" />
      <div className="grid gap-5 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article key={testimonial.name} className="rounded-[30px] border border-white/10 bg-white/70 p-6 shadow-[var(--shadow-soft)] dark:bg-white/5">
            <div className="mb-5 inline-flex rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
              <Quote size={18} />
            </div>
            <p className="text-base leading-8 text-[var(--text-secondary)]">"{testimonial.quote}"</p>
            <div className="mt-6">
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-[var(--text-muted)]">{testimonial.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TestimonialsSection;
