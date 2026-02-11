"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExchangeCell } from "./exchange-cell";
import type { Exchange } from "@/lib/explore-types";

interface ConversationThreadProps {
  exchanges: Exchange[];
}

export function ConversationThread({ exchanges }: ConversationThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [exchanges.length]);

  if (exchanges.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="text-sm text-muted-foreground/80 leading-relaxed">
            Explore this dataset by asking questions in natural language.
            Results will appear here as charts, tables, and stats.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col py-card" role="log" aria-live="polite" aria-label="Conversation history">
        {exchanges.map((exchange, i) => (
          <div
            key={exchange.id}
            className={`py-card ${i < exchanges.length - 1 ? "border-b border-border/50" : ""}`}
          >
            <ExchangeCell exchange={exchange} />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
