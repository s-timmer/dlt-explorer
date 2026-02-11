import type { TableResult } from "@/lib/explore-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ResultTableProps {
  result: TableResult;
}

export function ResultTable({ result }: ResultTableProps) {
  if (!result.rows || result.rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            {result.columns.map((col) => (
              <TableHead
                key={col}
                className="text-xs font-mono font-medium text-muted-foreground"
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.rows.map((row, i) => (
            <TableRow key={i}>
              {result.columns.map((col) => {
                const val = row[col];
                const isNull = val === null || val === undefined;
                return (
                  <TableCell
                    key={col}
                    className="text-sm font-mono py-2"
                  >
                    {isNull ? (
                      <span className="text-muted-foreground/50">—</span>
                    ) : (
                      String(val)
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
