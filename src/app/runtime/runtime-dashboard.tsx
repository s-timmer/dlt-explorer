"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { AppNav } from "@/components/app-nav";
import { PipelineCard } from "@/components/runtime/pipeline-card";
import type { Pipeline, RunStatus } from "@/components/runtime/types";

/* ── Mock data ────────────────────────────────────────────────── */

const pipelines: Pipeline[] = [
  {
    name: "github_dlt_repo",
    source: "GitHub API",
    destination: "BigQuery",
    schedule: "Every 6 hours",
    status: "success",
    statusDetail: "All tables loaded",
    lastRun: "2 hours ago",
    lastDuration: 47,
    rowsLastRun: 12_840,
    recentRuns: [
      { timestamp: "06:00", duration: 45, rowsLoaded: 12_200, status: "success" },
      { timestamp: "00:00", duration: 48, rowsLoaded: 12_100, status: "success" },
      { timestamp: "18:00", duration: 44, rowsLoaded: 11_950, status: "success" },
      { timestamp: "12:00", duration: 46, rowsLoaded: 12_300, status: "success" },
      { timestamp: "06:00", duration: 43, rowsLoaded: 12_150, status: "success" },
      { timestamp: "00:00", duration: 51, rowsLoaded: 12_080, status: "success" },
      { timestamp: "18:00", duration: 47, rowsLoaded: 11_900, status: "success" },
    ],
    schemaChange: null,
  },
  {
    name: "stripe_payments",
    source: "Stripe API",
    destination: "Snowflake",
    schedule: "Daily at 02:00",
    status: "failed",
    statusDetail: "Load phase failed — destination timeout",
    lastRun: "6 hours ago",
    lastDuration: 312,
    rowsLastRun: 0,
    recentRuns: [
      { timestamp: "02:00", duration: 312, rowsLoaded: 0, status: "failed" },
      { timestamp: "02:00", duration: 89, rowsLoaded: 45_200, status: "success" },
      { timestamp: "02:00", duration: 92, rowsLoaded: 44_800, status: "success" },
      { timestamp: "02:00", duration: 85, rowsLoaded: 43_100, status: "success" },
      { timestamp: "02:00", duration: 88, rowsLoaded: 44_500, status: "success" },
      { timestamp: "02:00", duration: 310, rowsLoaded: 0, status: "failed" },
      { timestamp: "02:00", duration: 91, rowsLoaded: 42_900, status: "success" },
    ],
    phases: [
      { name: "Extract", status: "success", detail: "45,200 rows from 3 endpoints" },
      { name: "Normalize", status: "success", detail: "Schema validated, 8 tables" },
      { name: "Load", status: "failed", detail: "Snowflake connection timeout after 240s" },
    ],
    schemaChange: null,
  },
  {
    name: "slack_messages",
    source: "Slack API",
    destination: "DuckDB",
    schedule: "Every hour",
    status: "success",
    statusDetail: "All tables loaded",
    lastRun: "3 hours ago",
    lastDuration: 23,
    rowsLastRun: 1_840,
    recentRuns: [
      { timestamp: "05:00", duration: 23, rowsLoaded: 1_840, status: "success" },
      { timestamp: "04:00", duration: 21, rowsLoaded: 1_620, status: "success" },
      { timestamp: "03:00", duration: 19, rowsLoaded: 890, status: "success" },
      { timestamp: "02:00", duration: 18, rowsLoaded: 340, status: "success" },
      { timestamp: "01:00", duration: 17, rowsLoaded: 120, status: "success" },
      { timestamp: "00:00", duration: 20, rowsLoaded: 980, status: "success" },
      { timestamp: "23:00", duration: 22, rowsLoaded: 1_540, status: "success" },
    ],
    schemaChange: null,
  },
  {
    name: "salesforce_crm",
    source: "Salesforce API",
    destination: "BigQuery",
    schedule: "Daily at 06:00",
    status: "warning",
    statusDetail: "Loaded with schema changes",
    lastRun: "3 hours ago",
    lastDuration: 156,
    rowsLastRun: 28_400,
    recentRuns: [
      { timestamp: "06:00", duration: 156, rowsLoaded: 28_400, status: "warning" },
      { timestamp: "06:00", duration: 148, rowsLoaded: 27_900, status: "success" },
      { timestamp: "06:00", duration: 152, rowsLoaded: 28_100, status: "success" },
      { timestamp: "06:00", duration: 145, rowsLoaded: 27_500, status: "success" },
      { timestamp: "06:00", duration: 149, rowsLoaded: 27_800, status: "success" },
      { timestamp: "06:00", duration: 151, rowsLoaded: 28_200, status: "success" },
      { timestamp: "06:00", duration: 147, rowsLoaded: 27_600, status: "success" },
    ],
    schemaChange: { type: "New columns", detail: "contacts: +2 columns (lead_score, last_activity_date)" },
  },
  {
    name: "google_analytics",
    source: "GA4 API",
    destination: "Postgres",
    schedule: "Daily at 04:00",
    status: "running",
    statusDetail: "Extract in progress",
    lastRun: "Running now",
    lastDuration: 0,
    rowsLastRun: 0,
    recentRuns: [
      { timestamp: "04:00", duration: 0, rowsLoaded: 0, status: "running" },
      { timestamp: "04:00", duration: 234, rowsLoaded: 182_000, status: "success" },
      { timestamp: "04:00", duration: 198, rowsLoaded: 176_000, status: "success" },
      { timestamp: "04:00", duration: 201, rowsLoaded: 179_000, status: "success" },
      { timestamp: "04:00", duration: 195, rowsLoaded: 171_000, status: "success" },
      { timestamp: "04:00", duration: 189, rowsLoaded: 168_000, status: "success" },
      { timestamp: "04:00", duration: 185, rowsLoaded: 165_000, status: "success" },
    ],
    phases: [
      { name: "Extract", status: "running", detail: "Fetching page views and events..." },
    ],
    schemaChange: null,
  },
];

