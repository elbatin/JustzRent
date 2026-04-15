export default function FleetLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2" />
        <div className="h-9 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
      </div>
      <div className="flex gap-8">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
        {/* Grid skeleton */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="h-52 bg-muted animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-9 bg-muted rounded animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}