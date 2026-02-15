"use client";

import { useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { PipelineRun, RunStatus } from "./types";

const barColors: Record<RunStatus, string> = {
  success: "bg-emerald-400",
  failed: "bg-red-400",
  warning: "bg-amber-400",
  running: "bg-blue-400",
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

const MAX_BAR_HEIGHT = 14; // px
const MIN_BAR_HEIGHT = 3;  // px — even zero-duration runs get a dot

const BAR_BASE = 4;    // px — default width
const BAR_HOVER = 8;   // px — hovered bar
const BAR_NEAR = 6;    // px — immediate neighbors

function getBarWidth(index: number, hoveredIndex: number | null): number {
  if (hoveredIndex === null) return BAR_BASE;
  const distance = Math.abs(index - hoveredIndex);
  if (distance === 0) return BAR_HOVER;
  if (distance === 1) return BAR_NEAR;
  return BAR_BASE;
}

function getBarOpacity(index: number, hoveredIndex: number | null): number {
  if (hoveredIndex === null) return 1;
  const distance = Math.abs(index - hoveredIndex);
  if (distance === 0) return 1;
  if (distance === 1) return 0.7;
  return 0.4;
}

export function RunHistory({ runs }: { runs: PipelineRun[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const reversed = [...runs].reverse();

  // Find max duration to normalize bar heights
  const maxDuration = Math.max(...reversed.map((r) => r.duration), 1);

  return (
    <div
      className="flex items-end gap-px"
      style={{ height: MAX_BAR_HEIGHT }}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {reversed.map((run, i) => {
        const height = run.duration > 0
          ? Math.max(MIN_BAR_HEIGHT, Math.round((run.duration / maxDuration) * MAX_BAR_HEIGHT))
          : MIN_BAR_HEIGHT;

        const label = `${run.timestamp}: ${run.status}${run.duration ? ` (${formatDuration(run.duration)})` : ""}`;

        return (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <div
                className={`rounded-[1px] cursor-default transition-all duration-150 ease-out ${barColors[run.status]} ${run.status === "running" ? "animate-pulse" : ""}`}
                style={{ height, width: getBarWidth(i, hoveredIndex), opacity: getBarOpacity(i, hoveredIndex) }}
                onMouseEnter={() => setHoveredIndex(i)}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
