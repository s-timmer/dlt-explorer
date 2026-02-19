import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppNav } from "@/components/app-nav";
import { getFieldConfig, fieldSortScore, getDescriptions } from "@/lib/field-config";
import {
  getCatalog,
  getTableData,
  getRelatedTableData,
} from "@/lib/data-loaders";
import { ExploreView } from "@/components/explore/explore-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const displayName = name.replace(/__/g, " › ").replace(/_/g, " ");
  return {
    title: `Explore ${displayName.charAt(0).toUpperCase() + displayName.slice(1)}`,
  };
}

export default async function ExplorePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const catalog = await getCatalog();
  const table = catalog.find((t) => t.table_name === name);

  if (!table) {
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

  const [tableData, relatedData, fieldConfig, descriptions] = await Promise.all(
    [
      getTableData(name),
      getRelatedTableData(name, catalog),
      getFieldConfig(),
      getDescriptions(),
    ]
  );

  // Get the key fields (identity + content priority fields)
  const keyFields = table.columns
    .filter((c) => !c.name.startsWith("_dlt_"))
    .sort(
      (a, b) =>
        fieldSortScore(a.name, fieldConfig) -
        fieldSortScore(b.name, fieldConfig)
    )
    .slice(0, 8)
    .map((c) => c.name);

  const descriptionObj = descriptions[name];
  const description = descriptionObj?.description ?? undefined;

  const displayName = name.replace(/__/g, " › ").replace(/_/g, " ");

  return (
    <div className="min-h-screen bg-background flex">
      <AppNav />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 w-full flex-1 sm:pl-14">
        <h1 className="sr-only">Explore {displayName}</h1>

        {/* Back link */}
        <div className="mb-4">
          <Link
            href={`/table/${name}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="capitalize">{displayName}</span>
          </Link>
        </div>

        {/* Explore view — height wrapper since ExploreView uses h-full */}
        <div className="h-[calc(100vh-8rem)]">
          <ExploreView
            table={table}
            tableData={tableData}
            relatedData={relatedData}
            description={description}
            keyFields={keyFields}
          />
        </div>
      </div>
    </div>
  );
}
