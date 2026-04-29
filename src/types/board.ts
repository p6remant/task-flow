export type { ColumnId } from "@/constants/workflow";
export type { IssueType } from "@/constants/issue-type";

export { COLUMN_FLOW, COLUMN_LABELS, COLUMN_STATUS_LABELS } from "@/constants/workflow";
export { ISSUE_TYPE_LABELS } from "@/constants/issue-type";

export interface Task {
  id: string;
  issueNumber: number;
  title: string;
  descriptionHtml: string;
  columnId: import("@/constants/workflow").ColumnId;
  createdAt: number;
  issueType: import("@/constants/issue-type").IssueType;
  projectKey: string;
  authorName: string;
}
