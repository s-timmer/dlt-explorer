"use client";

import { useReducer, useCallback, useRef, useEffect } from "react";
import type {
  ConversationState,
  ConversationAction,
} from "@/lib/explore-types";
import type { CatalogTable } from "@/lib/types";
import {
  getConversationScript,
  matchExchange,
  getFallbackResponse,
} from "@/lib/mock-conversations";
import { DatasetContext } from "./dataset-context";
import { ConversationThread } from "./conversation-thread";
import { QuestionInput } from "./question-input";

interface ExploreViewProps {
  table: CatalogTable;
  tableData: Record<string, unknown>[];
  relatedData: Record<string, Record<string, unknown>[]>;
  description?: string;
  keyFields: string[];
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function reducer(
  state: ConversationState,
  action: ConversationAction
): ConversationState {
  switch (action.type) {
    case "ADD_EXCHANGE":
      return {
        ...state,
        isThinking: true,
        exchanges: [...state.exchanges, action.exchange],
      };
    case "RESOLVE_LATEST": {
      // Find the last exchange with null response and fill it in
      const exchanges = [...state.exchanges];
      for (let i = exchanges.length - 1; i >= 0; i--) {
        if (exchanges[i].response === null) {
          exchanges[i] = { ...exchanges[i], response: action.response };
          break;
        }
      }
      return {
        ...state,
        isThinking: false,
        exchanges,
        accessedFields: [
          ...new Set([...state.accessedFields, ...action.accessedFields]),
        ],
      };
    }
    case "UPDATE_SUGGESTIONS":
      return { ...state, suggestions: action.suggestions };
    default:
      return state;
  }
}

export function ExploreView({
  table,
  tableData,
  relatedData,
  description,
  keyFields,
}: ExploreViewProps) {
  const script = getConversationScript(table.table_name);

  const initialState: ConversationState = {
    exchanges: [],
    isThinking: false,
    suggestions: script?.suggestions ?? [],
    accessedFields: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubmit = useCallback(
    (question: string) => {
      if (state.isThinking) return;

      // Add exchange with null response (thinking state)
      dispatch({
        type: "ADD_EXCHANGE",
        exchange: {
          id: generateId(),
          question,
          response: null,
          timestamp: Date.now(),
        },
      });

      // Find matching exchange from script
      const matched = script ? matchExchange(script, question) : null;

      // Simulate AI thinking
      const delay = 800 + Math.random() * 700;

      timerRef.current = setTimeout(() => {
        if (matched) {
          const resultData = matched.response.computeResult(
            tableData,
            relatedData
          );
          dispatch({
            type: "RESOLVE_LATEST",
            response: {
              answer: matched.response.answer,
              sql: matched.response.sql,
              resultType: matched.response.resultType,
              resultData,
            },
            accessedFields: matched.response.accessedFields,
          });
        } else {
          const fallback = getFallbackResponse(
            table.table_name,
            script?.suggestions ?? []
          );
          dispatch({
            type: "RESOLVE_LATEST",
            response: {
              ...fallback,
              resultData: [],
            },
            accessedFields: [],
          });
        }
      }, delay);
    },
    [state.isThinking, script, tableData, relatedData, table.table_name]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Context header */}
      <DatasetContext
        table={table}
        description={description}
        keyFields={keyFields}
        accessedFields={state.accessedFields}
      />

      {/* Conversation thread */}
      <div className="flex-1 min-h-0 mt-card">
        <ConversationThread exchanges={state.exchanges} />
      </div>

      {/* Input area */}
      <div className="pt-card pb-2 mt-card">
        <QuestionInput
          suggestions={state.suggestions}
          onSubmit={handleSubmit}
          disabled={state.isThinking}
        />
      </div>
    </div>
  );
}
