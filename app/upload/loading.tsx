export default function UploadLoading() {
  return (
    <main className="min-h-screen bg-radial-glow pt-14">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-10 lg:px-8">
        <div className="h-8 w-32 rounded-lg skeleton mb-2" />
        <div className="h-4 w-48 rounded skeleton mb-8" />
        <div className="space-y-6">
          <div className="aspect-[16/9] rounded-2xl skeleton" />
          <div className="h-11 w-full rounded-xl skeleton" />
          <div className="h-24 w-full rounded-xl skeleton" />
          <div className="flex gap-2">
            <div className="h-10 w-16 rounded-full skeleton" />
            <div className="h-10 w-16 rounded-full skeleton" />
            <div className="h-10 w-20 rounded-full skeleton" />
          </div>
        </div>
      </div>
    </main>
  );
}
