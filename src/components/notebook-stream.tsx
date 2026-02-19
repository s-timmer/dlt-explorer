"use client";

import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
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
}: NotebookStreamProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Derive data for the selected table
  const selectedData = useMemo(() => {
    if (!selectedTable) return null;

    const t = catalog.find((c) => c.table_name === selectedTable);
    if (!t) return null;

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

  // Find entity summary for the selected table (for record count in context bar)
  const selectedEntity = selectedTable
    ? entities.find((e) => e.tableName === selectedTable)
    : null;

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      {/* Metadata header — always visible */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground capitalize">
          {metadata.dataset_name.replace(/_/g, " ")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {metadata.source_label ?? metadata.pipeline_name} · {entities.length}{" "}
          datasets · {rowCountLabel(totalRows)} records ·{" "}
          <span
            title={new Date(metadata.last_loaded).toLocaleString("en-US")}
            suppressHydrationWarning
          >
            updated {relativeTime(metadata.last_loaded)}
          </span>
        </p>
      </header>

      {selectedTable === null || !selectedData ? (
        /* Phase 1 — Browse: show dataset cards */
        <div className="flex-1">
          <CompactCatalog
            entities={entities}
            onSelect={setSelectedTable}
          />
        </div>
      ) : (
        /* Phase 2 — Explore: context bar + conversation */
        <>
          {/* Context bar */}
          <button
            onClick={() => setSelectedTable(null)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-element cursor-pointer self-start"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="capitalize">
              {selectedTable.replace(/_/g, " ")}
            </span>
            {selectedEntity && (
              <span className="text-muted-foreground/60">
                · {rowCountLabel(selectedEntity.rowCount)} records
              </span>
            )}
          </button>

          {/* Explore view — key forces remount on table switch */}
          <div className="flex-1 min-h-0">
            <ExploreView
              key={selectedTable}
              table={selectedData.table}
              tableData={selectedData.tableData}
              relatedData={selectedData.relatedData}
              description={selectedData.description}
              keyFields={selectedData.keyFields}
            />
          </div>
        </>
      )}
    </div>
  );
}
