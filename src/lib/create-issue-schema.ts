import { z } from "zod";

import { ISSUE_TYPES_ZOD_TUPLE } from "@/constants/issue-type";
import { plainTextFromHtml } from "@/lib/text";

function isDescriptionEmpty(html: string): boolean {
  return plainTextFromHtml(html || "").length === 0;
}

export const createIssueSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(500, "Title must be at most 500 characters"),
  descriptionHtml: z
    .string()
    .refine((html) => !isDescriptionEmpty(html), "Description is required"),
  issueType: z.enum(ISSUE_TYPES_ZOD_TUPLE),
});

export type CreateIssueFormValues = z.infer<typeof createIssueSchema>;
