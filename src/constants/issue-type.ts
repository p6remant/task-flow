export const ISSUE_TYPES = ["bug", "feature", "urgent"] as const;

export type IssueType = (typeof ISSUE_TYPES)[number];

export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  urgent: "Urgent",
  bug: "Bug",
  feature: "Feature",
};

export const DEFAULT_ISSUE_TYPE: IssueType = "bug";

export const ISSUE_TYPE_DOT_CLASS: Record<IssueType, string> = {
  urgent: "bg-orange-400",
  bug: "bg-red-400",
  feature: "bg-sky-400",
};

export const ISSUE_TYPES_ZOD_TUPLE = ISSUE_TYPES as unknown as [IssueType, IssueType, IssueType];
