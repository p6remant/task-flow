"use client";

import Link from "next/link";
import { UiButton } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-center text-slate-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium">Something went wrong!</h1>
        <p className="max-w-md text-sm text-neutral-400">
          An unexpected error occurred. Try again or go back to the board.
        </p>
      </div>

      <div className="flex gap-3">
        <UiButton onClick={reset}>Try again</UiButton>

        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-600 bg-neutral-900 px-4 text-sm text-neutral-100 hover:bg-neutral-800"
        >
          Back to TaskFlow
        </Link>
      </div>
    </div>
  );
}
