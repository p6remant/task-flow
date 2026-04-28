"use client";

import toast from "react-hot-toast";

export function notifyIssueCreated(issueNumber: number) {
  toast.success(`Issue(#${issueNumber}) created!`);
}

export function notifyIssueUpdated(issueNumber: number) {
  toast.success(`Issue(#${issueNumber}) updated!`);
}

export function notifyIssueDeleted(issueNumber: number) {
  toast.success(`Issue(#${issueNumber}) deleted!`);
}
