import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import SectionHeading from '../ui/SectionHeading';
import DishCard from '../ui/DishCard';

function PopularCarousel({ dishes }) {
  const scrollRef = useRef(null);

  const scrollByAmount = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 340, behavior: 'smooth' });
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow="Popular dishes" title="A carousel that feels curated, not crowded" description="Signature dishes are pulled into a premium horizontal browse experience with big imagery and quick add actions." />
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => scrollByAmount(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/70 shadow-[var(--shadow-soft)] dark:bg-white/5">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => scrollByAmount(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/70 shadow-[var(--shadow-soft)] dark:bg-white/5">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-3">
        {dishes.map((dish) => (
          <div key={dish.id} className="min-w-[310px] max-w-[310px] snap-start">
            <DishCard dish={dish} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularCarousel;
