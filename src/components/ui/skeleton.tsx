import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[9px] bg-empty", className)}
      {...props}
    />
  )
}

export { Skeleton }

export function ImageSkeleton() {
  return (
    <div className="overflow-hidden rounded-sticker border-2 border-ink bg-card shadow-sticker-sm animate-pulse">
      <div className="aspect-square bg-empty"></div>
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 rounded bg-empty"></div>
        <div className="h-3 w-1/2 rounded bg-empty"></div>
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-empty"></div>
          <div className="h-6 w-12 rounded-full bg-empty"></div>
        </div>
      </div>
    </div>
  )
}

export function GallerySkeleton() {
  return (
    <div className="grid w-full max-w-7xl gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <ImageSkeleton key={i} />
      ))}
    </div>
  )
}
