export type ResultType = "table" | "stat" | "bar-chart";

export interface StatResult {
  label: string;
  value: string | number;
  detail?: string;
}

export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

export interface TableResult {
  columns: string[];
  rows: Record<string, unknown>[];
}

export type ResultData = StatResult[] | BarChartItem[] | TableResult;

export interface ExchangeResponse {
  answer: string;
  sql: string;
  resultType: ResultType;
  resultData: ResultData;
}

export interface Exchange {
  id: string;
  question: string;
  response: ExchangeResponse | null; // null while "thinking"
  timestamp: number;
}

export interface ConversationState {
  exchanges: Exchange[];
  isThinking: boolean;
  suggestions: string[];
  accessedFields: string[];
}

export type ConversationAction =
  | { type: "ADD_EXCHANGE"; exchange: Exchange }
  | { type: "RESOLVE_LATEST"; response: ExchangeResponse; accessedFields: string[] }
  | { type: "UPDATE_SUGGESTIONS"; suggestions: string[] };

export interface MockExchange {
  triggers: string[];
  question: string;
  response: {
    answer: string;
    sql: string;
    resultType: ResultType;
    computeResult: (
      data: Record<string, unknown>[],
      relatedData?: Record<string, Record<string, unknown>[]>
    ) => ResultData;
    accessedFields: string[];
  };
}

export interface ConversationScript {
  tableName: string;
  exchanges: MockExchange[];
  suggestions: string[];
}
