export type RunStatus = "success" | "failed" | "running" | "warning";

export interface PipelineRun {
  timestamp: string;
  duration: number;
  rowsLoaded: number;
  status: RunStatus;
}

export interface Pipeline {
  name: string;
  source: string;
  destination: string;
  schedule: string;
  status: RunStatus;
  statusDetail: string;
  lastRun: string;
  lastDuration: number;
  rowsLastRun: number;
  recentRuns: PipelineRun[];
  phases?: { name: string; status: RunStatus; detail?: string }[];
  schemaChange?: { type: string; detail: string } | null;
}

export interface TimelineEvent {
  status: RunStatus;
  label: string;
  detail?: string;
}
