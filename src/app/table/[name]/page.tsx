import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CatalogTable } from "@/lib/types";

async function getFullCatalog(): Promise<CatalogTable[]> {
  const filePath = path.join(process.cwd(), "public/data/catalog.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

function getRelatedTables(
  name: string,
  catalog: CatalogTable[]
): { parent: CatalogTable | null; children: CatalogTable[]; siblings: CatalogTable[] } {
  const isChild = name.includes("__") && !name.startsWith("_dlt_");
  const parentName = isChild ? name.split("__")[0] : null;

  const parent = parentName
    ? catalog.find((t) => t.table_name === parentName) ?? null
    : null;

  const children = catalog
    .filter((t) => t.table_name.startsWith(name + "__"))
    .sort((a, b) => b.row_count - a.row_count);

  const siblings = parentName
    ? catalog
        .filter(
          (t) =>
            t.table_name.startsWith(parentName + "__") &&
            t.table_name !== name
        )
        .sort((a, b) => b.row_count - a.row_count)
    : [];

  return { parent, children, siblings };
}

async function getTableData(
  name: string
): Promise<Record<string, unknown>[]> {
  const filePath = path.join(process.cwd(), `public/data/table_${name}.json`);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function formatTableName(name: string): string {
  return name
    .replace(/^_dlt_/, "dlt: ")
    .replace(/__/g, " / ")
    .replace(/_/g, " ");
}

function rowCountLabel(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return count.toLocaleString();
}

const friendlyTypes: Record<string, string> = {
  VARCHAR: "text",
  BIGINT: "number",
  DOUBLE: "number",
  BOOLEAN: "boolean",
  "TIMESTAMP WITH TIME ZONE": "date",
};

function friendlyType(dbType: string): string {
  return friendlyTypes[dbType] ?? dbType.toLowerCase();
}

const typeColors: Record<string, string> = {
  text: "bg-blue-50 text-blue-700 border-blue-200",
  number: "bg-amber-50 text-amber-700 border-amber-200",
  boolean: "bg-emerald-50 text-emerald-700 border-emerald-200",
  date: "bg-violet-50 text-violet-700 border-violet-200",
};

function typeBadgeClass(dbType: string): string {
  return typeColors[friendlyType(dbType)] ?? "bg-gray-50 text-gray-700 border-gray-200";
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function formatRelatedName(tableName: string): string {
  const parts = tableName.split("__");
  return parts.slice(1).join(" / ").replace(/_/g, " ");
}

function fieldSortScore(name: string): number {
  // Identity fields first
  const leaf = name.includes("__") ? name.split("__").pop()! : name;
  if (["number", "title", "name", "login", "state", "status"].includes(leaf))
    return 0;
  // Key content
  if (["body", "description", "message", "created_at", "updated_at", "closed_at", "merged_at"].includes(leaf))
    return 1;
  // ID/infrastructure fields — deprioritized
  if (leaf === "id" || leaf === "node_id" || leaf === "gravatar_id" || leaf === "user_view_type")
    return 8;
  // URL fields — deprioritized
  if (name.endsWith("_url") || name === "url" || name.endsWith("__url"))
    return 7;
  // Nested user-readable fields (e.g. user__login but not user__id)
  if (name.includes("__"))
    return 4;
  // Everything else — general fields
  return 3;
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max) + "…";
}

export default async function TableDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const [fullCatalog, rows] = await Promise.all([
    getFullCatalog(),
    getTableData(name),
  ]);

  const catalog = fullCatalog.find((t) => t.table_name === name) ?? null;
  const related = getRelatedTables(name, fullCatalog);

  if (!catalog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Dataset not found
          </h1>
          <p className="text-muted-foreground mb-4">
            No dataset named &ldquo;{name}&rdquo; exists in the catalog.
          </p>
          <Link href="/" className="text-primary underline underline-offset-4">
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  const displayName = formatTableName(name);
  const visibleColumns = catalog.columns
    .filter((col) => !col.name.startsWith("_dlt_"))
    .sort((a, b) => fieldSortScore(a.name) - fieldSortScore(b.name));
  const dltColumns = catalog.columns.filter((col) =>
    col.name.startsWith("_dlt_")
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Catalog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{displayName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground capitalize mb-1">
            {displayName}
          </h1>
          {name.includes("__") && (
            <p className="text-sm font-mono text-muted-foreground mb-4">
              {name}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
            <span>
              <span className="text-2xl font-semibold text-foreground tabular-nums">
                {rowCountLabel(catalog.row_count)}
              </span>{" "}
              records
            </span>
            <Separator orientation="vertical" className="h-5" />
            <span>
              <span className="text-2xl font-semibold text-foreground tabular-nums">
                {catalog.columns.length}
              </span>{" "}
              fields
            </span>
          </div>
        </header>

        {/* Related tables */}
        {(related.parent || related.children.length > 0 || related.siblings.length > 0) && (
          <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {related.parent && (
              <span className="text-muted-foreground">
                Part of{" "}
                <Link
                  href={`/table/${related.parent.table_name}`}
                  className="font-medium text-foreground hover:underline underline-offset-2"
                >
                  {formatTableName(related.parent.table_name)}
                </Link>
              </span>
            )}
            {related.children.length > 0 && (
              <span className="text-muted-foreground">
                Related datasets:{" "}
                {related.children.map((child, i) => (
                  <span key={child.table_name}>
                    {i > 0 && ", "}
                    <Link
                      href={`/table/${child.table_name}`}
                      className="text-foreground hover:underline underline-offset-2"
                    >
                      {formatRelatedName(child.table_name)}
                    </Link>
                    <span className="text-muted-foreground/60 font-mono text-xs ml-1">
                      {rowCountLabel(child.row_count)}
                    </span>
                  </span>
                ))}
              </span>
            )}
            {related.siblings.length > 0 && (
              <span className="text-muted-foreground">
                See also:{" "}
                {related.siblings.map((sib, i) => (
                  <span key={sib.table_name}>
                    {i > 0 && ", "}
                    <Link
                      href={`/table/${sib.table_name}`}
                      className="text-foreground hover:underline underline-offset-2"
                    >
                      {formatRelatedName(sib.table_name)}
                    </Link>
                  </span>
                ))}
              </span>
            )}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="schema" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="schema">Schema</TabsTrigger>
            <TabsTrigger value="data">
              Data preview
              {rows.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {rows.length} records
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Schema tab */}
          <TabsContent value="schema">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Field name</TableHead>
                    <TableHead className="w-56">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleColumns.map((col, i) => (
                    <TableRow key={col.name}>
                      <TableCell className="text-center text-muted-foreground tabular-nums text-xs">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {col.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs ${typeBadgeClass(col.type)}`}
                        >
                          {friendlyType(col.type)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {dltColumns.length > 0 && (
                    <>
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-xs text-muted-foreground pt-6 pb-2 font-medium"
                        >
                          Pipeline metadata fields
                        </TableCell>
                      </TableRow>
                      {dltColumns.map((col, i) => (
                        <TableRow key={col.name} className="opacity-60">
                          <TableCell className="text-center text-muted-foreground tabular-nums text-xs">
                            {visibleColumns.length + i + 1}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {col.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`font-mono text-xs ${typeBadgeClass(col.type)}`}
                            >
                              {friendlyType(col.type)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Data preview tab */}
          <TabsContent value="data">
            {rows.length === 0 ? (
              <div className="rounded-lg border bg-card p-12 text-center">
                <p className="text-muted-foreground">
                  No sample data available for this dataset.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border bg-card overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.map((col) => (
                          <TableHead
                            key={col.name}
                            className="font-mono text-xs whitespace-nowrap"
                          >
                            {col.name}
                          </TableHead>
                        ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, rowIdx) => (
                      <TableRow key={rowIdx}>
                        {visibleColumns.map((col) => {
                            const raw = formatCellValue(row[col.name]);
                            const display = truncate(raw, 80);
                            return (
                              <TableCell
                                key={col.name}
                                className="font-mono text-xs whitespace-nowrap max-w-xs overflow-hidden text-ellipsis"
                                title={raw}
                              >
                                {raw === "—" ? (
                                  <span className="text-muted-foreground/40">
                                    {raw}
                                  </span>
                                ) : col.type === "BOOLEAN" ? (
                                  <Badge
                                    variant="outline"
                                    className={
                                      row[col.name] === true
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-gray-50 text-gray-500 border-gray-200"
                                    }
                                  >
                                    {raw}
                                  </Badge>
                                ) : (
                                  display
                                )}
                              </TableCell>
                            );
                          })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
