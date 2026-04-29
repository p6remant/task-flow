import type { ColumnId } from "@/constants/workflow";
import { COLUMN_FLOW } from "@/constants/workflow";

export function emptyWorkflowColumns(): Record<ColumnId, string[]> {
  return COLUMN_FLOW.reduce(
    (acc, id) => {
      acc[id] = [];
      return acc;
    },
    {} as Record<ColumnId, string[]>,
  );
}
