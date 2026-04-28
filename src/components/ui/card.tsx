import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const baseClass =
  "rounded-lg border border-neutral-200 bg-neutral-50/80 dark:border-neutral-700 dark:bg-neutral-900/50";

export type UiCardProps = HTMLAttributes<HTMLDivElement>;

export function UiCard({ className = "", ...props }: UiCardProps) {
  return <div className={cn(baseClass, className)} {...props} />;
}

export type UiCardHeaderProps = HTMLAttributes<HTMLDivElement>;

export function UiCardHeader({ className = "", ...props }: UiCardHeaderProps) {
  return (
    <div
      className={cn("border-b border-neutral-200 px-3 py-2 dark:border-neutral-700", className)}
      {...props}
    />
  );
}

export type UiCardBodyProps = HTMLAttributes<HTMLDivElement>;

export function UiCardBody({ className = "", ...props }: UiCardBodyProps) {
  return <div className={cn("px-3 py-3", className)} {...props} />;
}
