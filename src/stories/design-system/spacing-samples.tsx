const radiusRows = [
  { token: "radius-sm", formula: "--radius - 4px", computed: "6px", px: 6 },
  { token: "radius-md", formula: "--radius - 2px", computed: "8px", px: 8 },
  { token: "radius-lg", formula: "--radius", computed: "10px", px: 10 },
  { token: "radius-xl", formula: "--radius + 4px", computed: "14px", px: 14 },
  { token: "radius-2xl", formula: "--radius + 8px", computed: "18px", px: 18 },
  { token: "radius-3xl", formula: "--radius + 12px", computed: "22px", px: 22 },
];

export function RadiusScale() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: 16,
        borderRadius: 12,
        border: "1px solid oklch(0.922 0 0)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "120px 140px 80px 1fr",
          padding: "8px 16px",
          background: "oklch(0.97 0 0)",
          fontSize: 11,
          color: "#888",
          fontFamily: "monospace",
          borderBottom: "1px solid oklch(0.922 0 0)",
        }}
      >
        <span>Token</span>
        <span>Value</span>
        <span>Computed</span>
        <span>Preview</span>
      </div>
      {radiusRows.map((row, i) => (
        <div
          key={row.token}
          style={{
            display: "grid",
            gridTemplateColumns: "120px 140px 80px 1fr",
            padding: "12px 16px",
            alignItems: "center",
            borderBottom: i < radiusRows.length - 1 ? "1px solid oklch(0.922 0 0)" : "none",
          }}
        >
          <code style={{ fontSize: 12 }}>{row.token}</code>
          <span style={{ fontSize: 12, color: "#888" }}>{row.formula}</span>
          <span style={{ fontSize: 12, color: "#888" }}>{row.computed}</span>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: row.px,
              border: "2px solid oklch(0.205 0 0)",
              background: "oklch(0.97 0 0)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function RadiusUsage() {
  const rows = [
    ["Exchange cards", "rounded-xl", "radius-xl (14px)"],
    ["SQL code blocks", "rounded-lg", "radius-lg (10px)"],
    ["Buttons, inputs", "rounded-md", "radius-md (8px)"],
    ["Bar chart bars", "rounded-sm", "radius-sm (6px)"],
    ["User avatars", "rounded-full", "50%"],
    ["Suggestion chips", "rounded-full", "50%"],
  ];

  return (
    <div
      style={{
        marginTop: 16,
        borderRadius: 12,
        border: "1px solid oklch(0.922 0 0)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          padding: "8px 16px",
          background: "oklch(0.97 0 0)",
          fontSize: 11,
          color: "#888",
          fontFamily: "monospace",
          borderBottom: "1px solid oklch(0.922 0 0)",
        }}
      >
        <span>Component</span>
        <span>Class</span>
        <span>Token</span>
      </div>
      {rows.map(([component, cls, token], i) => (
        <div
          key={component}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            padding: "10px 16px",
            fontSize: 13,
            borderBottom: i < rows.length - 1 ? "1px solid oklch(0.922 0 0)" : "none",
          }}
        >
          <span>{component}</span>
          <code style={{ fontSize: 12 }}>{cls}</code>
          <span style={{ color: "#888" }}>{token}</span>
        </div>
      ))}
    </div>
  );
}

const spacingTokenRows = [
  { token: "gap-chip / p-chip", cssVar: "--spacing-chip", value: "6px", description: "Chips, badges, small inline items" },
  { token: "gap-tight / p-tight", cssVar: "--spacing-tight", value: "10px", description: "Closely related items (bar rows, input + suggestions)" },
  { token: "gap-element / p-element", cssVar: "--spacing-element", value: "12px", description: "Elements within a card (answer + chart + SQL)" },
  { token: "gap-card / p-card", cssVar: "--spacing-card", value: "16px", description: "Card internal padding, vertical rhythm" },
  { token: "gap-section / p-section", cssVar: "--spacing-section", value: "24px", description: "Between exchange cards in conversation" },
];

