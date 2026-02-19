"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PipelineRun, RunStatus } from "./types";

const barColors: Record<RunStatus, string> = {
  success: "bg-emerald-500",
  failed: "bg-red-500",
  warning: "bg-amber-500",
  running: "bg-blue-500",
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

const MAX_BAR_HEIGHT = 14;
const MIN_BAR_HEIGHT = 3;

const BAR_BASE = 4;
const BAR_HOVER = 8;
const BAR_NEAR = 6;

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
  const [visible, setVisible] = useState(false);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const delayRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reversed = [...runs].reverse();

  const maxDuration = Math.max(...reversed.map((r) => r.duration), 1);

  // Small delay on first hover, then instant switching between bars
  useEffect(() => {
    if (hoveredIndex !== null && !visible) {
      delayRef.current = setTimeout(() => setVisible(true), 120);
    }
    if (hoveredIndex === null) {
      setVisible(false);
      clearTimeout(delayRef.current);
    }
    return () => clearTimeout(delayRef.current);
  }, [hoveredIndex, visible]);

  const hoveredRun = hoveredIndex !== null ? reversed[hoveredIndex] : null;
  const tooltipLabel = hoveredRun
    ? `${hoveredRun.timestamp}: ${hoveredRun.status}${hoveredRun.duration ? ` (${formatDuration(hoveredRun.duration)})` : ""}`
    : "";

  const bar = hoveredIndex !== null ? barRefs.current[hoveredIndex] : null;
  const rect = bar?.getBoundingClientRect();

  return (
    <div onMouseLeave={() => setHoveredIndex(null)}>
      <div
        className="flex items-end gap-px"
        style={{ height: MAX_BAR_HEIGHT }}
      >
        {reversed.map((run, i) => {
          const height = run.duration > 0
            ? Math.max(MIN_BAR_HEIGHT, Math.round((run.duration / maxDuration) * MAX_BAR_HEIGHT))
            : MIN_BAR_HEIGHT;

          return (
            <div
              key={i}
              ref={(el) => { barRefs.current[i] = el; }}
              className={`rounded-[1px] cursor-default transition-all duration-150 ease-out ${barColors[run.status]} ${run.status === "running" ? "animate-pulse" : ""}`}
              style={{ height, width: getBarWidth(i, hoveredIndex), opacity: getBarOpacity(i, hoveredIndex) }}
              onMouseEnter={() => setHoveredIndex(i)}
            />
          );
        })}
      </div>

      {visible && rect && createPortal(
        <div
          className="fixed z-50 pointer-events-none transition-[left] duration-100 ease-out"
          style={{
            top: rect.bottom + 8,
            left: rect.left + rect.width / 2,
            transform: "translateX(-50%)",
          }}
        >
          {/* Arrow */}
          <div
            className="mx-auto size-2 rotate-45 bg-foreground -mb-1"
            style={{ marginLeft: "calc(50% - 4px)" }}
          />
          {/* Body */}
          <div className="bg-foreground text-background rounded-md px-3 py-1.5 text-xs whitespace-nowrap">
            {tooltipLabel}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
