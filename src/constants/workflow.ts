export const COLUMN_FLOW = ["todo", "in-progress", "done"] as const;

export type ColumnId = (typeof COLUMN_FLOW)[number];

export const WorkflowColumn = {
  Backlog: "todo",
  InProgress: "in-progress",
  Done: "done",
} as const satisfies Record<string, ColumnId>;

export const COLUMN_LABELS: Record<ColumnId, string> = {
  todo: "Backlog",
  "in-progress": "In progress",
  done: "Done",
};

export const COLUMN_STATUS_LABELS: Record<ColumnId, string> = {
  todo: "Open",
  "in-progress": "In progress",
  done: "Done",
};

export const WORKFLOW_COLUMN_SUBTITLE: Record<ColumnId, string> = {
  todo: "This item hasn't been started",
  "in-progress": "Active work in this column",
  done: "Completed items",
};

export const WORKFLOW_UI_BADGE_VARIANT: Record<ColumnId, "open" | "progress" | "done"> = {
  todo: "open",
  "in-progress": "progress",
  done: "done",
};
