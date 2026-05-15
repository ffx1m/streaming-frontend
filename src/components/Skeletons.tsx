export function ContactSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="h-10 w-48 animate-pulse rounded bg-white/10" />
        <div className="h-5 w-80 animate-pulse rounded bg-white/10" />
      </div>
      <div className="space-y-3 rounded-lg border border-white/10 bg-[#1b1b1d] p-4 sm:p-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-4 rounded-md p-4">
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-md bg-white/10" />
            <div className="space-y-2">
              <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchHeaderSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <div className="mx-auto h-10 w-48 animate-pulse rounded bg-white/10" />
        <div className="mx-auto h-5 w-64 animate-pulse rounded bg-white/10" />
      </div>
      <div className="mx-auto h-14 max-w-2xl animate-pulse rounded-lg bg-white/10" />
      <div className="mx-auto h-40 max-w-2xl animate-pulse rounded-lg border border-white/10 bg-white/5" />
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="h-10 w-48 animate-pulse rounded bg-white/10" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex gap-4 rounded-lg border border-white/10 bg-[#1b1b1d] p-3 sm:p-4">
            <div className="aspect-[3/4] w-20 shrink-0 animate-pulse rounded-md bg-white/10 sm:w-24" />
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
              <div className="h-1.5 w-full animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
