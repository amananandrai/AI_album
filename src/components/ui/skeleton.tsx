import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/10", className)}
      {...props}
    />
  )
}

export { Skeleton }

export function ImageSkeleton() {
  return (
    <div className="glass rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-white/10"></div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="h-3 bg-white/10 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-white/10 rounded-full w-16"></div>
          <div className="h-6 bg-white/10 rounded-full w-12"></div>
        </div>
      </div>
    </div>
  )
}

export function GallerySkeleton() {
  return (
    <div className="grid gap-4 sm:gap-5 md:gap-4 lg:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-7xl">
      {Array.from({ length: 12 }).map((_, i) => (
        <ImageSkeleton key={i} />
      ))}
    </div>
  )
}