export function SpacingTokens() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: 16,
        borderRadius: 12,
        border: "1px solid oklch(0.922 0 0)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 140px 60px 1fr",
          padding: "8px 16px",
          background: "oklch(0.97 0 0)",
          fontSize: 11,
          color: "#888",
          fontFamily: "monospace",
          borderBottom: "1px solid oklch(0.922 0 0)",
        }}
      >
        <span>Tailwind class</span>
        <span>CSS variable</span>
        <span>Value</span>
        <span>Used for</span>
      </div>
      {spacingTokenRows.map((row, i) => (
        <div
          key={row.token}
          style={{
            display: "grid",
            gridTemplateColumns: "180px 140px 60px 1fr",
            padding: "12px 16px",
            alignItems: "center",
            borderBottom: i < spacingTokenRows.length - 1 ? "1px solid oklch(0.922 0 0)" : "none",
          }}
        >
          <code style={{ fontSize: 12 }}>{row.token}</code>
          <code style={{ fontSize: 11, color: "#888" }}>{row.cssVar}</code>
          <span style={{ fontSize: 12, color: "#888" }}>{row.value}</span>
          <span style={{ fontSize: 12 }}>{row.description}</span>
        </div>
      ))}
    </div>
  );
}

export function SpacingPatterns() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: 16,
        borderRadius: 12,
        border: "1px solid oklch(0.922 0 0)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100px 60px 1fr 120px",
          padding: "8px 16px",
          background: "oklch(0.97 0 0)",
          fontSize: 11,
          color: "#888",
          fontFamily: "monospace",
          borderBottom: "1px solid oklch(0.922 0 0)",
        }}
      >
        <span>Token</span>
        <span>Value</span>
        <span>Pattern</span>
        <span>Preview</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100px 60px 1fr 120px",
          padding: "12px 16px",
          alignItems: "center",
          borderBottom: "1px solid oklch(0.922 0 0)",
        }}
      >
        <code style={{ fontSize: 12 }}>gap-chip</code>
        <span style={{ fontSize: 12, color: "#888" }}>6px</span>
        <span style={{ fontSize: 12 }}>SQL trigger icon + label</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 12, height: 12, background: "oklch(0.922 0 0)", borderRadius: 2 }} />
          <div style={{ width: 12, height: 12, background: "oklch(0.922 0 0)", borderRadius: 2 }} />
          <span style={{ fontSize: 10, color: "#888" }}>SQL</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100px 60px 1fr 120px",
          padding: "12px 16px",
          alignItems: "center",
          borderBottom: "1px solid oklch(0.922 0 0)",
        }}
      >
        <code style={{ fontSize: 12 }}>gap-tight</code>
        <span style={{ fontSize: 12, color: "#888" }}>10px</span>
        <span style={{ fontSize: 12 }}>Bar chart rows, input area</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ height: 4, width: 60, background: "oklch(0.646 0.222 41.116)", borderRadius: 2 }} />
          <div style={{ height: 4, width: 40, background: "oklch(0.6 0.118 184.704)", borderRadius: 2 }} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100px 60px 1fr 120px",
          padding: "12px 16px",
          alignItems: "center",
          borderBottom: "1px solid oklch(0.922 0 0)",
        }}
      >
        <code style={{ fontSize: 12 }}>gap-element</code>
        <span style={{ fontSize: 12, color: "#888" }}>12px</span>
        <span style={{ fontSize: 12 }}>Within exchange cells</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ height: 6, width: 80, background: "oklch(0.922 0 0)", borderRadius: 3 }} />
          <div style={{ height: 6, width: 60, background: "oklch(0.922 0 0)", borderRadius: 3 }} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100px 60px 1fr 120px",
          padding: "12px 16px",
          alignItems: "center",
          borderBottom: "1px solid oklch(0.922 0 0)",
        }}
      >
        <code style={{ fontSize: 12 }}>p-card</code>
        <span style={{ fontSize: 12, color: "#888" }}>16px</span>
        <span style={{ fontSize: 12 }}>Card internal padding</span>
        <div
          style={{
            padding: 16,
            border: "1px solid oklch(0.922 0 0)",
            borderRadius: 8,
            fontSize: 11,
            color: "#888",
          }}
        >
          p-card
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100px 60px 1fr 120px",
          padding: "12px 16px",
          alignItems: "center",
        }}
      >
        <code style={{ fontSize: 12 }}>gap-section</code>
        <span style={{ fontSize: 12, color: "#888" }}>24px</span>
        <span style={{ fontSize: 12 }}>Between exchange cards</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              height: 12,
              background: "oklch(0.97 0 0)",
              border: "1px solid oklch(0.922 0 0)",
              borderRadius: 6,
            }}
          />
          <div
            style={{
              height: 12,
              background: "oklch(0.97 0 0)",
              border: "1px solid oklch(0.922 0 0)",
              borderRadius: 6,
            }}
          />
        </div>
      </div>
    </div>
  );
}
