import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const baseClass = cn(
  "min-h-[5rem] w-full resize-y rounded-md border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm text-neutral-100",
  "outline-none transition-shadow placeholder:text-neutral-500",
  "focus-visible:ring-2 focus-visible:ring-sky-500/70 focus-visible:ring-offset-0",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

export type UiTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const UiTextarea = forwardRef<HTMLTextAreaElement, UiTextareaProps>(function UiTextarea(
  { className, ...props },
  ref,
) {
  return <textarea ref={ref} className={cn(baseClass, className)} {...props} />;
});
