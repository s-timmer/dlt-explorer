import Link from "next/link";
import { Home, MessageSquare, Info, BookOpen } from "lucide-react";
import { getDescriptions } from "@/lib/field-config";
import {
  getCatalog,
  getMetadata,
  loadAllTableData,
  groupByEntity,
  entitiesToSummaries,
} from "@/lib/data-loaders";
import { NotebookStream } from "@/components/notebook-stream";

export const metadata = {
  title: "Explore datasets",
};

export default async function ExploreLandingPage() {
  const [catalog, pipelineMetadata, descriptions] = await Promise.all([
    getCatalog(),
    getMetadata(),
    getDescriptions(),
  ]);

  const entityGroups = groupByEntity(catalog);
  const entities = entitiesToSummaries(entityGroups, descriptions);
  const allTableData = await loadAllTableData(catalog, descriptions);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Vertical sidebar icons */}
      <aside className="fixed left-0 top-0 h-screen w-10 flex flex-col items-center pt-6 gap-3 z-10">
        <Link
          href="/"
          className="text-muted-foreground/30 hover:text-muted-foreground transition-colors"
          title="Catalog"
        >
          <Home className="h-4 w-4" />
        </Link>
        <Link
          href="/explore"
          className="text-muted-foreground hover:text-foreground transition-colors"
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
        {isDev && (
          <a
            href="http://localhost:6006"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/30 hover:text-muted-foreground transition-colors"
            title="Storybook"
          >
            <BookOpen className="h-4 w-4" />
          </a>
        )}
      </aside>

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-6 py-6 w-full pl-10">
        <NotebookStream
          entities={entities}
          allTableData={allTableData}
          catalog={catalog}
          metadata={pipelineMetadata}
        />
      </div>
    </div>
  );
}
