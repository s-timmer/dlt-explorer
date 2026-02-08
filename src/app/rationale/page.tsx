import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Rationale",
};

const sections = [
  { id: "initiative", label: "The initiative" },
  { id: "personas", label: "Personas" },
  { id: "jobs", label: "Jobs to be done" },
  { id: "decisions", label: "Design decisions" },
  { id: "process", label: "Process" },
];

export default function RationalePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <nav className="mb-10">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to catalog
          </Link>
        </nav>

        <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">
          {/* Sidebar navigation */}
          <aside className="hidden lg:block">
            <nav className="sticky top-12">
              <ul className="space-y-3 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <main className="space-y-20">
            <header className="mb-[-2rem]">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
                Design rationale
              </h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                The thinking behind the dlt Data Explorer. This documents how the
                design decisions connect to dltHub&apos;s strategy, their users, and the
                specific jobs data scientists need to get done. Built as a design
                initiative for a Senior Product Designer role at dltHub.
              </p>
            </header>
            {/* 1. The Initiative */}
            <section id="initiative">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                The initiative
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                <p>
                  dltHub is a pip-installable data platform. The open-source library handles
                  data loading, with 3M+ downloads/month across 5,000+ companies. The commercial
                  platform adds team features: packages, contracts, catalogs, security. Pipeline
                  builds are growing from 2,400 to 35,000+ per month, driven by AI-assisted
                  development.
                </p>
                <p>
                  Their strategy: make data infrastructure invisible by making it code. Code that
                  AI can read. Code that data scientists can pip install. But the more invisible
                  the infrastructure becomes, the more you need designed surfaces to make it
                  legible. When discovering data, when something breaks, when you need to verify
                  that data is fresh. The data catalog is the highest-impact surface to design
                  first.
                </p>

                <h3 className="text-base font-medium text-foreground pt-4">
                  The design tension
                </h3>
                <p>
                  dltHub is code-first by strategy, not by accident. 300+ competitors built GUIs.
                  Those GUIs can&apos;t be pip-installed, can&apos;t be read by LLMs, can&apos;t
                  be composed through Python dependencies. The question: how do you build
                  visual surfaces for a code-first platform?
                </p>
                <p>
                  Look at how Python handles this. When you run{" "}
                  <code className="font-mono text-foreground/80 bg-muted px-1.5 py-0.5 rounded text-xs">
                    df.head()
                  </code>{" "}
                  in a notebook, you get a rendered HTML table. The visual layer isn&apos;t
                  a separate app, it&apos;s what the code produces. This catalog works the same
                  way: rendered output with considered design choices. A data viewer, not a
                  website or dashboard.
                </p>

                <h3 className="text-base font-medium text-foreground pt-4">
                  The scenario
                </h3>
                <p>
                  A data scientist wants to understand the dlt-hub GitHub repository. They prompt
                  an LLM: &ldquo;Pull the GitHub data.&rdquo; The LLM generates a dlt pipeline,
                  runs it, loads data into DuckDB. The catalog renders four entity cards with
                  AI-generated descriptions. The scientist scans, clicks in, evaluates. At no
                  point do they open a separate app, learn SQL, or file a ticket. The catalog is
                  the visual side of a feedback loop with AI.
                </p>

                <h3 className="text-base font-medium text-foreground pt-4">
                  What we&apos;d measure
                </h3>
                <p>
                  Time to first insight (target: under 30 seconds). Self-serve rate, meaning data
                  questions answered without filing a ticket. Catalog return rate, beating
                  the &lt;20% adoption baseline of standalone catalogs. Entity comprehension: can
                  users correctly identify which datasets belong together?
                </p>
              </div>
            </section>

            {/* 2. Personas */}
            <section id="personas">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Personas
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                <p>
                  dltHub serves four distinct personas. The catalog is where they converge.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                  <div className="rounded-lg border bg-card p-4">
                    <p className="font-medium text-foreground text-sm mb-1">Data engineer</p>
                    <p className="text-xs text-muted-foreground">
                      1-3 per company. Builds pipelines, publishes to catalog.
                      CLI-native, Python-fluent. The builder.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <p className="font-medium text-foreground text-sm mb-1">Data scientist</p>
                    <p className="text-xs text-muted-foreground">
                      5-10x more numerous. Discovers through catalog.
                      Notebook-native, visual. The expansion audience.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <p className="font-medium text-foreground text-sm mb-1">Infra / security</p>
                    <p className="text-xs text-muted-foreground">
                      The gatekeeper. Audits through catalog. Rare interaction,
                      high stakes. Needs trust and transparency.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <p className="font-medium text-foreground text-sm mb-1">AI agents & vibe coders</p>
                    <p className="text-xs text-muted-foreground">
                      Non-traditional users. LLMs generating pipelines, developers
                      using AI to build things they couldn&apos;t write themselves.
                    </p>
                  </div>
                </div>

                <p>
                  The design target for this project is the data scientist, who the CTO describes
                  as &ldquo;a working student who only knows Python, no SQL.&rdquo; They
                  represent the biggest growth vector (more users per company means more
                  platform usage) and currently have no designed experience at all.
                </p>
                <p>
                  A key insight from the research: the handoff IS the product. The data engineer
                  publishes. The data scientist discovers. The security person audits. The value
                  comes from how well they hand off to each other, and the catalog is the surface
                  where that happens.
                </p>
              </div>
            </section>

            {/* 3. Jobs to be done */}
            <section id="jobs">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Jobs to be done
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                <p>
                  We picked five common jobs to be done for a data scientist working with
                  loaded data. Every UI element traces back to one of these:
                </p>

                <div className="space-y-3 py-2">
                  {[
                    {
                      job: "What data do we have?",
                      ui: "Entity grouping: 4 cards instead of 16 flat datasets",
                      verify: "Give 5 data scientists the catalog, ask 'what data is available?' and see if they describe entities or individual datasets",
                    },
                    {
                      job: "Is this relevant to my question?",
                      ui: "AI-generated descriptions and curated field previews on each card",
                      verify: "Card sort: do users group field names by entity the same way the AI does?",
                    },
                    {
                      job: "Can I trust this?",
                      ui: "Freshness timestamp, record counts, refresh action",
                      verify: "Ask 'would you use this data for a report?' and see if trust signals influence the answer",
                    },
                    {
                      job: "Let me see what's in here",
                      ui: "Smart field ordering: identity fields first, infrastructure last",
                      verify: "Time-on-task: how quickly can users find the 'title' field in the schema?",
                    },
                    {
                      job: "How do these datasets connect?",
                      ui: "Parent/child/sibling navigation with natural language labels",
                      verify: "Ask users to draw the relationship between issues and issues__labels",
                    },
                  ].map((item) => (
                    <div key={item.job} className="rounded-lg border bg-card p-4">
                      <p className="font-medium text-foreground text-sm mb-1">
                        &ldquo;{item.job}&rdquo;
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">{item.ui}</p>
                      <p className="text-xs text-muted-foreground/60">
                        <span className="font-medium">Verify:</span> {item.verify}
                      </p>
                    </div>
                  ))}
                </div>

                <p>
                  Each design decision rests on a testable assumption. Together these form
                  a first-month research programme, where every assumption can be validated
                  through usability testing, A/B tests, or analytics.
                </p>
              </div>
            </section>

            {/* 4. Design decisions */}
            <section id="decisions">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Design decisions
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                <h3 className="text-base font-medium text-foreground">
                  Light mode
                </h3>
                <p>
                  Data scientists work in Jupyter, Colab, Observable, Streamlit. Their tools
                  use light backgrounds, proportional fonts, generous whitespace. Matching that
                  environment is a practical choice, not an aesthetic one. References: Jupyter
                  notebooks, Observable, Google Colab output cells, Notion databases, dbt docs.
                </p>

                <h3 className="text-base font-medium text-foreground pt-4">
                  Vocabulary
                </h3>
                <p>
                  The interface speaks the user&apos;s language, not the database&apos;s.
                  Datasets instead of tables, records instead of rows, text instead of varchar.
                  A data scientist seeing &ldquo;bigint&rdquo; feels like they&apos;ve opened
                  the wrong tool. Small change, large impact on confidence.
                </p>

                <h3 className="text-base font-medium text-foreground pt-4">
                  Entity grouping
                </h3>
                <p>
                  dlt loads 16 datasets from GitHub. Showing 16 flat cards is overwhelming.
                  They cluster into 4 entities (Issues, Pulls, Stargazers, Repo). We iterated
                  through four versions: flat cards, nested chips, tree structures, then
                  the current flat-sibling layout that reflects how dlt actually works.
                </p>

                <h3 className="text-base font-medium text-foreground pt-4">
                  Smart field ordering
                </h3>
                <p>
                  The first 4-5 visible fields determine whether a data scientist thinks a dataset
                  is useful or junk. Database order showed 6 URL fields first, burying the
                  interesting data. We built a scoring system: identity fields (number, title, state)
                  at score 0, URLs at score 7, infrastructure IDs at score 8. Small change, big
                  impact on first impression.
                </p>

                <h3 className="text-base font-medium text-foreground pt-4">
                  AI-generated descriptions
                </h3>
                <p>
                  Each entity card shows a one-line description inferred from the schema by an LLM.
                  Pre-generated and stored alongside the catalog data, no runtime calls.
                  This scales to any dataset: swap GitHub for Stripe or Salesforce and the
                  descriptions adapt. The designer defines the system, the AI fills it in.
                </p>
              </div>
            </section>

            {/* 5. Process */}
            <section id="process">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Process
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                <p>
                  Research first, specs second, build third. The methodology:
                </p>
                <ol className="space-y-2 pl-5 list-decimal">
                  <li>
                    <span className="font-medium text-foreground">Research.</span> Company
                    analysis (Rumelt strategy kernel), primary sources (CTO podcast, workspace
                    demo, product launch posts), competitor landscape, job description analysis.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Personas & JTBD.</span> Identified
                    4 personas from research, defined jobs for the data scientist, mapped pain
                    points to design opportunities.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Design direction.</span> Strategic
                    choice: data scientist native, not developer native. Light mode, academic
                    aesthetic, notebook-native rendering.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Specs.</span> Design initiative
                    brief, JTBD-to-UI mapping, assumptions and verification plan, design decisions
                    with iteration history.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Build.</span> dlt pipeline, DuckDB, JSON
                    export, Next.js + Shadcn frontend. Real data, not mocks.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Polish.</span> Vocabulary pass,
                    field ordering, AI descriptions, relationship labels, type badges, each
                    traced back to a user job.
                  </li>
                </ol>

                <h3 className="text-base font-medium text-foreground pt-4">
                  Tools
                </h3>
                <p>
                  Claude for research and strategic analysis. MacWhisper for transcribing primary
                  sources. Obsidian for working documents. Cursor + Claude Code for building.
                  AI sped up research that might have taken a week, but the design decisions
                  were human-driven.
                </p>

                <h3 className="text-base font-medium text-foreground pt-4">
                  What&apos;s next
                </h3>
                <p>
                  The catalog is surface one. The design patterns here (notebook-native
                  aesthetic, entity-level thinking, code-generated output, trust through
                  transparency) extend to every surface dlt+ needs: marketplace browsing (1,000+
                  connectors), schema and contract visualization, audit and security views. One
                  design language, many surfaces.
                </p>
              </div>
            </section>
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t text-sm text-muted-foreground">
          <p>
            Built as a design initiative for a Senior Product Designer role at dltHub.{" "}
            <Link href="/" className="text-foreground hover:underline underline-offset-2">
              View the explorer →
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
