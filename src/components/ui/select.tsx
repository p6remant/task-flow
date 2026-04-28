import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type UiSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const UiSelect = forwardRef<HTMLSelectElement, UiSelectProps>(function UiSelect(
  { className, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full cursor-pointer rounded-md px-3 text-sm",
        "border border-neutral-600 bg-neutral-900 text-neutral-100",
        "outline-none transition-shadow placeholder:text-neutral-500",
        "focus-visible:ring-2 focus-visible:ring-sky-500/70 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