/* ── Dashboard ────────────────────────────────────────────────── */

type FilterType = "all" | RunStatus;

export function RuntimeDashboard() {
  const [filter, setFilter] = useState<FilterType>("all");

  const failedCount = pipelines.filter((p) => p.status === "failed").length;
  const warningCount = pipelines.filter((p) => p.status === "warning").length;
  const runningCount = pipelines.filter((p) => p.status === "running").length;
  const healthyCount = pipelines.filter((p) => p.status === "success").length;

  const sortOrder: Record<RunStatus, number> = { failed: 0, warning: 1, running: 2, success: 3 };
  const sorted = [...pipelines]
    .sort((a, b) => sortOrder[a.status] - sortOrder[b.status])
    .filter((p) => filter === "all" || p.status === filter);

  return (
    <div className="min-h-screen bg-background flex">
      <AppNav />

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 w-full flex-1 sm:pl-14">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Runtime
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pipeline health and monitoring
          </p>
        </div>

        {/* Filter strip — scrollable on mobile */}
        <div className="relative mb-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFilter("all")}
            className={`whitespace-nowrap flex-shrink-0 px-3 py-1 rounded-full text-xs transition-colors ${
              filter === "all"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:ring-1 hover:ring-border"
            }`}
          >
            All {pipelines.length}
          </button>
          {failedCount > 0 && (
            <button
              onClick={() => setFilter(filter === "failed" ? "all" : "failed")}
              className={`whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors ${
                filter === "failed"
                  ? "bg-red-500 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:ring-1 hover:ring-border"
              }`}
            >
              <XCircle className="h-3 w-3" />
              {failedCount} failed
            </button>
          )}
          {warningCount > 0 && (
            <button
              onClick={() => setFilter(filter === "warning" ? "all" : "warning")}
              className={`whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors ${
                filter === "warning"
                  ? "bg-amber-500 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:ring-1 hover:ring-border"
              }`}
            >
              <AlertTriangle className="h-3 w-3" />
              {warningCount} warning
            </button>
          )}
          {runningCount > 0 && (
            <button
              onClick={() => setFilter(filter === "running" ? "all" : "running")}
              className={`whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors ${
                filter === "running"
                  ? "bg-blue-500 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:ring-1 hover:ring-border"
              }`}
            >
              <Loader2 className="h-3 w-3" />
              {runningCount} running
            </button>
          )}
          <button
            onClick={() => setFilter(filter === "success" ? "all" : "success")}
            className={`whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors ${
              filter === "success"
                ? "bg-emerald-500 text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:ring-1 hover:ring-border"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            {healthyCount} healthy
          </button>
          </div>
          <div className="sm:hidden absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        {/* Pipeline cards */}
        <div className="space-y-4">
          {sorted.map((pipeline) => (
            <PipelineCard key={pipeline.name} pipeline={pipeline} />
          ))}
        </div>
      </div>
    </div>
  );
}
