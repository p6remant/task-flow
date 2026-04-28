"use client";

import { useEffect, useState, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { MoreHorizontal, Pencil } from "lucide-react";

import { UiBadge } from "@/components/ui/badge";
import { UiButton } from "@/components/ui/button";
import { UiDrawer } from "@/components/ui/drawer";
import { UiDropdownMenu, UiMenuButton } from "@/components/ui/dropdown-menu";
import { UiIconButton } from "@/components/ui/icon-button";
import { UiInput } from "@/components/ui/input";
import { UiStack } from "@/components/ui/stack";

import { notifyIssueDeleted, notifyIssueUpdated } from "@/lib/issue-toasts";
import { plainTextFromHtml } from "@/lib/text";
import { useBoardStore } from "@/store/board-store";

import { DEFAULT_ISSUE_TYPE, ISSUE_TYPE_LABELS } from "@/constants/issue-type";
import {
  COLUMN_STATUS_LABELS,
  type ColumnId,
  WORKFLOW_UI_BADGE_VARIANT,
} from "@/constants/workflow";

import { ColumnStatusDropdown } from "@/components/kanban/column-status-dropdown";
import { CreateIssueTypeDropdown } from "@/components/kanban/create-issue-type-dropdown";
import { DescriptionWritePreview } from "@/components/kanban/description-write-preview";

export type TaskDetailDrawerProps = {
  taskId: string | null;
  open: boolean;
  onClose: () => void;
};

export function TaskDetailDrawer({ taskId, open, onClose }: TaskDetailDrawerProps) {
  const { task, updateTask, deleteTask, moveTaskToColumn } = useBoardStore(
    useShallow((state) => ({
      task: taskId ? state.tasksById[taskId] : undefined,
      updateTask: state.updateTask,
      deleteTask: state.deleteTask,
      moveTaskToColumn: state.moveTaskToColumn,
    })),
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    descriptionHtml: "",
    issueType: DEFAULT_ISSUE_TYPE,
  });

  useEffect(() => {
    if (task && open) {
      setFormData({
        title: task.title,
        descriptionHtml: task.descriptionHtml,
        issueType: task.issueType,
      });
      setIsEditing(false);
      setEditorKey((prev) => prev + 1);
    }
  }, [task, open]);

  const handleToggleEdit = useCallback(() => {
    if (isEditing) {
      setFormData({
        title: task?.title ?? "",
        descriptionHtml: task?.descriptionHtml ?? "",
        issueType: task?.issueType ?? DEFAULT_ISSUE_TYPE,
      });
      setEditorKey((prev) => prev + 1);
    }
    setIsEditing((prev) => !prev);
  }, [isEditing, task]);

  const handleSave = useCallback(() => {
    if (!taskId || !task) return;

    updateTask(taskId, {
      title: formData.title,
      descriptionHtml: formData.descriptionHtml || "<p><br></p>",
      issueType: formData.issueType,
    });

    setIsEditing(false);
    notifyIssueUpdated(task.issueNumber);
  }, [taskId, task, formData, updateTask]);

  const handleDelete = useCallback(
    (closeDropdown: () => void) => {
      if (!taskId || !task) return;

      const issueNumber = task.issueNumber;
      deleteTask(taskId);
      closeDropdown();
      onClose();
      notifyIssueDeleted(issueNumber);
    },
    [taskId, task, deleteTask, onClose],
  );

  const handleStatusChange = useCallback(
    (columnId: ColumnId) => {
      if (taskId) moveTaskToColumn(taskId, columnId);
    },
    [taskId, moveTaskToColumn],
  );

  if (!taskId || !task) return null;

  const headerTitle = (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <UiButton type="button" variant="secondary" onClick={handleToggleEdit}>
          <Pencil className="size-4" aria-hidden />
          {isEditing ? "Cancel edit" : "Edit"}
        </UiButton>

        <UiDropdownMenu
          align="end"
          trigger={
            <UiIconButton aria-label="More" className="border border-neutral-700">
              <MoreHorizontal className="size-4" aria-hidden />
            </UiIconButton>
          }
        >
          {(close) => (
            <UiMenuButton danger onClick={() => handleDelete(close)}>
              Delete issue
            </UiMenuButton>
          )}
        </UiDropdownMenu>
      </div>

      <h2 className="text-base font-semibold leading-snug text-neutral-50 sm:text-lg">
        {isEditing ? (
          <UiInput
            className="font-semibold"
            placeholder="Issue title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          />
        ) : (
          <span>
            {task.title} <span className="text-neutral-500">#{task.issueNumber}</span>
          </span>
        )}
      </h2>

      <div className="flex flex-wrap items-center gap-2">
        <UiBadge variant={WORKFLOW_UI_BADGE_VARIANT[task.columnId]}>
          {COLUMN_STATUS_LABELS[task.columnId]}
        </UiBadge>
        <UiBadge variant={task.issueType}>{ISSUE_TYPE_LABELS[task.issueType]}</UiBadge>
        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-600 px-2 py-0.5 text-xs text-neutral-400">
          {task.projectKey}
          <span className="rounded bg-neutral-800 px-1 text-[10px] text-neutral-500">Private</span>
        </span>
      </div>
    </div>
  );

  return (
    <UiDrawer open={open} onClose={onClose} title={headerTitle} maxWidthClassName="max-w-4xl">
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid gap-6 p-4 lg:min-w-0 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-8 lg:p-6">
            <main className="min-w-0 space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 text-sm text-neutral-400">
                <div className="size-8 rounded-full bg-neutral-800" />
                <div>
                  <span className="text-neutral-200">{task.authorName}</span>
                  <span className="text-neutral-500">
                    {" "}
                    · opened {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {isEditing ? (
                <UiStack gap="md">
                  <div>
                    <label
                      className="mb-1 block text-xs font-medium text-neutral-500"
                      id="task-detail-type-label"
                    >
                      Type
                    </label>
                    <CreateIssueTypeDropdown
                      value={formData.issueType}
                      onChange={(val) => setFormData((p) => ({ ...p, issueType: val }))}
                      id="task-detail-issue-type"
                      aria-labelledby="task-detail-type-label"
                    />
                  </div>
                  <DescriptionWritePreview
                    key={editorKey}
                    compact
                    dense
                    labelId="task-detail-description-label"
                    labelClassName="text-neutral-400"
                    valueHtml={formData.descriptionHtml}
                    onChange={(val) => setFormData((p) => ({ ...p, descriptionHtml: val }))}
                    placeholder="Enter description"
                  />
                  <div className="flex flex-wrap gap-2">
                    <UiButton onClick={handleSave}>Save changes</UiButton>
                    <UiButton variant="secondary" onClick={handleToggleEdit}>
                      Discard
                    </UiButton>
                  </div>
                </UiStack>
              ) : (
                <div
                  className="taskflow-md-preview text-sm text-neutral-300"
                  dangerouslySetInnerHTML={{ __html: task.descriptionHtml || "<p></p>" }}
                />
              )}

              {!isEditing && !plainTextFromHtml(task.descriptionHtml) && (
                <p className="text-sm italic text-neutral-500">No description provided.</p>
              )}
            </main>

            <aside className="min-w-0 space-y-5 lg:border-l lg:border-neutral-800 lg:pl-6">
              <section>
                <div className="mb-2 text-xs font-medium text-neutral-500">Assignees</div>
                <div className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900/50 px-2 py-2 text-sm text-neutral-200">
                  <div className="size-7 rounded-full bg-neutral-800" />
                  p6remant
                </div>
              </section>

              <section>
                <div className="mb-2 text-xs font-medium text-neutral-500">Labels</div>
                <p className="text-sm text-neutral-500">No labels</p>
              </section>

              <section className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3">
                <div className="mb-3 text-xs font-semibold text-neutral-300">
                  Project · TaskFlow
                </div>
                <UiStack gap="sm" className="text-xs">
                  <div>
                    <div className="mb-1 text-neutral-500" id="task-detail-status-label">
                      Status
                    </div>
                    <ColumnStatusDropdown
                      value={task.columnId}
                      onChange={handleStatusChange}
                      id="task-detail-column"
                      aria-labelledby="task-detail-status-label"
                    />
                  </div>
                  <div>
                    <div className="mb-1 text-neutral-500">Priority</div>
                    <UiBadge variant="urgent">High</UiBadge>
                  </div>
                </UiStack>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </UiDrawer>
  );
}
