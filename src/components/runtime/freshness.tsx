import { Clock } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { Pipeline } from "./types";

/**
 * Parse a schedule string into an approximate interval in hours.
 * Handles our mock formats: "Every X hours", "Every hour", "Daily at HH:MM"
 */
function scheduleToIntervalHours(schedule: string): number {
  const lower = schedule.toLowerCase();
  if (lower.includes("every hour")) return 1;
  const everyMatch = lower.match(/every (\d+) hours?/);
  if (everyMatch) return parseInt(everyMatch[1], 10);
  if (lower.includes("daily")) return 24;
  if (lower.includes("weekly")) return 168;
  return 24; // fallback
}

/**
 * Parse "X hours ago" / "X minutes ago" into hours.
 * Returns 0 for "Running now" or unparseable strings.
 */
function lastRunToHours(lastRun: string): number {
  if (lastRun.toLowerCase().includes("now")) return 0;
  const hoursMatch = lastRun.match(/(\d+)\s*hours?\s*ago/);
  if (hoursMatch) return parseInt(hoursMatch[1], 10);
  const minsMatch = lastRun.match(/(\d+)\s*min(ute)?s?\s*ago/);
  if (minsMatch) return parseInt(minsMatch[1], 10) / 60;
  return 0;
}

export type FreshnessLevel = "fresh" | "aging" | "stale";

export function getFreshnessLevel(pipeline: Pipeline): FreshnessLevel {
  if (pipeline.status === "running") return "fresh";

  const intervalHours = scheduleToIntervalHours(pipeline.schedule);
  const hoursSinceRun = lastRunToHours(pipeline.lastRun);
  const ratio = hoursSinceRun / intervalHours;

  if (ratio <= 1.2) return "fresh";     // within expected window (+ 20% grace)
  if (ratio <= 2.0) return "aging";     // a bit late
  return "stale";                        // significantly overdue
}

const freshnessStyles: Record<FreshnessLevel, string> = {
  fresh: "text-muted-foreground",
  aging: "text-amber-500",
  stale: "text-red-500",
};

function getFreshnessLabel(pipeline: Pipeline): string | null {
  if (pipeline.status === "running") return null;

  const intervalHours = scheduleToIntervalHours(pipeline.schedule);
  const hoursSinceRun = lastRunToHours(pipeline.lastRun);
  const ratio = hoursSinceRun / intervalHours;

  if (ratio <= 1.2) return null; // on time, no label needed
  if (ratio < 2.0) {
    const pct = Math.round((ratio - 1) * 100);
    return `${pct}% late`;
  }
  return `${ratio.toFixed(1).replace(/\.0$/, "")}x overdue`;
}

export function FreshnessTimestamp({ pipeline }: { pipeline: Pipeline }) {
  const level = getFreshnessLevel(pipeline);
  const label = getFreshnessLabel(pipeline);

  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      {level !== "fresh" && label && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Clock className={`h-2.5 w-2.5 ${freshnessStyles[level]} cursor-default`} />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Overdue — expected {pipeline.schedule.toLowerCase()}
          </TooltipContent>
        </Tooltip>
      )}
      {pipeline.lastRun}
    </span>
  );
}
