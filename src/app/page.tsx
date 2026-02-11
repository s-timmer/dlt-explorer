import Link from "next/link";
import { getDescriptions } from "@/lib/field-config";
import {
  getCatalog,
  getMetadata,
  loadAllTableData,
  groupByEntity,
  entitiesToSummaries,
} from "@/lib/data-loaders";
import { NotebookStream } from "@/components/notebook-stream";

export default async function HomePage() {
  const [catalog, metadata, descriptions] = await Promise.all([
    getCatalog(),
    getMetadata(),
    getDescriptions(),
  ]);

  const entityGroups = groupByEntity(catalog);
  const entities = entitiesToSummaries(entityGroups, descriptions);
  const allTableData = await loadAllTableData(catalog, descriptions);

  // Default to "issues" if it exists, otherwise first entity
  const defaultTable =
    entities.find((e) => e.tableName === "issues")?.tableName ??
    entities[0]?.tableName ??
    "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="mx-auto max-w-4xl px-6 py-6 w-full flex-1">
        <NotebookStream
          entities={entities}
          allTableData={allTableData}
          catalog={catalog}
          metadata={metadata}
          defaultTable={defaultTable}
        />
      </div>

      {/* Footer */}
      <footer className="border-t text-sm text-muted-foreground">
        <div className="mx-auto max-w-4xl px-6 py-6 flex gap-4">
          <Link
            href="/rationale"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About this project
          </Link>
          <span className="text-border">/</span>
          <a
            href="http://localhost:6006"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Storybook
          </a>
        </div>
      </footer>
    </div>
  );
}
