import type { BarChartItem } from "@/lib/explore-types";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface BarChartProps {
  items: BarChartItem[];
}

export function BarChart({ items }: BarChartProps) {
  if (items.length === 0) return null;

  const max = Math.max(...items.map((item) => item.value));

  return (
    <div className="flex flex-col gap-tight" role="list" aria-label="Bar chart">
      {items.map((item, i) => {
        const pct = max > 0 ? (item.value / max) * 100 : 0;
        const color = item.color ?? CHART_COLORS[i % CHART_COLORS.length];

        return (
          <div key={i} className="flex items-center gap-element" role="listitem" aria-label={`${item.label}: ${item.value.toLocaleString()}`}>
            <span className="text-sm font-mono text-muted-foreground w-28 text-right truncate" title={item.label}>
              {item.label}
            </span>
            <div className="flex-1 h-6 bg-muted/30 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-500 ease-out"
                style={{
                  width: `${pct}%`,
                  backgroundColor: color,
                  minWidth: pct > 0 ? "4px" : "0",
                }}
              />
            </div>
            <span className="text-sm font-mono tabular-nums w-12 text-right">
              {item.value.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
