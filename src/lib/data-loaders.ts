import fs from "fs/promises";
import path from "path";
import type { CatalogTable, Metadata } from "./types";
import { getFieldConfig, fieldSortScore } from "./field-config";

// ─── Single-table loaders ────────────────────────────────────────

export async function getCatalog(): Promise<CatalogTable[]> {
  const filePath = path.join(process.cwd(), "public/data/catalog.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function getMetadata(): Promise<Metadata> {
  const filePath = path.join(process.cwd(), "public/data/metadata.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function getTableData(
  name: string
): Promise<Record<string, unknown>[]> {
  try {
    const filePath = path.join(
      process.cwd(),
      `public/data/table_${name}.json`
    );
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function getRelatedTableData(
  name: string,
  catalog: CatalogTable[]
): Promise<Record<string, Record<string, unknown>[]>> {
  const related: Record<string, Record<string, unknown>[]> = {};

  const children = catalog.filter(
    (t) =>
      t.table_name.startsWith(name + "__") &&
      !t.table_name.startsWith("_dlt_")
  );

  for (const child of children) {
    try {
      const filePath = path.join(
        process.cwd(),
        `public/data/table_${child.table_name}.json`
      );
      const data = await fs.readFile(filePath, "utf-8");
      related[child.table_name] = JSON.parse(data);
    } catch {
      // Skip if file doesn't exist
    }
  }

  return related;
}

// ─── Bulk loader ─────────────────────────────────────────────────

export interface TableDataBundle {
  tableData: Record<string, unknown>[];
  relatedData: Record<string, Record<string, unknown>[]>;
  keyFields: string[];
  description?: string;
}

export type AllTableData = Record<string, TableDataBundle>;

/** Load data for all main entities (non-_dlt_, non-child) in parallel */
export async function loadAllTableData(
  catalog: CatalogTable[],
  descriptions: Record<string, { description: string; summary?: string }>
): Promise<AllTableData> {
  const mainTables = catalog.filter(
    (t) => !t.table_name.startsWith("_dlt_") && !t.table_name.includes("__")
  );

  const fieldConfig = await getFieldConfig();

  const entries = await Promise.all(
    mainTables.map(async (table) => {
      const [tableData, relatedData] = await Promise.all([
        getTableData(table.table_name),
        getRelatedTableData(table.table_name, catalog),
      ]);

      const keyFields = table.columns
        .filter((c) => !c.name.startsWith("_dlt_"))
        .sort(
          (a, b) =>
            fieldSortScore(a.name, fieldConfig) -
            fieldSortScore(b.name, fieldConfig)
        )
        .slice(0, 8)
        .map((c) => c.name);

      const description =
        descriptions[table.table_name]?.description ?? undefined;

      return [
        table.table_name,
        { tableData, relatedData, keyFields, description },
      ] as const;
    })
  );

  return Object.fromEntries(entries);
}

// ─── Entity grouping ─────────────────────────────────────────────

export interface EntitySummary {
  tableName: string;
  displayName: string;
  description?: string;
  rowCount: number;
  fieldCount: number;
  childCount: number;
}

interface EntityGroup {
  parent: CatalogTable;
  children: CatalogTable[];
}

export function groupByEntity(tables: CatalogTable[]): EntityGroup[] {
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

/** Convert entity groups into compact summaries for the selector */
export function entitiesToSummaries(
  groups: EntityGroup[],
  descriptions: Record<string, { description: string; summary?: string }>
): EntitySummary[] {
  return groups.map(({ parent, children }) => ({
    tableName: parent.table_name,
    displayName: parent.table_name.replace(/_/g, " "),
    description: descriptions[parent.table_name]?.description,
    rowCount: parent.row_count,
    fieldCount: parent.columns.length,
    childCount: children.length,
  }));
}

// ─── Formatting helpers ──────────────────────────────────────────

export function rowCountLabel(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return count.toLocaleString();
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
