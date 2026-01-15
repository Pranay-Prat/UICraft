import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectLoading() {
  return (
    <div className="flex h-screen w-full">
      {/* Left panel - Messages */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>

      {/* Right panel - Preview */}
      <div className="flex-1 flex flex-col">
        <div className="p-2 border-b flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Skeleton className="h-16 w-16 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
