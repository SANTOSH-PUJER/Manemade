import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';

function CategoryHighlights({ categories }) {
  return (
    <section className="space-y-8">
      <SectionHeading eyebrow="Regional edits" title="Built around the flavors Manemade should own" description="A focused category system helps users scan quickly while making the regional cuisine feel special instead of generic." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => (
          <motion.article
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: index * 0.08 }}
            className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/70 shadow-[var(--shadow-soft)] dark:bg-white/5"
          >
            <div className="overflow-hidden">
              <img src={category.image} alt={category.name} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="space-y-2 p-5">
              <h3 className="font-display text-2xl font-semibold">{category.name}</h3>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">{category.subtitle}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default CategoryHighlights;
