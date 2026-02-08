import fs from "fs/promises";
import path from "path";

export interface FieldConfig {
  noise_fields: string[];
  field_priorities: {
    identity: string[];
    content: string[];
    deprioritized_ids: string[];
  };
}

let cachedConfig: FieldConfig | null = null;

export async function getFieldConfig(): Promise<FieldConfig> {
  if (cachedConfig) return cachedConfig;
  const filePath = path.join(process.cwd(), "public/data/field_config.json");
  try {
    const data = await fs.readFile(filePath, "utf-8");
    cachedConfig = JSON.parse(data);
    return cachedConfig!;
  } catch {
    // Sensible defaults when no config exists
    return {
      noise_fields: ["id"],
      field_priorities: {
        identity: ["name", "title"],
        content: ["description", "body", "created_at", "updated_at"],
        deprioritized_ids: ["id"],
      },
    };
  }
}

export function isPreviewField(name: string, config: FieldConfig): boolean {
  if (name.startsWith("_dlt_")) return false;
  if (name.endsWith("_url") || name === "url") return false;
  const leaf = name.includes("__") ? name.split("__").pop()! : name;
  if (config.noise_fields.includes(leaf)) return false;
  return true;
}

export function fieldSortScore(name: string, config: FieldConfig): number {
  const leaf = name.includes("__") ? name.split("__").pop()! : name;
  if (config.field_priorities.identity.includes(leaf)) return 0;
  if (config.field_priorities.content.includes(leaf)) return 1;
  if (config.field_priorities.deprioritized_ids.includes(leaf)) return 8;
  if (name.endsWith("_url") || name === "url" || name.endsWith("__url")) return 7;
  if (name.includes("__")) return 4;
  return 3;
}

export interface DatasetDescription {
  description: string;
  summary?: string;
}

export async function getDescriptions(): Promise<Record<string, DatasetDescription>> {
  const filePath = path.join(process.cwd(), "public/data/descriptions.json");
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}
