"use client";

import type { EntitySummary } from "@/lib/data-loaders";

interface CompactCatalogProps {
  entities: EntitySummary[];
  selectedTable: string;
  onSelect: (tableName: string) => void;
}

function rowCountLabel(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return count.toLocaleString();
}

export function CompactCatalog({
  entities,
  selectedTable,
  onSelect,
}: CompactCatalogProps) {
  return (
    <div
      className="flex flex-wrap gap-element"
      role="radiogroup"
      aria-label="Select a dataset"
    >
      {entities.map((entity) => {
        const isSelected = entity.tableName === selectedTable;
        return (
          <button
            key={entity.tableName}
            onClick={() => onSelect(entity.tableName)}
            role="radio"
            aria-checked={isSelected}
            className={`px-4 py-3 rounded-lg cursor-pointer transition-colors text-left ${
              isSelected
                ? "bg-card border border-border text-foreground ring-1 ring-primary/20"
                : "bg-muted/20 border border-border/50 text-muted-foreground hover:bg-muted/40"
            }`}
          >
            <span className="text-sm font-semibold capitalize block">
              {entity.displayName}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5 block">
              {rowCountLabel(entity.rowCount)} records
              {entity.childCount > 0 && ` · ${entity.childCount} related`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
