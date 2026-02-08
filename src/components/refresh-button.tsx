"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { refreshPipeline } from "@/app/actions";

export function RefreshButton() {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await refreshPipeline();
      if (!result.ok) {
        console.error("Pipeline refresh failed:", result.error);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="inline-flex items-center gap-1.5 text-muted-foreground/60 hover:text-foreground transition-colors disabled:opacity-50"
      title={pending ? "Refreshing data…" : "Re-run pipeline and refresh data"}
    >
      <RefreshCw
        className={`h-3.5 w-3.5 ${pending ? "animate-spin" : ""}`}
      />
      {pending && <span className="text-xs">Refreshing…</span>}
    </button>
  );
}
