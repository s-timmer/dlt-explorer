import { Activity, XCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RunHistory } from "./run-history";
import { EventTimeline } from "./event-timeline";
import { FreshnessTimestamp, getFreshnessLevel } from "./freshness";
import type { Pipeline, TimelineEvent } from "./types";

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatRows(n: number): string {
  if (n === 0) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function PipelineCard({ pipeline }: { pipeline: Pipeline }) {
  const freshness = getFreshnessLevel(pipeline);
  const isOverdue = freshness !== "fresh" && pipeline.status !== "failed";
  const hasBody = pipeline.phases || pipeline.schemaChange || pipeline.status !== "success" || isOverdue;

  // Build unified event list
  const events: TimelineEvent[] = [];
  if (isOverdue) {
    events.push({ status: "warning", label: "Overdue", detail: `Expected ${pipeline.schedule.toLowerCase()}`, icon: <Clock className="h-3.5 w-3.5 text-amber-600" /> });
  }
  if (pipeline.phases) {
    pipeline.phases.forEach((phase) => {
      events.push({ status: phase.status, label: phase.name, detail: phase.detail });
    });
  }
  if (pipeline.schemaChange) {
    events.push({ status: "warning", label: pipeline.schemaChange.type, detail: pipeline.schemaChange.detail });
  }

  return (
    <Card className="overflow-hidden py-0 gap-0">
      <CardContent className="p-0">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 pb-3">
          <div className="flex items-start gap-2.5">
            {pipeline.status === "failed" && <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />}
            {pipeline.status !== "failed" && <Activity className="h-4 w-4 text-muted-foreground/70 flex-shrink-0 mt-0.5" />}
            <h3 className="text-sm font-semibold text-foreground font-mono truncate min-w-0">
              {pipeline.name}
            </h3>
            <div className="ml-auto flex-shrink-0 mt-1">
              <RunHistory runs={pipeline.recentRuns} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between ml-[26px] mt-1">
            <div>
              <p className="text-xs text-muted-foreground">
                {pipeline.source} → {pipeline.destination}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {pipeline.schedule}
                {pipeline.lastDuration > 0 && <> · {formatDuration(pipeline.lastDuration)}</>}
                {pipeline.rowsLastRun > 0 && <> · {formatRows(pipeline.rowsLastRun)} rows</>}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1 sm:mt-0">
              <FreshnessTimestamp pipeline={pipeline} />
            </p>
          </div>
        </div>

        {/* Body — timeline of events */}
        {hasBody && events.length > 0 && (
          <>
            <div className="border-t" />
            <EventTimeline events={events} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
