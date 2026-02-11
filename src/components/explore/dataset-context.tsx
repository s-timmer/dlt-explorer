"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Database, ChevronDown } from "lucide-react";
import type { CatalogTable } from "@/lib/types";

interface DatasetContextProps {
  table: CatalogTable;
  description?: string;
  keyFields: string[];
  accessedFields?: string[];
}

export function DatasetContext({
  table,
  description,
  keyFields,
  accessedFields = [],
}: DatasetContextProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tableName = table.table_name
    .replace(/__/g, " › ")
    .replace(/_/g, " ");

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between px-1 py-2 cursor-pointer">
          <div className="flex items-center gap-tight">
            <Database className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-sm font-medium capitalize text-muted-foreground">{tableName}</span>
            <span className="text-xs text-muted-foreground/60">
              · {(table.row_count ?? 0).toLocaleString()} records · {(table.columns?.length ?? 0)} fields
            </span>
          </div>
          <ChevronDown
            className={`h-3 w-3 text-muted-foreground/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-1 py-2 border-t border-border/50 text-sm">
          {description && (
            <p className="text-muted-foreground mb-2">{description}</p>
          )}
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Key fields
            </span>
            <div className="flex flex-wrap gap-chip mt-1">
              {keyFields.map((field) => {
                const isAccessed = accessedFields.includes(field);
                return (
                  <span
                    key={field}
                    className={`text-xs font-mono px-2 py-0.5 rounded-md border ${
                      isAccessed
                        ? "bg-chart-1/10 border-chart-1/30 text-foreground"
                        : "bg-muted/30 border-border text-muted-foreground"
                    }`}
                  >
                    {field}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
