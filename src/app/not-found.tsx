"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-center text-slate-100">
      <div className="space-y-2">
        <p className="text-5xl font-semibold text-neutral-600 sm:text-6xl">404</p>

        <h1 className="text-xl font-semibold sm:text-2xl">Page not found</h1>

        <p className="max-w-md text-sm text-neutral-400">
          That URL does not exist or was moved. Head back to TaskFlow.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-100 bg-neutral-100 px-4 text-sm font-medium text-neutral-950 hover:bg-white"
      >
        Back to TaskFlow
      </Link>
    </div>
  );
}
