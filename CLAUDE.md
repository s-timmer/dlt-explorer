# Claude Code Instructions — dlt Data Explorer

## What we're building
A visual data explorer for dlt datasets. Two views: a catalog page listing entity-grouped datasets, and a detail page showing schema + data preview. This is the missing UI layer for dlt's data platform — what `print(catalog)` should look like when someone applies design thinking to it.

This is NOT a website or SaaS dashboard. It's a data viewer — rendered output with sane, lightly branded UI choices. Like how `df.head()` renders a DataFrame with considered CSS, this is what dlt's output looks like when designed for its actual users.

## Context
This is a portfolio piece for a Senior Product Designer interview at dltHub. The quality bar is high — every design decision should look intentional and be defensible.

The key design argument: dlt+ is expanding beyond data engineers to serve **data scientists** — people who live in Jupyter notebooks, pandas, and matplotlib. The CTO's design target is "a working student who only knows Python, no SQL." They think in DataFrames and records, not tables and rows. The visual language for that audience is fundamentally different from developer tools.

## The scenario
A data scientist wants to understand the dlt-hub GitHub repository. They prompt an LLM: "Pull the GitHub data." The LLM generates a dlt pipeline, runs it, loads data into DuckDB. Then it renders the catalog: four entity cards (Issues, Pulls, Stargazers, Repo) with AI-generated descriptions. The data scientist scans, clicks in, evaluates. At no point do they open a separate app, learn SQL, or file a ticket.

The catalog is the visual side of a feedback loop with an LLM.

## Tech stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Static JSON data (no live database)
- Deployed on Vercel

## Data
JSON files live in `/public/data/`. Exported from a dlt pipeline that loaded GitHub data into DuckDB.

- `catalog.json` — list of all datasets with field info, record counts
- `metadata.json` — pipeline info (name, last loaded, destination, dataset name)
- `table_[name].json` — sample records (up to 50) per dataset

## Design direction

### Data scientist native
Data scientists work in Jupyter, Streamlit, Colab, Observable. Their tools are light backgrounds, proportional fonts, generous whitespace, warm and approachable. This explorer should feel like it belongs in that world — not like a separate portal they have to context-switch into.

Design references: Jupyter notebooks, Observable, Google Colab output cells, Notion databases, dbt docs.

### Visual style
- **Light mode by default** — clean white/light gray background
- **Warm, approachable** — not clinical or cold
- Generous white space — readable > dense for this audience
- Information-rich but not overwhelming — clear visual hierarchy

### Typography
- **Inter** (proportional) for headings, labels, descriptions, navigation — everything that's "interface"
- **JetBrains Mono** for field names, data type labels, raw data values, dataset names in lists
- Readable font sizes — not tiny

### Color usage
- Soft, purposeful type badges: blue (text), amber (number), green (boolean), violet (date)
- Use tinted backgrounds on cards rather than hard borders
- Professional but warm — think Notion, not GitHub dark mode

## Vocabulary — critical

The interface speaks the user's language, not the database's.

| Database term | UI term | Where it appears |
|---|---|---|
| tables | datasets | Card labels, subtitles, breadcrumbs |
| rows | records | Counts, tab badges, descriptions |
| columns | fields | Schema view header, preview headers |
| varchar | text | Type badges |
| bigint, double | number | Type badges |
| timestamp | date | Type badges |
| boolean | boolean | Type badges |

This isn't cosmetic. A data scientist seeing "varchar" and "bigint" feels like they've opened the wrong tool.

## Page structure

### Catalog page (`/`)
- **Header**: Dataset name (capitalized), source · dataset count · total records. Freshness right-aligned with refresh action.
- **Entity cards**: Group dlt's flat datasets by entity. 4 cards (Issues, Pulls, Stargazers, Repo) instead of 16 individual datasets. Each card shows:
  - Entity name + folder icon
  - Curated field preview (filtered — no infrastructure noise like `user__id`, `gravatar_id`, `site_admin`, URL fields)
  - List of parent + child datasets with record counts
- **Pipeline metadata**: dlt internal tables shown as quiet chips at bottom
- The feel: "here's your data library, browse it"

### Detail page (`/table/[name]`)
- **Breadcrumb**: Catalog > Dataset Name
- **Header**: Display name (capitalized), record count, field count
- **Related datasets**: Parent, children, siblings — shown inline
- **Two tabs**:
  1. **Schema** — fields sorted by semantic importance (identity fields first, URLs and IDs last). Friendly type badges. Pipeline metadata fields separated at bottom with reduced opacity.
  2. **Data preview** — first 50 records. Same smart field ordering as schema. Values truncated at 80 chars with tooltip. Null values as "—", booleans as colored badges.
- The feel: "here's everything you need to know about this dataset before you start working with it"

### Smart field ordering
Fields are sorted by a scoring system, not database order:
- Score 0: Identity fields (number, title, name, login, state, status)
- Score 1: Content fields (body, description, message, timestamps)
- Score 3: General fields
- Score 4: Nested user-readable fields (user__login)
- Score 7: URL fields (pushed to end)
- Score 8: ID/infrastructure fields (id, node_id, gravatar_id)

This matters because the first 4-5 visible fields determine whether a data scientist thinks the dataset is useful or junk.

### Field preview filtering (catalog cards)
Exclude from card previews: `_dlt_*` fields, `*_url` fields, `id`, `node_id`, `gravatar_id`, `user_view_type`, `type`, `site_admin`. Show up to 6 relevant fields.

## Code style
- Use `async` server components (App Router)
- Keep components small and composable
- Type JSON data with TypeScript interfaces
- Read JSON from `/public/data/` using `fs` in server components

## Design decisions trace to user jobs

Every UI element traces back to a Job To Be Done:

| Job | UI element |
|---|---|
| "What data do we have?" | Entity grouping — 4 cards, not 16 |
| "Is this relevant?" | Field names on cards, curated preview |
| "Can I trust this?" | Freshness timestamp, refresh action |
| "Let me see what's in here" | Smart field ordering, data preview |
| "How do datasets connect?" | Related datasets on detail page |

See `/project/03-data-scientist-jtbd.md` and `/project/04-design-decisions.md` for the full JTBD framework, assumptions, and verification plan.

## Important
- This is a portfolio piece — visual polish matters more than feature count
- Two views done beautifully beats five views done roughly
- When in doubt, go for the cleaner, simpler option
- Desktop-first is fine
- **Every design choice should be defensible** — traced back to the persona, their jobs, and the company strategy
