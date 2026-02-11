"use client";

import { useState, useMemo } from "react";
import type { CatalogTable, Metadata } from "@/lib/types";
import type {
  AllTableData,
  EntitySummary,
} from "@/lib/data-loaders";
import { CompactCatalog } from "./compact-catalog";
import { ExploreView } from "./explore/explore-view";

interface NotebookStreamProps {
  entities: EntitySummary[];
  allTableData: AllTableData;
  catalog: CatalogTable[];
  metadata: Metadata;
  defaultTable: string;
}

function rowCountLabel(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return count.toLocaleString();
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

export function NotebookStream({
  entities,
  allTableData,
  catalog,
  metadata,
  defaultTable,
}: NotebookStreamProps) {
  const [selectedTable, setSelectedTable] = useState(defaultTable);

  const { table, tableData, relatedData, keyFields, description } =
    useMemo(() => {
      const t = catalog.find((c) => c.table_name === selectedTable);
      if (!t) {
        return {
          table: catalog[0],
          tableData: [] as Record<string, unknown>[],
          relatedData: {} as Record<string, Record<string, unknown>[]>,
          keyFields: [] as string[],
          description: undefined as string | undefined,
        };
      }

      const bundle = allTableData[selectedTable] ?? {
        tableData: [],
        relatedData: {},
        keyFields: [],
        description: undefined,
      };

      return {
        table: t,
        tableData: bundle.tableData,
        relatedData: bundle.relatedData,
        keyFields: bundle.keyFields,
        description: bundle.description,
      };
    }, [selectedTable, catalog, allTableData]);

  const totalRows = catalog
    .filter((t) => !t.table_name.startsWith("_dlt_"))
    .reduce((sum, t) => sum + t.row_count, 0);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Metadata header */}
      <header className="mb-element">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground capitalize">
          {metadata.dataset_name.replace(/_/g, " ")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {metadata.source_label ?? metadata.pipeline_name} · {entities.length}{" "}
          datasets · {rowCountLabel(totalRows)} records ·{" "}
          <span title={new Date(metadata.last_loaded).toLocaleString()}>
            updated {relativeTime(metadata.last_loaded)}
          </span>
        </p>

        {/* Dataset selector */}
        <div className="mt-element">
          <CompactCatalog
            entities={entities}
            selectedTable={selectedTable}
            onSelect={setSelectedTable}
          />
        </div>
      </header>

      {/* Explore view — key forces remount on table switch */}
      <div className="flex-1 min-h-0">
        <ExploreView
          key={selectedTable}
          table={table}
          tableData={tableData}
          relatedData={relatedData}
          description={description}
          keyFields={keyFields}
        />
      </div>
    </div>
  );
}
