export default function Loading() {
  return (
    <main className="pt-4 pb-24">
      <div className="container">
        <div className="space-y-6">
          <div className="h-10 w-80 animate-pulse rounded-md bg-gray-100" />

          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row">
            <div className="h-10 w-full animate-pulse rounded-full bg-gray-100" />
            <div className="h-10 w-full animate-pulse rounded-full bg-gray-100" />
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex h-full flex-col gap-4 rounded-xl">
              <div className="aspect-[4/3] animate-pulse rounded-lg bg-gray-100" />

              <div className="space-y-3">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
              </div>

              <div className="h-px w-16 bg-gray-100" />

              <div className="space-y-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
