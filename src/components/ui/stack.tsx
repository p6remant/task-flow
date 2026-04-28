import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type UiStackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: "none" | "sm" | "md" | "lg";
  direction?: "row" | "col";
};

const gapClass = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
} as const;

export function UiStack({ className = "", gap = "md", direction = "col", ...props }: UiStackProps) {
  const flexDir = direction === "row" ? "flex-row" : "flex-col";
  return <div className={cn("flex", flexDir, gapClass[gap], className)} {...props} />;
}
