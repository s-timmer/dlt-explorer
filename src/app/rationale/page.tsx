import Link from "next/link";
import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";

export const metadata: Metadata = {
  title: "Design Rationale",
};

const sections = [
  { id: "context", label: "Context" },
  { id: "personas", label: "Personas" },
  { id: "jobs", label: "Jobs to be done" },
  { id: "decisions", label: "Design decisions" },
  { id: "explore", label: "V2: Explore" },
  { id: "process", label: "Process" },
];

export default function RationalePage() {
  return (
    <div className="min-h-screen bg-background flex">
      <AppNav />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 w-full flex-1 sm:pl-14">
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
            <header>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Design rationale
              </h1>
            </header>
            {/* 1. Context */}
            <section id="context">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Context
              </h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed max-w-2xl">
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
                  legible. The data catalog felt like the right surface to start with.
                </p>
                <p>
                  The interesting thing is that dltHub is code-first by strategy. 300+ competitors
                  built GUIs. Those GUIs can&apos;t be pip-installed, can&apos;t be read by LLMs,
                  can&apos;t be composed through Python dependencies. So where does design fit?
                </p>
                <p>
                  Probably the same way it works in Python already. When you run{" "}
                  <code className="font-mono text-foreground/80 bg-muted px-1.5 py-0.5 rounded text-xs">
                    df.head()
                  </code>{" "}
                  in a notebook, you get a rendered HTML table. The visual layer isn&apos;t
                  a separate app, it&apos;s what the code produces. This catalog tries to work
                  the same way.
                </p>

                <h3 className="text-lg font-medium text-foreground !mt-6 !mb-1">
                  The scenario I had in mind
                </h3>
                <p>
                  A data scientist wants to understand the dlt-hub GitHub repository. They prompt
                  an LLM: &ldquo;Pull the GitHub data.&rdquo; The LLM generates a dlt pipeline,
                  runs it, loads data into DuckDB. The catalog renders four entity cards with
                  AI-generated descriptions. They scan, click in, evaluate. No separate app,
                  no SQL, no ticket.
                </p>
                <p>
                  Things I&apos;d want to test: how quickly someone gets to their first insight,
                  whether they can answer data questions without filing a ticket, and whether
                  they come back to the catalog (standalone catalogs typically see &lt;20% adoption).
                </p>
              </div>
            </section>

            {/* 2. Personas */}
            <section id="personas">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Personas
              </h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed max-w-2xl">
                <p>
                  From the research, I see four personas that use dlt. The catalog is where they overlap.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                  <div className="rounded-lg border bg-card p-4">
                    <p className="font-medium text-foreground text-base mb-1">Data engineer</p>
                    <p className="text-sm text-muted-foreground">
                      1-3 per company. Builds pipelines, publishes to catalog.
                      CLI-native, Python-fluent. The builder.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <p className="font-medium text-foreground text-base mb-1">Data scientist</p>
                    <p className="text-sm text-muted-foreground">
                      5-10x more numerous. Discovers through catalog.
                      Notebook-native, visual. The expansion audience.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <p className="font-medium text-foreground text-base mb-1">Infra / security</p>
                    <p className="text-sm text-muted-foreground">
                      The gatekeeper. Audits through catalog. Rare interaction,
                      high stakes. Needs trust and transparency.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <p className="font-medium text-foreground text-base mb-1">AI agents & vibe coders</p>
                    <p className="text-sm text-muted-foreground">
                      Non-traditional users. LLMs generating pipelines, developers
                      using AI to build things they couldn&apos;t write themselves.
                    </p>
                  </div>
                </div>

                <p>
                  I focused on the data scientist, who the CTO describes as &ldquo;a working
                  student who only knows Python, no SQL.&rdquo; There are 5-10x more of them per
                  company than data engineers, and right now they have no designed experience at all.
                </p>
                <p>
                  What I found interesting: the handoff between these personas is where the real
                  value is. The data engineer publishes, the data scientist discovers, the security
                  person audits. The catalog is where they meet.
                </p>
              </div>
            </section>

            {/* 3. Jobs to be done */}
            <section id="jobs">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Jobs to be done
              </h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed max-w-2xl">
                <p>
                  I picked five common jobs for a data scientist working with loaded data
                  and tried to tie every UI element back to one of them:
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
                      <p className="font-medium text-foreground text-base mb-1">
                        &ldquo;{item.job}&rdquo;
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">{item.ui}</p>
                      <p className="text-sm text-muted-foreground/60">
                        <span className="font-medium">Verify:</span> {item.verify}
                      </p>
                    </div>
                  ))}
                </div>

                <p>
                  Each of these rests on an assumption that could be tested. Together they&apos;d
                  make a reasonable first-month research plan.
                </p>
              </div>
            </section>

            {/* 4. Design decisions */}
            <section id="decisions">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Design decisions
              </h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed max-w-2xl">
                <h3 className="text-lg font-medium text-foreground !mt-6 !mb-1">
                  Light mode
                </h3>
                <p>
                  Data scientists work in Jupyter, Colab, Observable, Streamlit. All light
                  backgrounds, proportional fonts, generous whitespace. Matching their
                  environment felt more useful than defaulting to dark mode.
                </p>

                <h3 className="text-lg font-medium text-foreground !mt-6 !mb-1">
                  Vocabulary
                </h3>
                <p>
                  Datasets instead of tables, records instead of rows, text instead of varchar.
                  A data scientist seeing &ldquo;bigint&rdquo; probably feels like they&apos;ve
                  opened the wrong tool.
                </p>

                <h3 className="text-lg font-medium text-foreground !mt-6 !mb-1">
                  Entity grouping
                </h3>
                <p>
                  dlt loads 16 datasets from GitHub. Showing 16 flat cards felt overwhelming,
                  but they cluster naturally into 4 entities (Issues, Pulls, Stargazers, Repo).
                  Went through a few versions before landing on the current flat-sibling layout.
                </p>

                <h3 className="text-lg font-medium text-foreground !mt-6 !mb-1">
                  Smart field ordering
                </h3>
                <p>
                  The first 4-5 visible fields pretty much determine whether someone thinks a
                  dataset is useful. Database order showed 6 URL fields first, burying the
                  interesting data. A simple scoring system fixes this: identity fields (number,
                  title, state) at score 0, URLs at 7, infrastructure IDs at 8.
                </p>

                <h3 className="text-lg font-medium text-foreground !mt-6 !mb-1">
                  AI-generated descriptions
                </h3>
                <p>
                  Each entity card shows a one-line description inferred from the schema by an LLM.
                  Pre-generated and stored alongside the catalog data, no runtime calls. Swap
                  GitHub for Stripe or Salesforce and the descriptions adapt automatically.
                </p>
              </div>
            </section>

            {/* 5. V2: Conversational exploration */}
            <section id="explore">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                V2: Conversational exploration
              </h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed max-w-2xl">
                <p>
                  After the catalog was built, dltHub published their{" "}
                  <a
                    href="https://medium.com/@dlthub.com/were-building-dlthub-to-make-data-engineering-accessible-for-all-python-developers-0a57cb5eb5c0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline underline-offset-2"
                  >
                    July 2025 vision announcement
                  </a>
                  . Two things stood out: marimo notebooks are now the primary product surface,
                  and LLM-native workflows are at the core. The Workspace Notebook demo showed
                  data scientists querying pipelines through natural language inside notebook
                  cells.
                </p>

                <h3 className="text-lg font-medium text-foreground !mt-6 !mb-1">
                  The insight
                </h3>
                <p>
                  A marimo notebook is already a conversation with data. Each cell is a question,
                  each output is a response, and the thread persists. But the current notebook UI
                  doesn&apos;t make it <em>feel</em> like a conversation. It still looks and
                  behaves like a code editor.
                </p>
                <p>
                  The explore view demonstrates what that experience could feel like if designed
                  around the user&apos;s actual mental model: ask a question in plain language,
                  get a structured visual response, build understanding incrementally. No code
                  cells, no SQL knowledge required.
                </p>

                <h3 className="text-lg font-medium text-foreground !mt-6 !mb-1">
                  How it works
                </h3>
                <p>
                  From any dataset detail page, users can enter the explore view. A context header
                  shows what the AI &ldquo;knows&rdquo; about the dataset: table name, record count,
                  key fields. As the conversation progresses, accessed fields highlight to show
                  growing context.
                </p>
                <p>
                  Each exchange follows the same pattern: natural language question, realistic SQL
                  (displayed but never executed), and a typed result: a data table, stat cards,
                  or a horizontal bar chart. Suggestion chips guide first-time users toward
                  productive questions.
                </p>
                <p>
                  The mock conversation system uses keyword matching against pre-authored scripts.
                  Each script runs real JavaScript functions against the actual JSON data, so the
                  numbers in the results are real. A simulated delay with skeleton animation
                  creates the rhythm of an AI response.
                </p>

                <h3 className="text-lg font-medium text-foreground !mt-6 !mb-1">
                  Three result types, no charting library
                </h3>
                <div className="space-y-3 py-2">
                  <div className="rounded-lg border bg-card p-4">
                    <p className="font-medium text-foreground text-base mb-1">Data table</p>
                    <p className="text-sm text-muted-foreground">
                      Reuses the existing shadcn table component. Handles null values,
                      long text truncation, and column ordering from the v1 field config system.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <p className="font-medium text-foreground text-base mb-1">Stat cards</p>
                    <p className="text-sm text-muted-foreground">
                      Large number, label, optional detail. Used for counts and single-value
                      answers. Wraps into a responsive grid for multi-stat responses.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <p className="font-medium text-foreground text-base mb-1">Bar chart</p>
                    <p className="text-sm text-muted-foreground">
                      CSS-only horizontal bars using percentage widths relative to the max value.
                      Uses the existing chart color variables. No D3, no Recharts, just divs.
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-foreground !mt-6 !mb-1">
                  Component-first process
                </h3>
                <p>
                  The explore view was built component-first: each piece (stat card, bar chart,
                  SQL block, exchange cell, input with suggestions) was developed and documented
                  in Storybook before composing the full page. This forced clear interfaces
                  between components and made edge cases visible early: What does a stat card
                  look like with a very long value? How does the bar chart handle a single item?
                  What happens when the SQL block is empty?
                </p>
                <p>
                  The{" "}
                  <a
                    href={process.env.NODE_ENV === "development" ? "http://localhost:6006" : "https://698ef1ee455ce2c83ed99d52-hhrnlzhbnd.chromatic.com/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline underline-offset-2"
                  >
                    Storybook
                  </a>{" "}
                  documents all 8 components with their key states and variants, serving as
                  both a development tool and a design system artifact.
                </p>

                <h3 className="text-lg font-medium text-foreground !mt-6 !mb-1">
                  The design argument
                </h3>
                <p>
                  This makes a specific claim aligned with dltHub&apos;s direction: the
                  notebook-as-conversation pattern is real, but the UX hasn&apos;t caught up.
                  Data scientists think in questions and answers, not code cells and execution
                  order. The explore view shows what the marimo notebook experience could feel
                  like if designed around that mental model.
                </p>
              </div>
            </section>

            {/* 6. Process */}
            <section id="process">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Process
              </h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed max-w-2xl">
                <p>
                  How I approached it:
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
                    <span className="font-medium text-foreground">Build (v1).</span> dlt pipeline, DuckDB, JSON
                    export, Next.js + Shadcn frontend. Real data, not mocks.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Polish.</span> Vocabulary pass,
                    field ordering, AI descriptions, relationship labels, type badges, each
                    traced back to a user job.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Generalize.</span> Separated
                    all dataset-specific logic (descriptions, field ordering, noise filters) into
                    config files. Wrote an LLM-readable customization guide so anyone can point
                    the explorer at their own dlt pipeline. Published on{" "}
                    <a href="https://github.com/s-timmer/dlt-explorer" target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline underline-offset-2">GitHub</a>{" "}
                    as a reusable tool.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Build (v2).</span> After dltHub&apos;s
                    vision announcement, added conversational exploration. Component-first workflow:
                    built each component in Storybook isolation, documented states and variants,
                    then composed the full page. 10 new components, 26 story variants, mock
                    conversation system with real data.
                  </li>
                </ol>

                <h3 className="text-lg font-medium text-foreground !mt-6 !mb-1">
                  Tools
                </h3>
                <p>
                  Claude for research and analysis. MacWhisper for transcribing primary sources.
                  Obsidian for working documents. Cursor + Claude Code for building. AI helped
                  compress what might have been a week of research into a weekend.
                </p>

                <h3 className="text-lg font-medium text-foreground !mt-6 !mb-1">
                  What&apos;s next
                </h3>
                <p>
                  The catalog is one surface. The conversational explore view is another. Together
                  they demonstrate a pattern: data infrastructure can have designed experiences
                  without adding GUIs that fight the code-first strategy. The same approach could
                  extend to marketplace browsing, schema visualization, pipeline debugging, and
                  audit views.
                </p>
              </div>
            </section>
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t text-sm text-muted-foreground">
          <p className="flex gap-4">
            <Link href="/" className="text-foreground hover:underline underline-offset-2">
              View the explorer
            </Link>
            <span className="text-border">/</span>
            <a
              href={process.env.NODE_ENV === "development" ? "http://localhost:6006" : "https://698ef1ee455ce2c83ed99d52-hhrnlzhbnd.chromatic.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline underline-offset-2"
            >
              Storybook
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
