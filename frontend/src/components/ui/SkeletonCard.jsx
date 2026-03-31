function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/60 p-4 shadow-[var(--shadow-soft)] dark:bg-white/5">
      <div className="skeleton h-48 rounded-[24px]" />
      <div className="mt-4 space-y-3">
        <div className="skeleton h-4 w-1/3 rounded-full" />
        <div className="skeleton h-6 w-3/4 rounded-full" />
        <div className="skeleton h-4 w-full rounded-full" />
        <div className="skeleton h-11 w-full rounded-full" />
      </div>
    </div>
  );
}

export default SkeletonCard;
