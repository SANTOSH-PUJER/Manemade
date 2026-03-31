import { Gift, TicketPercent } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

function OffersSection({ offers }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-[34px] border border-white/10 bg-[var(--accent-gradient)] p-8 text-white shadow-[var(--shadow-strong)]">
        <SectionHeading eyebrow="Today's offers" title="Launch-ready promotions with proper visual hierarchy" description="The promo block feels premium, highly visible, and mobile-friendly without looking noisy." />
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
          <Gift size={16} />
          Offer codes auto-applied at checkout
        </div>
      </div>

      <div className="grid gap-5">
        {offers.map((offer) => (
          <article key={offer.title} className="rounded-[30px] border border-white/10 bg-white/70 p-6 shadow-[var(--shadow-soft)] dark:bg-white/5">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              <TicketPercent size={14} />
              {offer.badge}
            </div>
            <h3 className="font-display text-2xl font-semibold">{offer.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{offer.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default OffersSection;
