import { AppNav } from "@/components/app-nav";
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

  return (
    <div className="min-h-screen bg-background flex">
      <AppNav />

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 w-full sm:pl-10">
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
