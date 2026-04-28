"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { COLUMN_FLOW, COLUMN_LABELS, type ColumnId } from "@/constants/workflow";
import { cn } from "@/lib/cn";

const OPTIONS: ColumnId[] = [...COLUMN_FLOW];

export type ColumnStatusDropdownProps = {
  value: ColumnId;
  onChange: (value: ColumnId) => void;
  id?: string;
  "aria-labelledby"?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
};

export function ColumnStatusDropdown({
  value,
  onChange,
  id,
  "aria-labelledby": ariaLabelledBy,
  className,
  disabled = false,
  error = false,
}: ColumnStatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const close = useCallback(() => setOpen(false), []);

  useLayoutEffect(() => {
    if (!open || !wrapRef.current) return;

    const rect = wrapRef.current.getBoundingClientRect();
    const menuWidth = Math.max(rect.width, 160);
    const safeLeft = Math.min(Math.max(8, rect.left), globalThis.innerWidth - menuWidth - 8);

    setPos({ top: rect.bottom + 4, left: safeLeft, width: menuWidth });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const isInside = wrapRef.current?.contains(target) || menuRef.current?.contains(target);
      if (!isInside) close();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    const handleWindowChange = () => close();

    document.addEventListener("mousedown", handleOutsideInteraction);
    globalThis.addEventListener("keydown", handleKeyDown);
    globalThis.addEventListener("scroll", handleWindowChange, true);
    globalThis.addEventListener("resize", handleWindowChange);

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      globalThis.removeEventListener("keydown", handleKeyDown);
      globalThis.removeEventListener("scroll", handleWindowChange, true);
      globalThis.removeEventListener("resize", handleWindowChange);
    };
  }, [open, close]);

  const handlePick = (option: ColumnId) => {
    onChange(option);
    close();
    btnRef.current?.focus();
  };

  return (
    <>
      <div ref={wrapRef} className={cn("w-full", className)}>
        <button
          ref={btnRef}
          id={id}
          type="button"
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          className={cn(
            "flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-neutral-900 px-3 text-left text-sm text-neutral-100 outline-none transition-shadow",
            "hover:border-neutral-500 focus-visible:border-neutral-500 focus-visible:ring-2 focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-500/80 focus-visible:ring-red-500/50"
              : "border-neutral-600 focus-visible:ring-sky-500/70",
          )}
          onClick={() => !disabled && setOpen((prev) => !prev)}
        >
          <span>{COLUMN_LABELS[value]}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-neutral-400 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </div>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={listId}
            role="listbox"
            className="max-h-60 overflow-auto rounded-lg border border-neutral-700 bg-neutral-900 py-1 shadow-xl"
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: pos.width,
              zIndex: 99999,
            }}
          >
            {OPTIONS.map((opt) => {
              const isSelected = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  id={`${listId}-${opt}`}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-sm text-neutral-200 outline-none",
                    "hover:bg-neutral-800 focus-visible:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500/70",
                  )}
                  onClick={() => handlePick(opt)}
                >
                  <span>{COLUMN_LABELS[opt]}</span>
                  {isSelected && (
                    <Check className="size-4 text-sky-400" strokeWidth={2} aria-hidden />
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
