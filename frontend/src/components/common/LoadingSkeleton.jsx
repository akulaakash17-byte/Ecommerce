export function PropertyCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="h-48 animate-pulse bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-10 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="card divide-y divide-slate-100">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="grid grid-cols-4 gap-4 p-4" key={index}>
          <div className="h-4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
