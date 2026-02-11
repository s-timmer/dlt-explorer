"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, Code2 } from "lucide-react";

interface SqlBlockProps {
  sql: string;
  defaultOpen?: boolean;
}

export function SqlBlock({ sql, defaultOpen = false }: SqlBlockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!sql) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-chip text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1">
        <ChevronRight
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
        <Code2 className="h-3 w-3" />
        <span>SQL</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <pre className="mt-1.5 p-3 rounded-md bg-muted/50 border border-border text-xs font-mono leading-relaxed overflow-x-auto">
          <code>{sql}</code>
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
}
