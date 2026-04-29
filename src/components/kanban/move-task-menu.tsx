"use client";

import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { ChevronDown, ListTree } from "lucide-react";
import { UiDropdownMenu, UiMenuButton } from "@/components/ui/dropdown-menu";
import { UiIconButton } from "@/components/ui/icon-button";
import { useBoardStore } from "@/store/board-store";
import { COLUMN_FLOW, COLUMN_LABELS, type ColumnId } from "@/constants/workflow";

export type MoveTaskMenuProps = {
  taskId: string;
  currentColumnId: ColumnId;
};

export function MoveTaskMenu({ taskId, currentColumnId }: MoveTaskMenuProps) {
  const { moveTaskToColumn } = useBoardStore(
    useShallow((state) => ({
      moveTaskToColumn: state.moveTaskToColumn,
    })),
  );

  const handleMoveTask = useCallback(
    (targetColumn: ColumnId, closeMenu: () => void) => {
      moveTaskToColumn(taskId, targetColumn);
      closeMenu();
    },
    [taskId, moveTaskToColumn],
  );

  return (
    <UiDropdownMenu
      align="end"
      trigger={
        <UiIconButton aria-label="Move to column">
          <ChevronDown className="size-4" aria-hidden />
        </UiIconButton>
      }
    >
      {(close) => (
        <>
          <div className="border-b border-neutral-800 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
            Move to column
          </div>

          {COLUMN_FLOW.map((columnId) => (
            <UiMenuButton
              key={columnId}
              disabled={columnId === currentColumnId}
              className="gap-2"
              onClick={() => handleMoveTask(columnId, close)}
            >
              <ListTree className="size-4 shrink-0 text-neutral-500" aria-hidden />
              {COLUMN_LABELS[columnId]}
            </UiMenuButton>
          ))}
        </>
      )}
    </UiDropdownMenu>
  );
}
