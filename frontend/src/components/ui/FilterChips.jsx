function FilterChips({ options, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            active === option ? 'border-transparent bg-[var(--accent-gradient)] text-white shadow-[var(--shadow-soft)]' : 'border-white/15 bg-white/60 text-[var(--text-secondary)] dark:bg-white/5'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default FilterChips;
