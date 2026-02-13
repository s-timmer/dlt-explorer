const mappings = [
  { database: "tables", ui: "datasets", where: "Card labels, subtitles, breadcrumbs" },
  { database: "rows", ui: "records", where: "Counts, tab badges, descriptions" },
  { database: "columns", ui: "fields", where: "Schema view header, preview headers" },
  { database: "varchar", ui: "text", where: "Type badges" },
  { database: "bigint / double", ui: "number", where: "Type badges" },
  { database: "timestamp", ui: "date", where: "Type badges" },
  { database: "boolean", ui: "boolean", where: "Type badges (unchanged)" },
];

function Row({ database, ui, where }: { database: string; ui: string; where: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 2fr",
        gap: 16,
        padding: "10px 0",
        borderBottom: "1px solid oklch(0.922 0 0)",
        alignItems: "baseline",
      }}
    >
      <code
        style={{
          fontSize: 13,
          color: "#888",
          textDecoration: "line-through",
          textDecorationColor: "oklch(0.8 0 0)",
        }}
      >
        {database}
      </code>
      <code style={{ fontSize: 13, fontWeight: 500 }}>{ui}</code>
      <span style={{ fontSize: 12, color: "#888" }}>{where}</span>
    </div>
  );
}

export function VocabularyTable() {
  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 2fr",
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
        <span>Database term</span>
        <span>UI term</span>
        <span>Where it appears</span>
      </div>
      {mappings.map((m) => (
        <Row key={m.database} {...m} />
      ))}
    </div>
  );
}
