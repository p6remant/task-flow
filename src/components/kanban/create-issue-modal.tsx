"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  DEFAULT_ISSUE_TYPE,
  ISSUE_TYPE_DOT_CLASS,
  ISSUE_TYPE_LABELS,
  type IssueType,
} from "@/constants/issue-type";
import { COLUMN_STATUS_LABELS, WorkflowColumn } from "@/constants/workflow";
import { CreateIssueTypeDropdown } from "@/components/kanban/create-issue-type-dropdown";
import { DescriptionWritePreview } from "@/components/kanban/description-write-preview";
import { UiBadge } from "@/components/ui/badge";
import { UiButton } from "@/components/ui/button";
import { UiInput } from "@/components/ui/input";
import { UiModal } from "@/components/ui/modal";
import { UiStack } from "@/components/ui/stack";
import { cn } from "@/lib/cn";
import { createIssueSchema, type CreateIssueFormValues } from "@/lib/create-issue-schema";

const FORM_ID = "create-issue-form";

const defaultFormValues: CreateIssueFormValues = {
  title: "",
  descriptionHtml: "<p><br></p>",
  issueType: DEFAULT_ISSUE_TYPE,
};

export type CreateIssueModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string; descriptionHtml: string; issueType: IssueType }) => void;
};

export function CreateIssueModal({ open, onClose, onSubmit }: CreateIssueModalProps) {
  const [editorKey, setEditorKey] = useState(0);

  const form = useForm<CreateIssueFormValues>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: defaultFormValues,
    mode: "onSubmit",
  });

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!open) return;
    reset(defaultFormValues);
    setEditorKey((k) => k + 1);
  }, [open, reset]);

  const submit = handleSubmit((data) => {
    onSubmit({
      title: data.title,
      descriptionHtml: data.descriptionHtml || "<p><br></p>",
      issueType: data.issueType,
    });
    onClose();
  });

  const issueType = form.watch("issueType");

  return (
    <UiModal
      open={open}
      onClose={onClose}
      title="Create issue"
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <UiButton type="button" variant="secondary" onClick={onClose}>
            Cancel
          </UiButton>
          <UiButton type="submit" form={FORM_ID}>
            Create issue
          </UiButton>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={submit} noValidate>
        <UiStack gap="md">
          <div>
            <label
              className="mb-1 flex items-baseline gap-1 text-xs font-medium text-neutral-400"
              htmlFor="issue-title"
            >
              <span>Title</span>
              <span className="text-red-500" aria-hidden>
                *
              </span>
            </label>
            <UiInput
              id="issue-title"
              autoComplete="off"
              placeholder="Short, descriptive title"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "issue-title-error" : undefined}
              className={errors.title ? "border-red-500/80 focus-visible:ring-red-500/50" : ""}
              {...register("title")}
            />
            {errors.title ? (
              <p id="issue-title-error" className="mt-1 text-xs text-red-400" role="alert">
                {errors.title.message}
              </p>
            ) : null}
          </div>
          <div>
            <span
              className="mb-1 flex items-baseline gap-1 text-xs font-medium text-neutral-400"
              id="issue-type-label"
            >
              <span>Type</span>
              <span className="text-red-500" aria-hidden>
                *
              </span>
            </span>
            <Controller
              control={control}
              name="issueType"
              render={({ field }) => (
                <CreateIssueTypeDropdown
                  value={field.value}
                  onChange={field.onChange}
                  id="issue-type"
                  aria-labelledby="issue-type-label"
                  error={Boolean(errors.issueType)}
                />
              )}
            />
            {errors.issueType ? (
              <p className="mt-1 text-xs text-red-400" role="alert">
                {errors.issueType.message}
              </p>
            ) : null}
          </div>
          <Controller
            control={control}
            name="descriptionHtml"
            render={({ field }) => (
              <DescriptionWritePreview
                key={editorKey}
                compact
                labelId="issue-description-label"
                labelClassName="text-slate-300"
                valueHtml={field.value}
                onChange={field.onChange}
                placeholder="Enter description"
                errorText={errors.descriptionHtml?.message}
              />
            )}
          />
          <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="relative flex size-3.5 shrink-0 items-center justify-center rounded-full border border-neutral-600">
                <span className={cn("size-2 rounded-full", ISSUE_TYPE_DOT_CLASS[issueType])} />
              </span>
              <span className="truncate text-xs text-neutral-400">task-flow (draft)</span>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              <UiBadge variant={issueType}>{ISSUE_TYPE_LABELS[issueType]}</UiBadge>
              <UiBadge variant="neutral" className="capitalize">
                {COLUMN_STATUS_LABELS[WorkflowColumn.Backlog]}
              </UiBadge>
            </div>
          </div>
        </UiStack>
      </form>
    </UiModal>
  );
}
