"use server";

import { exec } from "child_process";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

const LOADER_DIR = path.resolve(process.cwd(), "../dlt-github-loader");
const PYTHON = path.join(LOADER_DIR, ".venv/bin/python");
const EXPORT_DIR = path.join(LOADER_DIR, "exported");
const DATA_DIR = path.join(process.cwd(), "public/data");

function run(cmd: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd, timeout: 300_000 }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message));
      else resolve(stdout);
    });
  });
}

export async function refreshPipeline(): Promise<{ ok: boolean; error?: string }> {
  try {
    await run(`${PYTHON} github_pipeline.py`, LOADER_DIR);
    await run(`${PYTHON} export_json.py`, LOADER_DIR);

    const files = await fs.readdir(EXPORT_DIR);
    for (const file of files) {
      if (file.endsWith(".json")) {
        await fs.copyFile(
          path.join(EXPORT_DIR, file),
          path.join(DATA_DIR, file)
        );
      }
    }

    revalidatePath("/");
    revalidatePath("/table/[name]", "page");

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
