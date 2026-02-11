import type { StatResult } from "@/lib/explore-types";

interface StatCardProps {
  stats: StatResult[];
}

export function StatCard({ stats }: StatCardProps) {
  if (stats.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-element">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex-1 min-w-[120px] rounded-md border border-border/50 bg-muted/20 p-card"
        >
          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
          <p className="text-2xl font-semibold font-mono tracking-tight">
            {stat.value}
          </p>
          {stat.detail && (
            <p className="text-xs text-muted-foreground mt-1">{stat.detail}</p>
          )}
        </div>
      ))}
    </div>
  );
}
