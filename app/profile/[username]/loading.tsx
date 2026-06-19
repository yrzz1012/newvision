export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-radial-glow">
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-20 lg:px-8">
        {/* User info skeleton */}
        <div className="panel-float rounded-3xl p-8 text-center">
          <div className="mx-auto h-24 w-24 rounded-full skeleton mb-4" />
          <div className="h-7 w-32 rounded-lg skeleton mx-auto" />
          <div className="h-4 w-24 rounded skeleton mx-auto mt-2" />
          <div className="h-4 w-48 rounded skeleton mx-auto mt-4" />
        </div>
        {/* Works grid skeleton */}
        <div className="mt-10">
          <div className="h-6 w-24 rounded skeleton mb-6" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
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
      </div>
    </main>
  );
}
