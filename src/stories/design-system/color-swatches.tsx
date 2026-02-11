const semanticColors = [
  { token: "--background", value: "oklch(0.985 0.002 80)", label: "Page background", light: true },
  { token: "--foreground", value: "oklch(0.205 0.015 60)", label: "Primary text", light: false },
  { token: "--card", value: "oklch(0.998 0.001 80)", label: "Card surfaces", light: true },
  { token: "--primary", value: "oklch(0.205 0 0)", label: "Buttons, links", light: false },
  { token: "--secondary", value: "oklch(0.97 0 0)", label: "Secondary surfaces", light: true },
  { token: "--muted", value: "oklch(0.97 0 0)", label: "Muted backgrounds", light: true },
  { token: "--muted-foreground", value: "oklch(0.556 0 0)", label: "Secondary text, captions", light: false },
  { token: "--border", value: "oklch(0.922 0 0)", label: "Borders, dividers", light: true },
  { token: "--destructive", value: "oklch(0.577 0.245 27.325)", label: "Error states, delete actions", light: false },
];

const chartColors = [
  { token: "--chart-1", value: "oklch(0.646 0.222 41.116)", label: "Warm orange" },
  { token: "--chart-2", value: "oklch(0.6 0.118 184.704)", label: "Teal" },
  { token: "--chart-3", value: "oklch(0.398 0.07 227.392)", label: "Deep blue" },
  { token: "--chart-4", value: "oklch(0.828 0.189 84.429)", label: "Gold" },
  { token: "--chart-5", value: "oklch(0.769 0.188 70.08)", label: "Amber" },
];

function Swatch({ token, value, label, light }: { token: string; value: string; label: string; light?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div
        style={{
          width: "100%",
          height: 64,
          borderRadius: 8,
          background: value,
          border: light ? "1px solid oklch(0.922 0 0)" : "none",
        }}
      />
      <code style={{ fontSize: 12 }}>{token}</code>
      <span style={{ fontSize: 11, color: "#888" }}>{value}</span>
      <span style={{ fontSize: 11, color: "#888" }}>{label}</span>
    </div>
  );
}

export function SemanticColors() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 12,
        marginTop: 16,
      }}
    >
      {semanticColors.map((c) => (
        <Swatch key={c.token} {...c} />
      ))}
    </div>
  );
}

export function ChartColors() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 12,
        marginTop: 16,
      }}
    >
      {chartColors.map((c) => (
        <Swatch key={c.token} token={c.token} value={c.value} label={c.label} />
      ))}
    </div>
  );
}
