/**
 * Shared fixture data for runtime component stories.
 */

import type { Pipeline, TimelineEvent } from "@/components/runtime/types";

// ─── Timeline events ─────────────────────────────────────────────

export const failedPipelineEvents: TimelineEvent[] = [
  { status: "success", label: "Extract", detail: "45,200 rows from 3 endpoints" },
  { status: "success", label: "Normalize", detail: "Schema validated, 8 tables" },
  { status: "failed", label: "Load", detail: "Snowflake connection timeout after 240s" },
];

export const schemaChangeEvent: TimelineEvent[] = [
  { status: "warning", label: "New columns", detail: "contacts: +2 columns (lead_score, last_activity_date)" },
];

export const allSuccessEvents: TimelineEvent[] = [
  { status: "success", label: "Extract", detail: "12,840 rows from 2 endpoints" },
  { status: "success", label: "Normalize", detail: "Schema validated, 4 tables" },
  { status: "success", label: "Load", detail: "All tables written to BigQuery" },
];

export const singleEvent: TimelineEvent[] = [
  { status: "failed", label: "Extract", detail: "API rate limit exceeded (429)" },
];

// ─── Pipeline fixtures ───────────────────────────────────────────

export const healthyPipeline: Pipeline = {
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
};

export const failedPipeline: Pipeline = {
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
};

export const warningPipeline: Pipeline = {
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
};

export const runningPipeline: Pipeline = {
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
};

export const stalePipeline: Pipeline = {
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
};
