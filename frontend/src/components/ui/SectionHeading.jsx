function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">{description}</p>}
    </div>
  );
}

export default SectionHeading;
