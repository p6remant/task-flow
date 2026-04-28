import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const styles = {
  urgent: "border-orange-500/70 text-orange-400",
  bug: "border-red-500/70 text-red-400",
  feature: "border-sky-500/70 text-sky-400",
  neutral: "border-neutral-500/60 text-neutral-300",
  open: "border-emerald-500/60 text-emerald-400",
  progress: "border-green-500/60 text-green-400",
  done: "border-neutral-500/60 text-neutral-400",
} as const;

export type UiBadgeVariant = keyof typeof styles;

export type UiBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: UiBadgeVariant;
};

export function UiBadge({ className = "", variant = "neutral", ...props }: UiBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
