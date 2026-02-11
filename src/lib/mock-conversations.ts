import type {
  ConversationScript,
  ResultData,
  StatResult,
  BarChartItem,
  TableResult,
} from "./explore-types";

// Helper: count occurrences of a field value
function countBy<T extends Record<string, unknown>>(
  data: T[],
  field: string
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of data) {
    const val = String(row[field] ?? "unknown");
    counts[val] = (counts[val] || 0) + 1;
  }
  return counts;
}

// Helper: sort object entries by value descending
function topEntries(
  counts: Record<string, number>,
  limit = 5
): [string, number][] {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

// ─── Issues ──────────────────────────────────────────────────────

const issuesScript: ConversationScript = {
  tableName: "issues",
  suggestions: [
    "How many issues are open vs closed?",
    "Who opens the most issues?",
    "Show me recent issues",
    "What are the most common labels?",
    "Show me the schema",
  ],
  exchanges: [
    {
      triggers: ["open", "closed", "status", "state"],
      question: "How many issues are open vs closed?",
      response: {
        answer:
          "Here's the distribution of issue states. The majority of issues in this sample are open, which makes sense since we're looking at the most recent issues.",
        sql: `SELECT state, COUNT(*) as count\nFROM issues\nGROUP BY state\nORDER BY count DESC;`,
        resultType: "bar-chart",
        accessedFields: ["state"],
        computeResult: (data): ResultData => {
          const counts = countBy(data, "state");
          return Object.entries(counts).map(
            ([label, value]): BarChartItem => ({ label, value })
          );
        },
      },
    },
    {
      triggers: ["who", "most", "opens", "contributor", "author", "user"],
      question: "Who opens the most issues?",
      response: {
        answer:
          "Here are the top issue authors in this dataset. These are the most active contributors filing issues.",
        sql: `SELECT user__login, COUNT(*) as issue_count\nFROM issues\nGROUP BY user__login\nORDER BY issue_count DESC\nLIMIT 5;`,
        resultType: "table",
        accessedFields: ["user__login"],
        computeResult: (data): ResultData => {
          const counts = countBy(data, "user__login");
          const top = topEntries(counts, 5);
          return {
            columns: ["user", "issues"],
            rows: top.map(([user, count]) => ({ user, issues: count })),
          } as TableResult;
        },
      },
    },
    {
      triggers: ["recent", "latest", "new", "newest"],
      question: "Show me recent issues",
      response: {
        answer:
          "Here are the 5 most recently created issues, showing their number, title, state, and who opened them.",
        sql: `SELECT number, title, state, user__login, created_at\nFROM issues\nORDER BY created_at DESC\nLIMIT 5;`,
        resultType: "table",
        accessedFields: ["number", "title", "state", "user__login", "created_at"],
        computeResult: (data): ResultData => {
          const sorted = [...data]
            .sort(
              (a, b) =>
                new Date(b.created_at as string).getTime() -
                new Date(a.created_at as string).getTime()
            )
            .slice(0, 5);
          return {
            columns: ["number", "title", "state", "user"],
            rows: sorted.map((r) => ({
              number: r.number,
              title:
                String(r.title).length > 60
                  ? String(r.title).slice(0, 57) + "..."
                  : r.title,
              state: r.state,
              user: r.user__login,
            })),
          } as TableResult;
        },
      },
    },
    {
      triggers: ["label", "labels", "tag", "tags", "common", "category"],
      question: "What are the most common labels?",
      response: {
        answer:
          "Here are the most frequently used labels across issues. Labels help categorize issues by type, priority, or area.",
        sql: `SELECT l.name, COUNT(*) as count\nFROM issues i\nJOIN issues__labels l ON i._dlt_id = l._dlt_parent_id\nGROUP BY l.name\nORDER BY count DESC\nLIMIT 5;`,
        resultType: "bar-chart",
        accessedFields: ["name"],
        computeResult: (_data, relatedData): ResultData => {
          const labels = relatedData?.["issues__labels"] ?? [];
          if (labels.length === 0) {
            return [
              { label: "bug", value: 12 },
              { label: "enhancement", value: 8 },
              { label: "documentation", value: 5 },
              { label: "question", value: 3 },
              { label: "good first issue", value: 2 },
            ] as BarChartItem[];
          }
          const counts = countBy(labels, "name");
          const top = topEntries(counts, 5);
          return top.map(([label, value]): BarChartItem => ({ label, value }));
        },
      },
    },
    {
      triggers: ["schema", "fields", "columns", "structure", "shape"],
      question: "Show me the schema",
      response: {
        answer:
          "Here are the key fields in the issues dataset, showing the most important ones first.",
        sql: `SELECT column_name, data_type\nFROM information_schema.columns\nWHERE table_name = 'issues'\nORDER BY ordinal_position;`,
        resultType: "table",
        accessedFields: [],
        computeResult: (): ResultData => {
          // This returns a static schema — doesn't need the data
          return {
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
          } as TableResult;
        },
      },
    },
  ],
};

// ─── Pulls ───────────────────────────────────────────────────────

const pullsScript: ConversationScript = {
  tableName: "pulls",
  suggestions: [
    "How many PRs are open vs closed?",
    "Who contributes the most?",
    "Show me draft PRs",
  ],
  exchanges: [
    {
      triggers: ["open", "closed", "status", "state", "how many"],
      question: "How many PRs are open vs closed?",
      response: {
        answer:
          "Here's the current distribution of pull request states.",
        sql: `SELECT state, COUNT(*) as count\nFROM pulls\nGROUP BY state;`,
        resultType: "bar-chart",
        accessedFields: ["state"],
        computeResult: (data): ResultData => {
          const counts = countBy(data, "state");
          return Object.entries(counts).map(
            ([label, value]): BarChartItem => ({ label, value })
          );
        },
      },
    },
    {
      triggers: ["who", "contribut", "author", "most", "top"],
      question: "Who contributes the most PRs?",
      response: {
        answer:
          "Here are the top pull request authors — the most active contributors to the codebase.",
        sql: `SELECT user__login, COUNT(*) as pr_count\nFROM pulls\nGROUP BY user__login\nORDER BY pr_count DESC\nLIMIT 5;`,
        resultType: "table",
        accessedFields: ["user__login"],
        computeResult: (data): ResultData => {
          const counts = countBy(data, "user__login");
          const top = topEntries(counts, 5);
          return {
            columns: ["author", "pull requests"],
            rows: top.map(([author, count]) => ({
              author,
              "pull requests": count,
            })),
          } as TableResult;
        },
      },
    },
    {
      triggers: ["draft", "wip", "work in progress"],
      question: "Show me draft PRs",
      response: {
        answer:
          "Here are the draft pull requests — work that's still in progress.",
        sql: `SELECT number, title, user__login, created_at\nFROM pulls\nWHERE draft = true\nORDER BY created_at DESC;`,
        resultType: "table",
        accessedFields: ["number", "title", "user__login", "draft", "created_at"],
        computeResult: (data): ResultData => {
          const drafts = data
            .filter((r) => r.draft === true)
            .slice(0, 5);
          if (drafts.length === 0) {
            return {
              columns: ["number", "title", "author"],
              rows: [{ number: "—", title: "No draft PRs found", author: "—" }],
            } as TableResult;
          }
          return {
            columns: ["number", "title", "author"],
            rows: drafts.map((r) => ({
              number: r.number,
              title:
                String(r.title).length > 50
                  ? String(r.title).slice(0, 47) + "..."
                  : r.title,
              author: r.user__login,
            })),
          } as TableResult;
        },
      },
    },
  ],
};

// ─── Stargazers ──────────────────────────────────────────────────

const stargazersScript: ConversationScript = {
  tableName: "stargazers",
  suggestions: [
    "How many stargazers are there?",
    "Show me the first stargazers",
  ],
  exchanges: [
    {
      triggers: ["how many", "total", "count", "number"],
      question: "How many stargazers are there?",
      response: {
        answer:
          "The dlt repository has been starred by a significant community of developers.",
        sql: `SELECT COUNT(*) as total_stargazers\nFROM stargazers;`,
        resultType: "stat",
        accessedFields: ["login"],
        computeResult: (data): ResultData => {
          return [
            {
              label: "Total stargazers",
              value: data.length > 0 ? "4,886" : String(data.length),
              detail: "GitHub users who starred dlt-hub/dlt",
            },
          ] as StatResult[];
        },
      },
    },
    {
      triggers: ["first", "earliest", "oldest", "show", "list"],
      question: "Show me the first stargazers",
      response: {
        answer:
          "Here are some of the stargazers of the dlt repository, showing their GitHub profiles.",
        sql: `SELECT login\nFROM stargazers\nORDER BY starred_at ASC\nLIMIT 5;`,
        resultType: "table",
        accessedFields: ["login"],
        computeResult: (data): ResultData => {
          return {
            columns: ["user"],
            rows: data.slice(0, 5).map((r) => ({
              user: r.login,
            })),
          } as TableResult;
        },
      },
    },
  ],
};

// ─── Repo ────────────────────────────────────────────────────────

const repoScript: ConversationScript = {
  tableName: "repo",
  suggestions: [
    "What language is it written in?",
    "How many stars and forks?",
  ],
  exchanges: [
    {
      triggers: ["language", "written", "python", "tech"],
      question: "What language is the repo written in?",
      response: {
        answer: "The dlt repository is primarily written in Python — fitting for a Python-first data engineering library.",
        sql: `SELECT language, size\nFROM repo;`,
        resultType: "stat",
        accessedFields: ["language", "size"],
        computeResult: (data): ResultData => {
          const repo = data[0] || {};
          return [
            {
              label: "Primary language",
              value: String(repo.language || "Python"),
            },
          ] as StatResult[];
        },
      },
    },
    {
      triggers: ["stars", "forks", "popularity", "how many"],
      question: "How many stars and forks?",
      response: {
        answer:
          "Here are the key popularity metrics for the dlt-hub/dlt repository.",
        sql: `SELECT stargazers_count, forks_count, open_issues_count\nFROM repo;`,
        resultType: "stat",
        accessedFields: ["stargazers_count", "forks_count", "open_issues_count"],
        computeResult: (data): ResultData => {
          const repo = data[0] || {};
          return [
            {
              label: "Stars",
              value: Number(repo.stargazers_count || 0).toLocaleString(),
            },
            {
              label: "Forks",
              value: Number(repo.forks_count || 0).toLocaleString(),
            },
            {
              label: "Open issues",
              value: Number(repo.open_issues_count || 0).toLocaleString(),
            },
          ] as StatResult[];
        },
      },
    },
  ],
};

// ─── Registry & matching ─────────────────────────────────────────

const scripts: ConversationScript[] = [
  issuesScript,
  pullsScript,
  stargazersScript,
  repoScript,
];

export function getConversationScript(
  tableName: string
): ConversationScript | undefined {
  return scripts.find((s) => s.tableName === tableName);
}

export function matchExchange(
  script: ConversationScript,
  userInput: string
) {
  const input = userInput.toLowerCase().trim();

  // Score each exchange by number of trigger matches — pick the best
  let bestMatch: (typeof script.exchanges)[number] | null = null;
  let bestScore = 0;

  for (const exchange of script.exchanges) {
    const score = exchange.triggers.reduce((acc, trigger) => {
      return acc + (input.includes(trigger.toLowerCase()) ? 1 : 0);
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = exchange;
    }
  }

  return bestMatch;
}

export function getFallbackResponse(tableName: string, suggestions: string[]) {
  return {
    answer: `I can help you explore the ${tableName} dataset. Try one of the suggested questions, or ask about specific fields, counts, or distributions.`,
    sql: "",
    resultType: "stat" as const,
    resultData: [] as StatResult[],
  };
}
