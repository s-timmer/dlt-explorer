import Link from "next/link";
import { Folder, Table2 } from "lucide-react";
import { AppNav } from "@/components/app-nav";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <div className="min-h-screen bg-background flex">
      <AppNav />

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 w-full flex-1 sm:pl-14">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground capitalize">
            {metadata.dataset_name.replace(/_/g, " ")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {metadata.source_label ?? metadata.pipeline_name} ·{" "}
            {entities.length} datasets · {rowCountLabel(totalRows)} records ·{" "}
            <span title={formatDate(metadata.last_loaded)}>
              updated {relativeTime(metadata.last_loaded)}
            </span>
          </p>
        </div>

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
