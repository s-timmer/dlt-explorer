import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import type { RunStatus } from "./types";

export const statusColors: Record<RunStatus, string> = {
  success: "text-emerald-600",
  failed: "text-red-500",
  warning: "text-amber-600",
  running: "text-blue-500",
};

export function StatusIcon({ status }: { status: RunStatus }) {
  switch (status) {
    case "success":
      return <CheckCircle2 className={`h-3.5 w-3.5 ${statusColors[status]}`} />;
    case "failed":
      return <XCircle className={`h-3.5 w-3.5 ${statusColors[status]}`} />;
    case "warning":
      return <AlertTriangle className={`h-3.5 w-3.5 ${statusColors[status]}`} />;
    case "running":
      return <Loader2 className={`h-3.5 w-3.5 ${statusColors[status]} animate-spin`} />;
  }
}
