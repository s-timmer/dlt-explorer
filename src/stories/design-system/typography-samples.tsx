export function FontFamilies() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 16 }}>
      <div style={{ padding: 24, borderRadius: 12, border: "1px solid oklch(0.922 0 0)" }}>
        <p style={{ fontSize: 11, color: "#888", marginBottom: 8, fontFamily: "monospace" }}>
          --font-inter → font-sans
        </p>
        <p style={{ fontSize: 32, fontWeight: 400, lineHeight: 1.2, fontFamily: "Inter, system-ui, sans-serif" }}>
          Inter
        </p>
        <p style={{ fontSize: 14, color: "#888", marginTop: 8, fontFamily: "Inter, system-ui, sans-serif" }}>
          The quick brown fox jumps over the lazy dog
        </p>
        <p style={{ fontSize: 12, color: "#aaa", marginTop: 12 }}>
          Variable font. Used for all UI text — headings, body, labels, captions.
        </p>
      </div>
      <div style={{ padding: 24, borderRadius: 12, border: "1px solid oklch(0.922 0 0)" }}>
        <p style={{ fontSize: 11, color: "#888", marginBottom: 8, fontFamily: "monospace" }}>
          --font-jetbrains-mono → font-mono
        </p>
        <p style={{ fontSize: 32, fontWeight: 400, lineHeight: 1.2, fontFamily: "JetBrains Mono, monospace" }}>
          JetBrains Mono
        </p>
        <p style={{ fontSize: 14, color: "#888", marginTop: 8, fontFamily: "JetBrains Mono, monospace" }}>
          {"SELECT * FROM issues WHERE state = 'open';"}
        </p>
        <p style={{ fontSize: 12, color: "#aaa", marginTop: 12 }}>
          Used in SQL code blocks, table field names, and inline code.
        </p>
      </div>
    </div>
  );
}

const scaleRows = [
  { cls: "text-2xl", size: "1.5rem", usage: "Page titles", px: 24, weight: 600 },
  { cls: "text-xl", size: "1.25rem", usage: "Section headings", px: 20, weight: 600 },
  { cls: "text-lg", size: "1.125rem", usage: "Card headings, stat values", px: 18, weight: 500 },
  { cls: "text-sm", size: "0.875rem", usage: "Body text, table cells, answers", px: 14, weight: 400 },
  { cls: "text-xs", size: "0.75rem", usage: "Captions, labels, metadata", px: 12, weight: 400 },
  { cls: "text-[11px]", size: "0.6875rem", usage: "Tiny labels (badge text, chart axis)", px: 11, weight: 400 },
];

export function TypeScale() {
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
          gridTemplateColumns: "120px 80px 1fr",
          padding: "8px 16px",
          background: "oklch(0.97 0 0)",
          fontSize: 11,
          color: "#888",
          fontFamily: "monospace",
          borderBottom: "1px solid oklch(0.922 0 0)",
        }}
      >
        <span>Class</span>
        <span>Size</span>
        <span>Usage</span>
      </div>
      {scaleRows.map((row, i) => (
        <div
          key={row.cls}
          style={{
            display: "grid",
            gridTemplateColumns: "120px 80px 1fr",
            padding: "12px 16px",
            alignItems: "baseline",
            borderBottom: i < scaleRows.length - 1 ? "1px solid oklch(0.922 0 0)" : "none",
          }}
        >
          <code style={{ fontSize: 12 }}>{row.cls}</code>
          <span style={{ fontSize: 12, color: "#888" }}>{row.size}</span>
          <span
            style={{
              fontSize: row.px,
              fontFamily: "Inter, sans-serif",
              fontWeight: row.weight,
              color: row.weight === 400 && row.px <= 12 ? "#888" : undefined,
            }}
          >
            {row.usage}
          </span>
        </div>
      ))}
    </div>
  );
}

const weightRows = [
  { cls: "font-normal", val: "400", usage: "Body text, descriptions" },
  { cls: "font-medium", val: "500", usage: "Questions, labels, table headers" },
  { cls: "font-semibold", val: "600", usage: "Page titles, stat values" },
];

export function FontWeights() {
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
      {weightRows.map((row, i) => (
        <div
          key={row.cls}
          style={{
            display: "grid",
            gridTemplateColumns: "120px 80px 1fr",
            padding: "12px 16px",
            alignItems: "baseline",
            borderBottom: i < weightRows.length - 1 ? "1px solid oklch(0.922 0 0)" : "none",
          }}
        >
          <code style={{ fontSize: 12 }}>{row.cls}</code>
          <span style={{ fontSize: 12, color: "#888" }}>{row.val}</span>
          <span style={{ fontSize: 16, fontFamily: "Inter, sans-serif", fontWeight: Number(row.val) }}>
            {row.usage}
          </span>
        </div>
      ))}
    </div>
  );
}
