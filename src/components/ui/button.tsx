import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variantClass = {
  primary: "",
  secondary: "border-neutral-600 bg-neutral-800 text-neutral-100 hover:bg-neutral-800/90",
} as const;

export type UiButtonVariant = keyof typeof variantClass;

export type UiButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: UiButtonVariant;
};

export const UiButton = forwardRef<HTMLButtonElement, UiButtonProps>(function UiButton(
  { className, type = "button", variant = "primary", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
});
