export default function ExploreLoading() {
  return (
    <main className="min-h-screen bg-white pt-14">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 lg:px-8">
        <div className="h-10 w-48 rounded-lg skeleton mb-8" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-black/[0.04] bg-white overflow-hidden">
              <div className="aspect-[4/3] skeleton" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 rounded skeleton" />
                <div className="h-4 w-full rounded skeleton" />
                <div className="h-3 w-1/3 rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
