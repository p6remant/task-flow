"use client";

import { SquareKanban } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-slate-950"
      role="status"
      aria-live="polite"
    >
      <SquareKanban
        className="size-16 text-sky-500/90"
        width={64}
        height={64}
        aria-hidden
        strokeWidth={1.5}
      />
    </div>
  );
}
