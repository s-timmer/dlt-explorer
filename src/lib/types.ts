export interface Column {
  name: string;
  type: string;
}

export interface CatalogTable {
  table_name: string;
  columns: Column[];
  row_count: number;
}

export interface Metadata {
  pipeline_name: string;
  source_name: string;
  destination: string;
  dataset_name: string;
  last_loaded: string;
  load_id: string;
  load_status: number;
  schema_version: number;
  engine_version: number;
  pipeline_version: number;
  source_label?: string;
}
