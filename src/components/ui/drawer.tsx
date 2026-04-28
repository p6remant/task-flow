"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export type UiDrawerProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  panelClassName?: string;
  maxWidthClassName?: string;
};

export function UiDrawer({
  open,
  onClose,
  children,
  title,
  panelClassName = "",
  maxWidthClassName = "max-w-6xl",
}: UiDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setRender(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = globalThis.setTimeout(() => setRender(false), 320);
    return () => globalThis.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, mounted]);

  if (!mounted || !render) return null;

  return createPortal(
    <div className="fixed inset-0 z-110" role="dialog" aria-modal="true">
      <button
        type="button"
        className={cn(
          "absolute inset-0 cursor-pointer bg-black/55 transition-opacity duration-300 ease-in-out",
          visible ? "opacity-100" : "opacity-0",
        )}
        aria-label="Close panel"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col border-l border-neutral-800 bg-neutral-950 shadow-2xl transition-transform duration-300 ease-in-out",
          maxWidthClassName,
          visible ? "translate-x-0" : "translate-x-full",
          panelClassName,
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-neutral-800 px-4 py-3">
          {title ? <div className="min-w-0 flex-1">{title}</div> : <div className="flex-1" />}
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded-md p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
