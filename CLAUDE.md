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

### Vertical sidebar (all pages)
- Fixed left sidebar with icon navigation: Home (catalog), MessageSquare (explore), Info (rationale), BookOpen (Storybook — dev only)
- Active page icon is brighter (`text-muted-foreground`), inactive icons are dimmer (`text-muted-foreground/30`)

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

### Explore page (`/explore`)
- Notebook-style chat explorer — two-phase UI: browse datasets, then explore one in a conversational interface
- Uses `NotebookStream` component with `CompactCatalog` for dataset selection
- Experimental — separate from the main catalog, accessible via the sidebar chat icon

### Rationale page (`/rationale`)
- Design rationale document: context, personas, JTBD framework, design decisions, process
- Accessible via the info icon in the sidebar

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

The full JTBD framework, assumptions, and verification plan are rendered on the `/rationale` page.

## Spacing tokens

Spacing uses semantic CSS custom properties defined in `globals.css`, mapped to Tailwind via `@theme inline`. Use these instead of raw Tailwind values in explore components:

| Token | Tailwind class | Value | Use for |
|---|---|---|---|
| `--spacing-section` | `gap-section` | 24px | Between exchange cards in conversation |
| `--spacing-element` | `gap-element` | 12px | Between elements within a card (answer + chart + SQL) |
| `--spacing-tight` | `gap-tight` | 10px | Between closely related items (bar chart rows, input + suggestions) |
| `--spacing-chip` | `gap-chip` | 6px | Between chips, badges, small inline items |
| `--spacing-card` | `p-card` | 16px | Card internal padding, vertical rhythm between sections |

The base values live as `--explore-*` custom properties in `:root`, then map to `--spacing-*` in `@theme inline`. To adjust a spacing globally, change the single `--explore-*` value.

**Rule:** When editing an explore component, use semantic tokens, not raw values. If `gap-3` or `p-4` appears in an explore file, it should be `gap-element` or `p-card`.

## Change propagation — scenario-driven workflow

When tweaking details during a scenario walkthrough (`01-research/06-explore-scenario.md`):

1. **Spacing/padding change** → Update the token in `globals.css`. All components using that token update automatically.
2. **Component-level change** (answer text, result type, suggestion text) → Update `mock-conversations.ts` first, then update the matching Storybook story fixture.
3. **Structural/layout change** → Update the component, verify in Storybook, verify in the scenario.

The scenario document describes the intended user experience. When it conflicts with the implementation, the scenario is right and the code should change.

### Single source of truth chain

```
globals.css (tokens) → components (use tokens) → Storybook stories (import from fixtures) → mock-conversations.ts (conversation data)
```

- **Spacing:** `globals.css` → all components
- **Conversation data:** `mock-conversations.ts` → `explore-fixtures.ts` → Storybook stories
- **Radius:** `globals.css` (`--radius`) → computed scales → components
- **Colors:** `globals.css` (oklch custom properties) → Tailwind tokens → components

## Deployment

- **App**: Deployed on Vercel (auto-deploys from `main`)
- **Storybook**: Hosted on Chromatic — auto-deploys on push to `main` via GitHub Action. For manual deploys:
  ```
  npx chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
  ```

## Important
- This is a portfolio piece — visual polish matters more than feature count
- Two views done beautifully beats five views done roughly
- When in doubt, go for the cleaner, simpler option
- Desktop-first is fine
- **Every design choice should be defensible** — traced back to the persona, their jobs, and the company strategy
- **Never commit tokens, secrets, or API keys to the repository.** This is a public repo. Store secrets in GitHub Secrets or environment variables only. Use `${{ secrets.* }}` in GitHub Actions and `$ENV_VAR` in documentation.
