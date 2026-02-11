"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";

interface QuestionInputProps {
  suggestions: string[];
  onSubmit: (question: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function QuestionInput({
  suggestions,
  onSubmit,
  disabled = false,
  placeholder = "Ask about this dataset…",
}: QuestionInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleSuggestionClick(suggestion: string) {
    if (disabled) return;
    onSubmit(suggestion);
  }

  return (
    <div className="flex flex-col gap-tight">
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-chip" role="group" aria-label="Suggested questions">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestionClick(s)}
              disabled={disabled}
              className="text-xs px-2.5 py-1 rounded-full bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="Ask a question about this dataset"
          className="pr-10 font-sans h-11 rounded-lg bg-card"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Send"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
