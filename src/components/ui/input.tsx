import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type UiInputProps = InputHTMLAttributes<HTMLInputElement>;

export const UiInput = forwardRef<HTMLInputElement, UiInputProps>(function UiInput(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "box-border h-10 w-full rounded-md border border-neutral-600 bg-neutral-900 px-3 py-0 text-sm leading-10 text-neutral-100",
        "outline-none transition-shadow placeholder:text-neutral-500",
        "focus-visible:ring-2 focus-visible:ring-sky-500/70 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
