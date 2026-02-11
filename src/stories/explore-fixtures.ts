/**
 * Shared fixture data for explore component stories.
 *
 * Single source of truth: mock-conversations.ts defines the conversation
 * scripts (question text, answer text, SQL, result types). This file
 * re-exports those values and provides pre-computed resultData for
 * Storybook, where runtime data loading isn't available.
 *
 * When you change answer text or suggestions in mock-conversations.ts,
 * update the matching resultData here.
 */

import { getConversationScript } from "@/lib/mock-conversations";
import type {
  Exchange,
  ExchangeResponse,
  BarChartItem,
  StatResult,
  TableResult,
} from "@/lib/explore-types";
import type { CatalogTable } from "@/lib/types";

// ─── Scripts (from mock-conversations.ts) ────────────────────────

const issuesScript = getConversationScript("issues")!;
const pullsScript = getConversationScript("pulls")!;
const stargazersScript = getConversationScript("stargazers")!;
const repoScript = getConversationScript("repo")!;

// ─── Suggestions ─────────────────────────────────────────────────

export const issuesSuggestions = issuesScript.suggestions;
export const pullsSuggestions = pullsScript.suggestions;
export const stargazersSuggestions = stargazersScript.suggestions;
export const repoSuggestions = repoScript.suggestions;

// ─── Pre-computed result data ────────────────────────────────────
// These match what computeResult() returns with real JSON data.
// Update these when the underlying data changes.

export const issueStateBarChart: BarChartItem[] = [
  { label: "open", value: 31 },
  { label: "closed", value: 19 },
];

export const issueTopAuthorsTable: TableResult = {
  columns: ["user", "issues"],
  rows: [
    { user: "rudolfix", issues: 8 },
    { user: "zilto", issues: 5 },
    { user: "burnash", issues: 4 },
    { user: "d3vzer0", issues: 3 },
    { user: "anuunchin", issues: 3 },
  ],
};

export const issueRecentTable: TableResult = {
  columns: ["number", "title", "state", "user"],
  rows: [
    { number: 3537, title: "Fix schema contract checks for Pydantic models", state: "open", user: "anuunchin" },
    { number: 3534, title: "Add support for Delta table partitions", state: "closed", user: "rudolfix" },
    { number: 3530, title: "Update documentation for transformations API", state: "open", user: "zilto" },
  ],
};

export const issueLabelsBarChart: BarChartItem[] = [
  { label: "bug", value: 12 },
  { label: "enhancement", value: 8 },
  { label: "documentation", value: 5 },
  { label: "question", value: 3 },
  { label: "good first issue", value: 2 },
];

export const issueSchemaTable: TableResult = {
  columns: ["field", "type"],
  rows: [
    { field: "number", type: "number" },
    { field: "title", type: "text" },
    { field: "state", type: "text" },
    { field: "user__login", type: "text" },
    { field: "body", type: "text" },
    { field: "created_at", type: "date" },
    { field: "updated_at", type: "date" },
    { field: "closed_at", type: "date" },
    { field: "id", type: "number" },
  ],
};

export const stargazerCountStat: StatResult[] = [
  {
    label: "Total stargazers",
    value: "4,886",
    detail: "GitHub users who starred dlt-hub/dlt",
  },
];

export const repoPopularityStat: StatResult[] = [
  { label: "Stars", value: "4,886" },
  { label: "Forks", value: "449" },
  { label: "Open issues", value: "412" },
];

export const repoLanguageStat: StatResult[] = [
  { label: "Primary language", value: "Python" },
];

// ─── Exchange builders ───────────────────────────────────────────
// Build Exchange objects using script data + pre-computed results.

function buildExchange(
  scriptTableName: string,
  exchangeIndex: number,
  resultData: BarChartItem[] | StatResult[] | TableResult,
): Exchange {
  const script = getConversationScript(scriptTableName)!;
  const mock = script.exchanges[exchangeIndex];

  return {
    id: `fixture-${scriptTableName}-${exchangeIndex}`,
    question: mock.question,
    timestamp: Date.now(),
    response: {
      answer: mock.response.answer,
      sql: mock.response.sql,
      resultType: mock.response.resultType,
      resultData,
    },
  };
}

// ─── Complete exchange fixtures ──────────────────────────────────
// Ready-to-use Exchange objects for ExchangeCell stories.

export const issueStateExchange = buildExchange("issues", 0, issueStateBarChart);
export const issueAuthorsExchange = buildExchange("issues", 1, issueTopAuthorsTable);
export const issueRecentExchange = buildExchange("issues", 2, issueRecentTable);
export const issueLabelsExchange = buildExchange("issues", 3, issueLabelsBarChart);
export const issueSchemaExchange = buildExchange("issues", 4, issueSchemaTable);
export const stargazerCountExchange = buildExchange("stargazers", 0, stargazerCountStat);

export const thinkingExchange: Exchange = {
  id: "fixture-thinking",
  question: issuesScript.exchanges[3].question,
  timestamp: Date.now(),
  response: null,
};

// ─── Table metadata fixtures ─────────────────────────────────────
// For DatasetContext stories.

export const issuesTableMeta: CatalogTable = {
  table_name: "issues",
  columns: Array.from({ length: 183 }, (_, i) => ({
    name: `field_${i}`,
    type: "VARCHAR",
  })),
  row_count: 3576,
};

export const issuesKeyFields = [
  "number",
  "title",
  "state",
  "user__login",
  "created_at",
  "body",
  "updated_at",
  "closed_at",
];

export const issuesDescription =
  "Titles, states, assignees, labels and events for 3,576 issues";
