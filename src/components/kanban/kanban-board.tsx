"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useShallow } from "zustand/react/shallow";
import { Lock, Plus, Search } from "lucide-react";

import { UiButton } from "@/components/ui/button";
import { UiInput } from "@/components/ui/input";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { type IssueType } from "@/constants/issue-type";
import { COLUMN_FLOW, COLUMN_LABELS, WorkflowColumn, type ColumnId } from "@/constants/workflow";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { emptyWorkflowColumns } from "@/lib/board/empty-workflow-columns";
import { cn } from "@/lib/cn";
import { notifyIssueCreated } from "@/lib/issue-toasts";
import { plainTextFromHtml } from "@/lib/text";
import { useBoardStore } from "@/store/board-store";

const CreateIssueModal = dynamic(
  () => import("@/components/kanban/create-issue-modal").then((m) => m.CreateIssueModal),
  { ssr: false },
);

const TaskDetailDrawer = dynamic(
  () => import("@/components/kanban/task-detail-drawer").then((m) => m.TaskDetailDrawer),
  { ssr: false },
);

const BOARD_CONTAINER_CLASS = "mx-auto w-full max-w-[1400px] px-4";

function KanbanGrid({
  columns,
  onOpenTaskDetail,
}: {
  columns: Record<ColumnId, string[]>;
  onOpenTaskDetail: (taskId: string) => void;
}) {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-3 lg:items-stretch">
      {COLUMN_FLOW.map((columnId) => (
        <KanbanColumn
          key={columnId}
          columnId={columnId}
          title={COLUMN_LABELS[columnId]}
          taskIds={columns[columnId]}
          onOpenDetail={onOpenTaskDetail}
        />
      ))}
    </div>
  );
}

function FilteredKanbanGrid({
  searchQuery,
  columns,
  onOpenTaskDetail,
}: {
  searchQuery: string;
  columns: Record<ColumnId, string[]>;
  onOpenTaskDetail: (taskId: string) => void;
}) {
  const tasksById = useBoardStore(useShallow((state) => state.tasksById));

  const filteredColumns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const results = emptyWorkflowColumns();

    for (const columnId of COLUMN_FLOW) {
      results[columnId] = columns[columnId].filter((taskId) => {
        const task = tasksById[taskId];
        if (!task) return false;

        const titleText = task.title.toLowerCase();
        const descText = plainTextFromHtml(task.descriptionHtml).toLowerCase();

        return titleText.includes(query) || descText.includes(query);
      });
    }

    return results;
  }, [columns, tasksById, searchQuery]);

  return <KanbanGrid columns={filteredColumns} onOpenTaskDetail={onOpenTaskDetail} />;
}

export function KanbanBoard() {
  const [searchInput, setSearchInput] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(searchInput, 300);

  const { addTaskToBoard, workflowColumns } = useBoardStore(
    useShallow((state) => ({
      addTaskToBoard: state.addTask,
      workflowColumns: state.columns,
    })),
  );

  const isFilteringActive = debouncedSearch.trim().length > 0;

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  }, []);

  const handleOpenCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const handleCloseCreateModal = useCallback(() => setIsCreateModalOpen(false), []);
  const handleOpenTaskDetail = useCallback((taskId: string) => setSelectedTaskId(taskId), []);
  const handleCloseTaskDetail = useCallback(() => setSelectedTaskId(null), []);

  const handleCreateTask = useCallback(
    (payload: { title: string; descriptionHtml: string; issueType: IssueType }) => {
      addTaskToBoard(WorkflowColumn.Backlog, payload);

      const lastIssueNumber = useBoardStore.getState().nextIssueNumber - 1;
      notifyIssueCreated(lastIssueNumber);
    },
    [addTaskToBoard],
  );

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-slate-950 text-slate-100">
      <header className="shrink-0 border-b border-neutral-800 bg-neutral-950/90 py-3">
        <div
          className={cn(
            BOARD_CONTAINER_CLASS,
            "flex items-center gap-2 text-sm font-semibold text-neutral-100",
          )}
        >
          <Lock className="size-4 text-neutral-500" aria-hidden />
          Project Development
        </div>
      </header>

      <section className="shrink-0 border-b border-neutral-800 bg-neutral-950 py-3">
        <div
          className={cn(BOARD_CONTAINER_CLASS, "flex flex-col gap-3 sm:flex-row sm:items-stretch")}
        >
          <div className="relative min-h-10 min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
              aria-hidden
            />
            <UiInput
              aria-label="Search tasks"
              className="border-neutral-700 pl-9"
              placeholder="Search by keyword or by field"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>

          <UiButton onClick={handleOpenCreateModal}>
            <Plus className="size-4" aria-hidden />
            Create issue
          </UiButton>
        </div>
      </section>

      <main className={cn(BOARD_CONTAINER_CLASS, "flex min-h-0 flex-1 flex-col pb-4 pt-3")}>
        {isFilteringActive ? (
          <FilteredKanbanGrid
            searchQuery={debouncedSearch}
            columns={workflowColumns}
            onOpenTaskDetail={handleOpenTaskDetail}
          />
        ) : (
          <KanbanGrid columns={workflowColumns} onOpenTaskDetail={handleOpenTaskDetail} />
        )}
      </main>

      {isCreateModalOpen && (
        <CreateIssueModal
          open={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onSubmit={handleCreateTask}
        />
      )}

      {selectedTaskId && (
        <TaskDetailDrawer
          taskId={selectedTaskId}
          open={!!selectedTaskId}
          onClose={handleCloseTaskDetail}
        />
      )}
    </div>
  );
}
