"use server";

import { revalidatePath } from "next/cache";

export async function refreshPipeline(): Promise<{ ok: boolean; error?: string }> {
  // TODO: Pipeline refresh disabled — Turbopack cannot handle the .venv
  // symlink in ../dlt-github-loader during production builds. Re-enable
  // when running locally with `npm run dev` (which uses Turbopack dev
  // mode and doesn't hit this issue).
  revalidatePath("/");
  revalidatePath("/table/[name]", "page");
  return { ok: true };
}
