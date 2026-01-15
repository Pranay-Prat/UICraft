import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full min-h-screen">
      {/* Hero section skeleton */}
      <section className="relative w-full py-16 md:py-24 px-6">
        <div className="relative z-10 flex flex-col items-center text-center mb-14">
          <Skeleton className="h-12 md:h-16 w-[300px] md:w-[500px] mb-5" />
          <Skeleton className="h-5 w-[250px] md:w-[400px]" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl">
          {/* Template grid skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>

          {/* Input skeleton */}
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </section>

      {/* Projects section skeleton */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <Skeleton className="h-8 w-40 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
