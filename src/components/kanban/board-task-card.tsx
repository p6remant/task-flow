"use client";

import { memo, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { MoreHorizontal, User } from "lucide-react";
import { UiBadge } from "@/components/ui/badge";
import { UiDropdownMenu, UiMenuButton } from "@/components/ui/dropdown-menu";
import { UiIconButton } from "@/components/ui/icon-button";
import { ISSUE_TYPE_DOT_CLASS, ISSUE_TYPE_LABELS } from "@/constants/issue-type";
import { COLUMN_STATUS_LABELS, WORKFLOW_UI_BADGE_VARIANT } from "@/constants/workflow";
import { cn } from "@/lib/cn";
import { notifyIssueDeleted } from "@/lib/issue-toasts";
import { useBoardStore } from "@/store/board-store";
import { MoveTaskMenu } from "@/components/kanban/move-task-menu";

export type BoardTaskCardProps = {
  taskId: string;
  onOpenDetail: (taskId: string) => void;
};

export const BoardTaskCard = memo(function BoardTaskCard({
  taskId,
  onOpenDetail,
}: BoardTaskCardProps) {
  const { task, deleteTask } = useBoardStore(
    useShallow((state) => ({
      task: state.tasksById[taskId],
      deleteTask: state.deleteTask,
    })),
  );

  const handleOpenDetail = useCallback(() => {
    onOpenDetail(taskId);
  }, [onOpenDetail, taskId]);

  const handleDeleteIssue = useCallback(
    (closeDropdown: () => void) => {
      if (!task) return;

      const issueNumber = task.issueNumber;
      deleteTask(taskId);
      closeDropdown();
      notifyIssueDeleted(issueNumber);
    },
    [task, taskId, deleteTask],
  );

  if (!task) return null;

  return (
    <article
      className="rounded-lg border border-neutral-800 bg-neutral-950/90 p-3 shadow-sm"
      aria-label={task.title}
    >
      <header className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "size-2.5 shrink-0 rounded-full ring-2 ring-neutral-800",
              ISSUE_TYPE_DOT_CLASS[task.issueType],
            )}
            aria-hidden
          />
          <span className="truncate text-xs text-neutral-400">
            {task.projectKey} #{task.issueNumber}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <MoveTaskMenu taskId={taskId} currentColumnId={task.columnId} />

          <UiDropdownMenu
            align="end"
            trigger={
              <UiIconButton aria-label="More actions">
                <MoreHorizontal className="size-4" aria-hidden />
              </UiIconButton>
            }
          >
            {(close) => (
              <UiMenuButton danger onClick={() => handleDeleteIssue(close)}>
                Delete issue
              </UiMenuButton>
            )}
          </UiDropdownMenu>

          <div
            className="flex size-7 items-center justify-center rounded-full bg-neutral-800 ring-1 ring-neutral-700"
            aria-hidden
          >
            <User className="size-4 text-neutral-500" />
          </div>
        </div>
      </header>

      <button
        type="button"
        className={cn(
          "mt-2 mb-5 w-full cursor-pointer text-left text-sm font-medium text-neutral-100 transition-colors",
          "hover:text-sky-400 hover:underline hover:decoration-sky-400/80 hover:underline-offset-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
        )}
        onClick={handleOpenDetail}
      >
        {task.title}
      </button>

      <footer className="flex flex-wrap gap-1.5">
        <UiBadge variant={task.issueType}>{ISSUE_TYPE_LABELS[task.issueType]}</UiBadge>
        <UiBadge variant={WORKFLOW_UI_BADGE_VARIANT[task.columnId]}>
          {COLUMN_STATUS_LABELS[task.columnId]}
        </UiBadge>
      </footer>
    </article>
  );
});
