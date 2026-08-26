export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`skeleton ${className}`} />
);

export const SongCardSkeleton = () => (
  <div className="flex flex-col gap-3">
    <Skeleton className="w-full aspect-square rounded-xl" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

export const SectionSkeleton = () => (
  <div className="space-y-4 mb-10">
    <Skeleton className="h-7 w-48" />
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => <SongCardSkeleton key={i} />)}
    </div>
  </div>
);
