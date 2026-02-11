import { Skeleton } from "@/components/ui/skeleton";

export function ThinkingIndicator() {
  return (
    <div className="flex flex-col gap-element py-2" role="status" aria-label="Analyzing data">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex gap-1" aria-hidden="true">
          <span className="animate-bounce inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
          <span className="animate-bounce inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
          <span className="animate-bounce inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
        </div>
        <span>Analyzing data…</span>
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
