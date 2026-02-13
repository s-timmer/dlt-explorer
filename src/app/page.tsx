import Link from "next/link";
import { Home, MessageSquare, Info, BookOpen, Folder, Table2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshButton } from "@/components/refresh-button";
import { getDescriptions } from "@/lib/field-config";
import {
  getCatalog,
  getMetadata,
  groupByEntity,
  relativeTime,
  rowCountLabel,
  formatDate,
} from "@/lib/data-loaders";

function formatEntityName(name: string): string {
  return name.replace(/_/g, " ");
}

function formatChildName(tableName: string): string {
  const parts = tableName.split("__");
  return parts.slice(1).join(" / ").replace(/_/g, " ");
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

  const storybookUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:6006"
    : "https://698ef1ee455ce2c83ed99d52-hhrnlzhbnd.chromatic.com/";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Vertical sidebar icons */}
      <aside className="fixed left-0 top-0 h-screen w-10 flex flex-col items-center pt-6 gap-3 z-10">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Catalog"
        >
          <Home className="h-4 w-4" />
        </Link>
        <Link
          href="/explore"
          className="text-muted-foreground/30 hover:text-muted-foreground transition-colors"
          title="Explore datasets"
        >
          <MessageSquare className="h-4 w-4" />
        </Link>
        <Link
          href="/rationale"
          className="text-muted-foreground/30 hover:text-muted-foreground transition-colors"
          title="About this project"
        >
          <Info className="h-4 w-4" />
        </Link>
        <a
          href={storybookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground/30 hover:text-muted-foreground transition-colors"
          title="Storybook"
        >
          <BookOpen className="h-4 w-4" />
        </a>
      </aside>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-6 py-12 w-full flex-1 pl-10">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground capitalize">
            {metadata.dataset_name.replace(/_/g, " ")}
          </h1>
          <div className="flex items-baseline justify-between gap-4 mt-2">
            <p className="text-sm text-muted-foreground">
              {metadata.source_label ?? metadata.pipeline_name} ·{" "}
              {entities.length} datasets · {rowCountLabel(totalRows)} records
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
              <span title={formatDate(metadata.last_loaded)}>
                Updated {relativeTime(metadata.last_loaded)}
              </span>
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
                <Card
                  key={parent.table_name}
                  className="overflow-hidden py-0 gap-0"
                >
                  <CardContent className="p-0">
                    {/* Entity heading */}
                    <div className="px-6 pt-4 pb-3">
                      <Link
                        href={`/table/${parent.table_name}`}
                        className="flex items-center gap-2.5 mb-1 group"
                      >
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
                    <div className="border-t pl-[30px] pt-1 pb-3">
                      {/* Parent table */}
                      <Link href={`/table/${parent.table_name}`}>
                        <div
                          className="group flex items-center gap-2.5 pr-6 py-2 transition-colors hover:bg-muted/30 cursor-pointer"
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

                      {/* Child tables */}
                      {children.map((child) => (
                        <Link
                          key={child.table_name}
                          href={`/table/${child.table_name}`}
                        >
                          <div
                            className="group flex items-center gap-2.5 pr-6 py-2 transition-colors hover:bg-muted/30 cursor-pointer"
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
    </div>
  );
}
