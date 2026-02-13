const treeData = {
  name: "ConversationThread",
  description: "Orchestrates the full conversation flow",
  children: [
    {
      name: "ExchangeCell",
      description: "One question → answer pair",
      children: [
        {
          name: "QuestionInput",
          description: "User's natural language question + suggestion chips",
          children: [],
        },
        {
          name: "ThinkingIndicator",
          description: "Loading state while generating answer",
          children: [],
        },
        {
          name: "BarChart",
          description: 'Result type: "bar-chart" — horizontal bars with labels and values',
          children: [],
        },
        {
          name: "ResultTable",
          description: 'Result type: "table" — tabular data with headers',
          children: [],
        },
        {
          name: "StatCard",
          description: 'Result type: "stat" — single number with label',
          children: [],
        },
        {
          name: "SqlBlock",
          description: "Collapsible SQL query that produced the result",
          children: [],
        },
      ],
    },
    {
      name: "DatasetContext",
      description: "Dataset metadata and accessed fields sidebar",
      children: [],
    },
  ],
};

function TreeNode({
  name,
  description,
  children,
  depth,
}: {
  name: string;
  description: string;
  children: typeof treeData.children;
  depth: number;
}) {
  const isRoot = depth === 0;
  const isLeaf = children.length === 0;

  return (
    <div style={{ marginLeft: depth > 0 ? 24 : 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          padding: "6px 0",
          borderLeft: depth > 0 ? "2px solid oklch(0.922 0 0)" : "none",
          paddingLeft: depth > 0 ? 12 : 0,
        }}
      >
        <code
          style={{
            fontSize: 13,
            fontWeight: isRoot ? 600 : isLeaf ? 400 : 500,
            color: isRoot ? "oklch(0.205 0.015 60)" : "oklch(0.4 0 0)",
            whiteSpace: "nowrap",
          }}
        >
          {isLeaf ? "└ " : ""}{name}
        </code>
        <span style={{ fontSize: 12, color: "#888" }}>{description}</span>
      </div>
      {children.map((child) => (
        <TreeNode
          key={child.name}
          name={child.name}
          description={child.description}
          children={child.children}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export function CompositionDiagram() {
  return (
    <div style={{ marginTop: 16, fontFamily: "var(--font-mono, monospace)" }}>
      <TreeNode
        name={treeData.name}
        description={treeData.description}
        children={treeData.children}
        depth={0}
      />
    </div>
  );
}

const exchangeStates = [
  { state: "Thinking", description: "User asked a question, waiting for AI response", visual: "Pulsing dots animation" },
  { state: "Answer only", description: "Text response without a data result", visual: "Text paragraph" },
  { state: "Answer + bar chart", description: "Text response with a horizontal bar visualization", visual: "Text + colored bars" },
  { state: "Answer + table", description: "Text response with tabular data", visual: "Text + data grid" },
  { state: "Answer + stat", description: "Text response with a single highlighted number", visual: "Text + large number" },
  { state: "Answer + SQL", description: "Any of the above with a collapsible SQL block", visual: "+ expandable code block" },
];

export function ExchangeStates() {
  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "140px 1fr 1fr",
          gap: 16,
          padding: "8px 0",
          borderBottom: "2px solid oklch(0.922 0 0)",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase" as const,
          letterSpacing: "0.05em",
          color: "#888",
        }}
      >
        <span>State</span>
        <span>When</span>
        <span>What renders</span>
      </div>
      {exchangeStates.map((s) => (
        <div
          key={s.state}
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr 1fr",
            gap: 16,
            padding: "10px 0",
            borderBottom: "1px solid oklch(0.922 0 0)",
            alignItems: "baseline",
          }}
        >
          <code style={{ fontSize: 13, fontWeight: 500 }}>{s.state}</code>
          <span style={{ fontSize: 12, color: "#888" }}>{s.description}</span>
          <span style={{ fontSize: 12, color: "#666" }}>{s.visual}</span>
        </div>
      ))}
    </div>
  );
}
