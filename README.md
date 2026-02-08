# dlt explorer

A lightweight catalog viewer for [dlt](https://dlthub.com) datasets. Point it at your dlt pipeline output and get a browsable overview of your data — schema, sample rows, relationships between tables.

## What it does

- Groups related dlt tables into entities (e.g. `issues`, `issues__labels`, `issues__assignees` become one card)
- Shows AI-generated descriptions so you can scan what each dataset contains
- Smart field ordering — identity fields first, infrastructure IDs and URLs last
- Schema view with friendly type labels (text, number, date instead of VARCHAR, BIGINT, TIMESTAMP)
- Data preview with the first 50 rows per table

## Quick start

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Using your own data

The explorer reads static JSON from `public/data/`. To use it with your own dlt pipeline:

1. Run your dlt pipeline (any source, any destination that supports DuckDB)
2. Export the data using the included export script, or generate the JSON files yourself:
   - `catalog.json` — table names, columns, row counts
   - `metadata.json` — pipeline name, source, last loaded timestamp
   - `table_[name].json` — sample rows per table (up to 50)
3. Optionally generate `descriptions.json` and `field_config.json` to customize descriptions and field ordering for your dataset

See [CUSTOMIZATION.md](CUSTOMIZATION.md) for details on how to generate these files — including instructions an LLM can follow to create them from your schema.

## How it works

No runtime API calls, no live database connection. A dlt pipeline loads data into DuckDB, a script exports it as static JSON, and Next.js renders it. The catalog is rendered output, like `df.head()` in a notebook.

## Built with

Next.js, Shadcn UI, Tailwind CSS.
