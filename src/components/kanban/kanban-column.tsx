"use client";

import { memo } from "react";
import { UiCard } from "@/components/ui/card";
import { UiStack } from "@/components/ui/stack";
import { WORKFLOW_COLUMN_SUBTITLE, type ColumnId } from "@/constants/workflow";
import { BoardTaskCard } from "@/components/kanban/board-task-card";

export type KanbanColumnProps = {
  columnId: ColumnId;
  title: string;
  taskIds: string[];
  onOpenDetail: (taskId: string) => void;
};

function KanbanColumnInner({ columnId, title, taskIds, onOpenDetail }: KanbanColumnProps) {
  return (
    <UiCard
      id={`kanban-column-${columnId}`}
      className="flex min-h-0 min-w-0 flex-1 flex-col border-neutral-800 bg-neutral-950/60"
    >
      <UiStack gap="sm" className="flex min-h-0 flex-1 flex-col overflow-hidden p-3">
        <header className="shrink-0 border-b border-neutral-800 pb-2">
          <h2 className="text-sm font-semibold text-neutral-100">
            {title} <span className="font-normal text-neutral-500">({taskIds.length})</span>
          </h2>
          <p className="mt-0.5 text-[11px] text-neutral-500">
            {WORKFLOW_COLUMN_SUBTITLE[columnId]}
          </p>
        </header>
        <ul
          className="min-h-0 flex-1 list-none space-y-2.5 overflow-y-auto overflow-x-visible pb-6 pl-0 pr-1 pt-0.5"
          aria-label={`${title} tasks`}
        >
          {taskIds.map((id) => (
            <li key={id} className="overflow-visible">
              <BoardTaskCard taskId={id} onOpenDetail={onOpenDetail} />
            </li>
          ))}
        </ul>
      </UiStack>
    </UiCard>
  );
}

export const KanbanColumn = memo(KanbanColumnInner);
