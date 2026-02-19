import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";

export const metadata: Metadata = {
  title: "Style Guide",
};

/* ── Token data ──────────────────────────────────────────────────── */

const colorGroups = [
  {
    label: "Surfaces",
    desc: "Layered backgrounds — page → card → popover. Subtle depth without hard shadows.",
    pairs: [
      { bg: "background", fg: "foreground", usage: "Page" },
      { bg: "card", fg: "card-foreground", usage: "Cards" },
      { bg: "popover", fg: "popover-foreground", usage: "Popovers" },
    ],
  },
  {
    label: "Interactive",
    desc: "Buttons, links, hover states. Primary is high-contrast; secondary and accent are subtle.",
    pairs: [
      { bg: "primary", fg: "primary-foreground", usage: "Primary buttons" },
      { bg: "secondary", fg: "secondary-foreground", usage: "Secondary buttons" },
      { bg: "accent", fg: "accent-foreground", usage: "Hover states" },
    ],
  },
  {
    label: "Text",
    desc: "Two levels of text emphasis. Muted for secondary content, labels, timestamps.",
    pairs: [
      { bg: "muted", fg: "muted-foreground", usage: "Secondary text" },
    ],
  },
  {
    label: "Feedback",
    desc: "Destructive is a Shadcn token for delete buttons and error UI.",
    pairs: [
      { bg: "destructive", fg: "destructive", usage: "Delete actions" },
    ],
  },
];

const edgeColors = [
  { name: "border", usage: "Card and section borders" },
  { name: "input", usage: "Form input borders" },
  { name: "ring", usage: "Focus rings" },
];

const chartColors = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];

const typeScale = [
  { cls: "text-xs", size: "12px", label: "xs" },
  { cls: "text-sm", size: "14px", label: "sm" },
  { cls: "text-base", size: "16px", label: "base" },
  { cls: "text-lg", size: "18px", label: "lg" },
  { cls: "text-xl", size: "20px", label: "xl" },
  { cls: "text-2xl", size: "24px", label: "2xl" },
  { cls: "text-3xl", size: "30px", label: "3xl" },
];

const radii = [
  { cls: "rounded-sm", label: "sm" },
  { cls: "rounded-md", label: "md" },
  { cls: "rounded-lg", label: "lg" },
  { cls: "rounded-xl", label: "xl" },
  { cls: "rounded-2xl", label: "2xl" },
  { cls: "rounded-3xl", label: "3xl" },
  { cls: "rounded-4xl", label: "4xl" },
];

const spacingTokens = [
  { name: "section", px: "24px", desc: "Between cards / sections" },
  { name: "card", px: "16px", desc: "Card internal padding" },
  { name: "element", px: "12px", desc: "Between elements within a card" },
  { name: "tight", px: "10px", desc: "Closely related items" },
  { name: "chip", px: "6px", desc: "Between chips, badges" },
];

