import Skeleton from './Skeleton';

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-4 rounded-[var(--radius-xl)] border border-black/5 bg-[var(--surface)] p-6 dark:border-white/5">
      <Skeleton height="h-48" className="rounded-2xl" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton width="w-2/3" height="h-6" />
          <Skeleton width="w-10" height="h-5" className="rounded-full" />
        </div>
        <Skeleton width="w-full" height="h-4" />
        <div className="flex items-center justify-between pt-4">
          <div className="space-y-1 flex-1">
             <Skeleton width="w-12" height="h-3" />
             <Skeleton width="w-20" height="h-7" />
          </div>
          <Skeleton width="w-12" height="h-12" variant="circular" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
