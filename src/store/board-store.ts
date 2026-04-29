import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  BOARD_PROJECT_KEY,
  BOARD_STORAGE_KEY,
  DEFAULT_TASK_AUTHOR,
  DEFAULT_UNTITLED_ISSUE,
  SEED_BOT_AUTHOR,
} from "@/constants/app-config";
import { BOARD_SEED_ISSUE_TITLES } from "@/constants/board-seed";
import { ISSUE_TYPES, type IssueType } from "@/constants/issue-type";
import { WorkflowColumn, type ColumnId } from "@/constants/workflow";
import { emptyWorkflowColumns } from "@/lib/board/empty-workflow-columns";
import type { Task } from "@/types/board";

const newTaskId = () => crypto.randomUUID();

// move task between columns
const moveId = (
  columns: Record<ColumnId, string[]>,
  sourceColumnId: ColumnId,
  destinationColumnId: ColumnId,
  taskId: string,
) => {
  if (sourceColumnId === destinationColumnId) return columns;

  return {
    ...columns,
    [sourceColumnId]: columns[sourceColumnId].filter((existingTaskId) => existingTaskId !== taskId),
    [destinationColumnId]: columns[destinationColumnId].includes(taskId)
      ? columns[destinationColumnId]
      : [...columns[destinationColumnId], taskId],
  };
};

// seed default tasks
function buildDefaultTasks() {
  const columns = emptyWorkflowColumns();
  const tasksById: Record<string, Task> = {};

  for (let index = 0; index < 12; index += 1) {
    const taskId = `seed-${index + 1}`;
    const columnId = WorkflowColumn.Backlog;
    const issueType = ISSUE_TYPES[index % ISSUE_TYPES.length]!;

    const task: Task = {
      id: taskId,
      issueNumber: index + 1,
      title: BOARD_SEED_ISSUE_TITLES[index] ?? `Sample issue ${index + 1}`,
      descriptionHtml: "<p><strong>Summary</strong></p><p>Default seeded task.</p>",
      columnId,
      createdAt: Date.now() - (12 - index) * 86400000,
      issueType,
      projectKey: BOARD_PROJECT_KEY,
      authorName: SEED_BOT_AUTHOR,
    };

    tasksById[taskId] = task;
    columns[columnId].push(taskId);
  }

  return { tasksById, columns };
}

const defaultBoard = buildDefaultTasks();

export interface BoardState {
  nextIssueNumber: number;
  tasksById: Record<string, Task>;
  columns: Record<ColumnId, string[]>;

  addTask: (
    columnId: ColumnId,
    input: { title: string; descriptionHtml: string; issueType: IssueType },
  ) => void;

  updateTask: (taskId: string, patch: Partial<Omit<Task, "id">>) => void;

  deleteTask: (taskId: string) => void;

  moveTaskToColumn: (taskId: string, targetColumnId: ColumnId) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      nextIssueNumber: 13,
      tasksById: defaultBoard.tasksById,
      columns: defaultBoard.columns,

      addTask: (columnId, input) =>
        set((state) => {
          const taskId = newTaskId();
          const issueNumber = state.nextIssueNumber;

          const newTask: Task = {
            id: taskId,
            issueNumber,
            title: input.title.trim() || DEFAULT_UNTITLED_ISSUE,
            descriptionHtml: input.descriptionHtml || "<p></p>",
            columnId,
            createdAt: Date.now(),
            issueType: input.issueType,
            projectKey: BOARD_PROJECT_KEY,
            authorName: DEFAULT_TASK_AUTHOR,
          };

          return {
            nextIssueNumber: issueNumber + 1,
            tasksById: {
              ...state.tasksById,
              [taskId]: newTask,
            },
            columns: {
              ...state.columns,
              [columnId]: [...state.columns[columnId], taskId],
            },
          };
        }),

      updateTask: (taskId, patch) =>
        set((state) => {
          const existingTask = state.tasksById[taskId];
          if (!existingTask) return state;

          const updatedTask: Task = {
            ...existingTask,
            ...patch,
          };

          const hasColumnChanged =
            patch.columnId !== undefined && patch.columnId !== existingTask.columnId;

          const updatedColumns = hasColumnChanged
            ? moveId(state.columns, existingTask.columnId, patch.columnId!, taskId)
            : state.columns;

          return {
            tasksById: {
              ...state.tasksById,
              [taskId]: updatedTask,
            },
            columns: updatedColumns,
          };
        }),

      deleteTask: (taskId) =>
        set((state) => {
          const taskToDelete = state.tasksById[taskId];
          if (!taskToDelete) return state;

          const { [taskId]: removedTask, ...remainingTasks } = state.tasksById;

          return {
            tasksById: remainingTasks,
            columns: {
              ...state.columns,
              [taskToDelete.columnId]: state.columns[taskToDelete.columnId].filter(
                (existingTaskId) => existingTaskId !== taskId,
              ),
            },
          };
        }),

      moveTaskToColumn: (taskId, targetColumnId) =>
        set((state) => {
          const task = state.tasksById[taskId];
          if (!task || task.columnId === targetColumnId) return state;

          return {
            columns: moveId(state.columns, task.columnId, targetColumnId, taskId),
            tasksById: {
              ...state.tasksById,
              [taskId]: {
                ...task,
                columnId: targetColumnId,
              },
            },
          };
        }),
    }),
    {
      name: BOARD_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        nextIssueNumber: state.nextIssueNumber,
        tasksById: state.tasksById,
        columns: state.columns,
      }),
    },
  ),
);
