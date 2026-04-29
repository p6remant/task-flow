"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bold, Italic, Link2, List, ListOrdered } from "lucide-react";

import {
  DESCRIPTION_EDITOR_MODE,
  type DescriptionEditorMode,
} from "@/constants/description-editor";
import { cn } from "@/lib/cn";
import { descriptionHtmlToMarkdown, markdownToDescriptionHtml } from "@/lib/description-markdown";

export type DescriptionWritePreviewProps = {
  valueHtml: string;
  onChange: (html: string) => void;
  labelId: string;
  placeholder?: string;
  labelClassName?: string;
  className?: string;
  compact?: boolean;
  dense?: boolean;
  errorText?: string;
};

function insertAroundSelection(
  el: HTMLTextAreaElement,
  value: string,
  before: string,
  after: string,
  fallback: string,
): { next: string; caret: number } {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = value.slice(start, end) || fallback;
  const next = value.slice(0, start) + before + selected + after + value.slice(end);
  const caret = start + before.length + selected.length;
  return { next, caret };
}

function insertAtLineStart(
  value: string,
  cursorPos: number,
  prefix: string,
): { next: string; caret: number } {
  const lineStart = value.lastIndexOf("\n", cursorPos - 1) + 1;
  const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  return { next, caret: cursorPos + prefix.length };
}

export function DescriptionWritePreview({
  valueHtml,
  onChange,
  labelId,
  placeholder = "Add a description (Markdown supported)",
  labelClassName = "text-slate-300",
  className = "",
  compact = false,
  dense = false,
  errorText,
}: DescriptionWritePreviewProps) {
  const rows = dense ? 4 : compact ? 6 : 12;
  const minWrite = dense ? "min-h-[4.5rem]" : compact ? "min-h-[7rem]" : "min-h-[12rem]";
  const minPreview = minWrite;
  const maxPreview = dense ? "max-h-[14rem]" : "max-h-[24rem]";

  const [markdown, setMarkdown] = useState(() => descriptionHtmlToMarkdown(valueHtml));
  const [tab, setTab] = useState<DescriptionEditorMode>(DESCRIPTION_EDITOR_MODE.Write);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const lastEmittedHtmlRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastEmittedHtmlRef.current === valueHtml) {
      lastEmittedHtmlRef.current = null;
      return;
    }
    setMarkdown(descriptionHtmlToMarkdown(valueHtml));
  }, [valueHtml]);

  const bump = (nextMd: string, caret?: number) => {
    setMarkdown(nextMd);
    const html = markdownToDescriptionHtml(nextMd);
    lastEmittedHtmlRef.current = html;
    onChange(html);

    if (caret != null && taRef.current) {
      requestAnimationFrame(() => {
        const el = taRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(caret, caret);
      });
    }
  };

  const onToolbar = (
    fn: (value: string, el: HTMLTextAreaElement) => { next: string; caret: number },
  ) => {
    const el = taRef.current;
    if (!el) return;
    const { next, caret } = fn(markdown, el);
    bump(next, caret);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        id={labelId}
        className={cn("flex items-baseline gap-1 text-sm font-medium", labelClassName)}
      >
        <span>Description</span>
        <span className="text-base leading-none text-red-500" aria-hidden>
          *
        </span>
      </label>

      <div
        className={cn(
          "rounded-md border bg-[#0d1117]",
          errorText ? "border-red-500/50" : "border-neutral-700",
        )}
      >
        <div className="flex items-center justify-between border-b border-neutral-700 px-2">
          <div className="flex" role="tablist" aria-label="Description mode">
            <button
              type="button"
              role="tab"
              aria-selected={tab === DESCRIPTION_EDITOR_MODE.Write}
              className={cn(
                "px-3 py-2 text-xs",
                tab === DESCRIPTION_EDITOR_MODE.Write ? "text-white" : "text-neutral-500",
              )}
              onClick={() => setTab(DESCRIPTION_EDITOR_MODE.Write)}
            >
              Write
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === DESCRIPTION_EDITOR_MODE.Preview}
              className={cn(
                "px-3 py-2 text-xs",
                tab === DESCRIPTION_EDITOR_MODE.Preview ? "text-white" : "text-neutral-500",
              )}
              onClick={() => setTab(DESCRIPTION_EDITOR_MODE.Preview)}
            >
              Preview
            </button>
          </div>

          <div
            className={cn(
              "flex gap-1",
              tab !== DESCRIPTION_EDITOR_MODE.Write && "pointer-events-none opacity-40",
            )}
            aria-hidden={tab !== DESCRIPTION_EDITOR_MODE.Write}
          >
            <ToolbarIcon
              label="Bold"
              onClick={() => onToolbar((v, el) => insertAroundSelection(el, v, "**", "**", "bold"))}
            >
              <Bold className="size-3.5" />
            </ToolbarIcon>

            <ToolbarIcon
              label="Italic"
              onClick={() => onToolbar((v, el) => insertAroundSelection(el, v, "*", "*", "italic"))}
            >
              <Italic className="size-3.5" />
            </ToolbarIcon>

            <ToolbarIcon
              label="Link"
              onClick={() =>
                onToolbar((v, el) => insertAroundSelection(el, v, "[", "](url)", "text"))
              }
            >
              <Link2 className="size-3.5" />
            </ToolbarIcon>

            <ToolbarIcon
              label="Numbered list"
              onClick={() => onToolbar((v, el) => insertAtLineStart(v, el.selectionStart, "1. "))}
            >
              <ListOrdered className="size-3.5" />
            </ToolbarIcon>

            <ToolbarIcon
              label="Bulleted list"
              onClick={() => onToolbar((v, el) => insertAtLineStart(v, el.selectionStart, "- "))}
            >
              <List className="size-3.5" />
            </ToolbarIcon>
          </div>
        </div>

        {tab === DESCRIPTION_EDITOR_MODE.Write ? (
          <textarea
            ref={taRef}
            aria-labelledby={labelId}
            aria-required
            aria-invalid={Boolean(errorText)}
            aria-describedby={errorText ? `${labelId}-error` : undefined}
            spellCheck
            rows={rows}
            className={cn(
              minWrite,
              "w-full resize-y border-0 bg-transparent px-3 py-3 text-sm text-white outline-none",
              errorText
                ? "ring-2 ring-inset ring-red-500/55 focus-visible:ring-red-500/80"
                : "ring-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500/80",
            )}
            placeholder={placeholder}
            value={markdown}
            onChange={(e) => {
              const v = e.target.value;
              setMarkdown(v);
              const html = markdownToDescriptionHtml(v);
              lastEmittedHtmlRef.current = html;
              onChange(html);
            }}
          />
        ) : (
          <div
            role="tabpanel"
            className={cn(
              "taskflow-md-preview overflow-y-auto px-3 py-3 text-sm text-white",
              minPreview,
              maxPreview,
            )}
          >
            {markdown.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            ) : (
              <p className="italic text-neutral-500">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>

      {errorText ? (
        <p id={`${labelId}-error`} className="text-xs text-red-400" role="alert">
          {errorText}
        </p>
      ) : null}
    </div>
  );
}

function ToolbarIcon({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="flex size-8 items-center justify-center text-neutral-400 hover:text-white"
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      {children}
    </button>
  );
}
