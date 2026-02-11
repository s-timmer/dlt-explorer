import type { Exchange, StatResult, BarChartItem, TableResult } from "@/lib/explore-types";
import { ThinkingIndicator } from "./thinking-indicator";
import { SqlBlock } from "./sql-block";
import { StatCard } from "./stat-card";
import { BarChart } from "./bar-chart";
import { ResultTable } from "./result-table";

interface ExchangeCellProps {
  exchange: Exchange;
}

export function ExchangeCell({ exchange }: ExchangeCellProps) {
  const { question, response } = exchange;

  return (
    <div className="flex flex-col gap-element">
      {/* Question */}
      <p className="text-sm font-semibold">{question}</p>

      {/* Response */}
      <div>
        {!response ? (
          <ThinkingIndicator />
        ) : (
          <div className="flex flex-col gap-element">
            {/* Natural language answer */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {response.answer}
            </p>

            {/* SQL block */}
            {response.sql && <SqlBlock sql={response.sql} />}

            {/* Result visualization */}
            <div className="mt-1">
              {response.resultType === "stat" && Array.isArray(response.resultData) && (
                <StatCard stats={response.resultData as StatResult[]} />
              )}
              {response.resultType === "bar-chart" && Array.isArray(response.resultData) && (
                <BarChart items={response.resultData as BarChartItem[]} />
              )}
              {response.resultType === "table" && !Array.isArray(response.resultData) && (
                <ResultTable result={response.resultData as TableResult} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