/* ── Section heading ─────────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">
      {children}
    </h2>
  );
}

function SectionNote({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground mb-6">{children}</p>;
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-background flex">
      <AppNav />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 w-full flex-1 sm:pl-14">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Style Guide
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Design tokens for this project. All values read from CSS custom
            properties — change <code className="font-mono text-xs">globals.css</code> and
            this page updates automatically.
          </p>
        </div>

        {/* ── Colors ───────────────────────────────────────────── */}
        <section className="mb-12">
          <SectionHeading>Colors</SectionHeading>
          <SectionNote>
            OKLch color space. Grouped by purpose — each swatch shows
            foreground text on its background.
          </SectionNote>

          <div className="flex flex-col gap-8 mb-8">
            {colorGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                  {group.label}
                </p>
                <p className="text-xs text-muted-foreground/60 mb-3">
                  {group.desc}
                </p>
                <div className="flex flex-wrap gap-3">
                  {group.pairs.map(({ bg, fg }) => (
                    <div key={bg}>
                      <div
                        className="h-16 w-40 rounded-lg border flex items-end px-3 pb-2"
                        style={{ background: `var(--${bg})` }}
                      >
                        <span
                          className="text-xs font-mono"
                          style={{ color: `var(--${fg})` }}
                        >
                          {bg}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Status colors — Tailwind, not CSS variables */}
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
            Status
          </p>
          <p className="text-xs text-muted-foreground/60 mb-3">
            Red = broken (pipeline failed). Amber = needs attention (overdue, schema changes). These use Tailwind utilities directly.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <div>
              <div className="h-16 w-40 rounded-lg flex items-end px-3 pb-2 bg-red-500">
                <span className="text-xs font-mono text-white">red-500</span>
              </div>
            </div>
            <div>
              <div className="h-16 w-40 rounded-lg flex items-end px-3 pb-2 bg-amber-500">
                <span className="text-xs font-mono text-white">amber-500</span>
              </div>
            </div>
          </div>

          {/* Edge colors */}
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
            Edges
          </p>
          <p className="text-xs text-muted-foreground/60 mb-3">
            Borders, inputs, and focus rings.
          </p>
          <div className="flex gap-3 mb-8">
            {edgeColors.map(({ name, usage }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <div
                  className="h-10 w-24 rounded-lg border-2"
                  style={{ borderColor: `var(--${name})` }}
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {name}
                </span>
                <span className="text-[10px] text-muted-foreground/60">
                  {usage}
                </span>
              </div>
            ))}
          </div>

          {/* Chart colors */}
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
            Charts
          </p>
          <p className="text-xs text-muted-foreground/60 mb-3">
            Data visualization palette.
          </p>
          <div className="flex gap-2">
            {chartColors.map((name) => (
              <div key={name} className="flex flex-col items-center gap-1.5">
                <div
                  className="h-10 w-10 rounded-full"
                  style={{ background: `var(--${name})` }}
                />
                <span className="text-[10px] font-mono text-muted-foreground">
                  {name.replace("chart-", "")}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Typography ───────────────────────────────────────── */}
        <section className="mb-12">
          <SectionHeading>Typography</SectionHeading>

          {/* Font specimens */}
          <div className="flex flex-col gap-4 mb-8">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                Sans — Inter
              </p>
              <p className="text-xl font-sans text-foreground">
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                Mono — JetBrains Mono
              </p>
              <p className="text-xl font-mono text-foreground">
                pipeline_name = &quot;github_dlt_repo&quot;
              </p>
            </div>
          </div>

          {/* Type scale */}
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Scale
          </p>
          <div className="flex flex-col gap-3">
            {typeScale.map(({ cls, size, label }) => (
              <div key={label} className="flex items-baseline gap-4">
                <span className="text-xs font-mono text-muted-foreground w-16 flex-shrink-0 tabular-nums">
                  {label}
                  <span className="text-muted-foreground/50 ml-1">{size}</span>
                </span>
                <span className={`${cls} text-foreground font-sans`}>
                  Data pipeline monitoring
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Border Radius ────────────────────────────────────── */}
        <section className="mb-12">
          <SectionHeading>Border Radius</SectionHeading>
          <SectionNote>
            Base radius <code className="font-mono text-xs">0.625rem</code>.
            All sizes computed relative to this value.
          </SectionNote>

          <div className="flex flex-wrap gap-4">
            {radii.map(({ cls, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div
                  className={`h-14 w-14 bg-muted border ${cls}`}
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Spacing ──────────────────────────────────────────── */}
        <section className="mb-12">
          <SectionHeading>Spacing</SectionHeading>
          <SectionNote>
            Semantic spacing tokens for consistent layout. Defined as CSS custom
            properties.
          </SectionNote>

          <div className="flex flex-col gap-3">
            {spacingTokens.map(({ name, px, desc }) => (
              <div key={name} className="flex items-center gap-4">
                <span className="text-xs font-mono text-muted-foreground w-16 flex-shrink-0">
                  {name}
                </span>
                <div
                  className="h-5 bg-primary/20 rounded-sm flex-shrink-0"
                  style={{ width: `var(--explore-${name})` }}
                />
                <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
                  {px}
                </span>
                <span className="text-xs text-muted-foreground/60">
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Layout ───────────────────────────────────────────── */}
        <section className="mb-12">
          <SectionHeading>Layout</SectionHeading>
          <SectionNote>
            Every page follows the same shell. Sidebar nav on the left,
            content container centered with consistent width and padding.
          </SectionNote>

          {/* Page shell */}
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Page shell
          </p>
          <div className="rounded-lg border bg-card p-4 mb-8">
            <div className="flex gap-3 items-start">
              <div className="w-8 bg-muted rounded-md flex flex-col items-center gap-2 py-3 flex-shrink-0">
                <div className="w-3 h-3 rounded-sm bg-muted-foreground/30" />
                <div className="w-3 h-3 rounded-sm bg-muted-foreground/30" />
                <div className="w-3 h-3 rounded-sm bg-muted-foreground/30" />
              </div>
              <div className="flex-1 border border-dashed border-border rounded-md p-4">
                <div className="h-4 w-32 bg-muted rounded mb-1.5" />
                <div className="h-2.5 w-56 bg-muted/60 rounded mb-6" />
                <div className="h-20 bg-muted/30 rounded" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs font-mono text-muted-foreground">
              <span>max-w-5xl</span>
              <span>px-4 sm:px-6</span>
              <span>py-8 sm:py-12</span>
              <span>sm:pl-14</span>
            </div>
          </div>

          {/* Header pattern */}
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Page header
          </p>
          <div className="rounded-lg border bg-card p-4 mb-8">
            <div className="mb-6">
              <div className="text-2xl font-semibold tracking-tight text-foreground">
                Page Title
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                source · 4 datasets · 60.1k records · updated 10d ago
              </div>
            </div>
            <div className="border-t border-dashed pt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs font-mono text-muted-foreground">
              <span>text-2xl font-semibold tracking-tight</span>
              <span>text-sm text-muted-foreground mt-1</span>
              <span>mb-6</span>
            </div>
          </div>

          {/* Card surfaces */}
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Card surfaces
          </p>
          <div className="flex gap-3 mb-3">
            <div className="rounded-lg border border-border/50 bg-card px-4 py-3 flex-1">
              <span className="text-sm font-semibold text-foreground block">bg-card</span>
              <span className="text-xs text-muted-foreground">border-border/50 · rounded-lg</span>
            </div>
            <div className="rounded-lg border border-border bg-card px-4 py-3 flex-1 shadow-sm">
              <span className="text-sm font-semibold text-foreground block">Shadcn Card</span>
              <span className="text-xs text-muted-foreground">border-border · shadow-sm</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/60">
            Lightweight cards use bg-card with a subtle border. Shadcn Cards add shadow for more prominence.
          </p>
        </section>
      </div>
    </div>
  );
}
