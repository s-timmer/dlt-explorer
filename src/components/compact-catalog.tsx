"use client";

import type { EntitySummary } from "@/lib/data-loaders";

interface CompactCatalogProps {
  entities: EntitySummary[];
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
  onSelect,
}: CompactCatalogProps) {
  return (
    <div
      className="flex flex-wrap gap-element"
      role="group"
      aria-label="Loaded datasets"
    >
      {entities.map((entity) => (
        <button
          key={entity.tableName}
          onClick={() => onSelect(entity.tableName)}
          className="px-4 py-3 rounded-lg cursor-pointer transition-colors text-left bg-card border border-border/50 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        >
          <span className="text-sm font-semibold capitalize block">
            {entity.displayName}
          </span>
          <span className="text-xs text-muted-foreground mt-0.5 block">
            {rowCountLabel(entity.rowCount)} records
            {entity.childCount > 0 && ` · ${entity.childCount} related`}
          </span>
        </button>
      ))}
    </div>
  );
}
