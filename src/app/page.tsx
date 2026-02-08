import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, Table2 } from "lucide-react";
import { RefreshButton } from "@/components/refresh-button";
import type { CatalogTable, Metadata } from "@/lib/types";
import { getDescriptions } from "@/lib/field-config";

async function getCatalog(): Promise<CatalogTable[]> {
  const filePath = path.join(process.cwd(), "public/data/catalog.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

async function getMetadata(): Promise<Metadata> {
  const filePath = path.join(process.cwd(), "public/data/metadata.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

interface EntityGroup {
  parent: CatalogTable;
  children: CatalogTable[];
}

function groupByEntity(tables: CatalogTable[]): EntityGroup[] {
  const mainTables = tables.filter(
    (t) => !t.table_name.startsWith("_dlt_") && !t.table_name.includes("__")
  );
  const childTables = tables.filter(
    (t) => !t.table_name.startsWith("_dlt_") && t.table_name.includes("__")
  );

  return mainTables.map((parent) => ({
    parent,
    children: childTables
      .filter((c) => c.table_name.startsWith(parent.table_name + "__"))
      .sort((a, b) => b.row_count - a.row_count),
  }));
}

function formatEntityName(name: string): string {
  return name.replace(/_/g, " ");
}

function formatChildName(tableName: string): string {
  const parts = tableName.split("__");
  return parts.slice(1).join(" / ").replace(/_/g, " ");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function rowCountLabel(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return count.toLocaleString();
}

function fieldCountLabel(count: number): string {
  return `${count} ${count === 1 ? "field" : "fields"}`;
}

export default async function CatalogPage() {
  const [catalog, metadata, descriptions] = await Promise.all([
    getCatalog(),
    getMetadata(),
    getDescriptions(),
  ]);

  const entities = groupByEntity(catalog);
  const totalRows = catalog
    .filter((t) => !t.table_name.startsWith("_dlt_"))
    .reduce((sum, t) => sum + t.row_count, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="mx-auto max-w-6xl px-6 py-12 w-full flex-1">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground capitalize">
            {metadata.dataset_name.replace(/_/g, " ")}
          </h1>
          <div className="flex items-baseline justify-between gap-4 mt-2">
            <p className="text-sm text-muted-foreground">
              {metadata.source_label ?? metadata.pipeline_name} · {entities.length} datasets · {rowCountLabel(totalRows)} records
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
              <span title={formatDate(metadata.last_loaded)}>Updated {relativeTime(metadata.last_loaded)}</span>
              <RefreshButton />
            </div>
          </div>
        </header>

        {/* Datasets */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {entities.map(({ parent, children }) => {
              const desc = descriptions[parent.table_name];
              return (
                <Card key={parent.table_name} className="overflow-hidden py-0 gap-0">
                  <CardContent className="p-0">
                    {/* Entity heading */}
                    <div className="px-6 pt-4 pb-3">
                      <Link href={`/table/${parent.table_name}`} className="flex items-center gap-2.5 mb-1 group">
                        <Folder className="h-5 w-5 text-muted-foreground/70 flex-shrink-0" />
                        <h3 className="text-lg font-semibold text-foreground capitalize group-hover:text-primary transition-colors">
                          {formatEntityName(parent.table_name)}
                        </h3>
                      </Link>
                      {desc?.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed ml-[30px]">
                          {desc.description}
                        </p>
                      )}
                      {desc?.summary && (
                        <p className="text-xs text-muted-foreground/60 ml-[30px] mt-1">
                          {desc.summary}
                        </p>
                      )}
                    </div>

                    {/* Table list */}
                    <div className="border-t pl-[30px] pt-1 pb-2">
                      {/* Parent table */}
                      <Link href={`/table/${parent.table_name}`}>
                        <div
                          className="group flex items-center gap-2.5 pr-6 py-2.5 transition-colors hover:bg-muted/30 cursor-pointer"
                          title={`${parent.row_count.toLocaleString()} records · ${fieldCountLabel(parent.columns.length)}`}
                        >
                          <Table2 className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground group-hover:text-primary font-mono">
                            {parent.table_name}
                          </span>
                          <span className="ml-auto text-xs text-muted-foreground tabular-nums flex-shrink-0">
                            {rowCountLabel(parent.row_count)}
                          </span>
                        </div>
                      </Link>

                      {/* Child tables — same indent, lighter weight */}
                      {children.map((child) => (
                        <Link
                          key={child.table_name}
                          href={`/table/${child.table_name}`}
                        >
                          <div
                            className="group flex items-center gap-2.5 pr-6 py-2.5 transition-colors hover:bg-muted/30 cursor-pointer"
                            title={child.table_name}
                          >
                            <Table2 className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                              {formatChildName(child.table_name)}
                            </span>
                            <span className="ml-auto text-xs text-muted-foreground/60 tabular-nums flex-shrink-0">
                              {rowCountLabel(child.row_count)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t text-sm text-muted-foreground">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <Link
            href="/rationale"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Design rationale
          </Link>
        </div>
      </footer>
    </div>
  );
}
