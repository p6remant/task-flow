"use client";

import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      gutter={12}
      containerClassName="!bottom-4 !right-4"
      toastOptions={{
        duration: 4200,
        style: {
          background: "rgb(23 23 23)",
          color: "rgb(245 245 245)",
          border: "1px solid rgb(64 64 64)",
          borderRadius: "0.5rem",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
          maxWidth: "min(24rem, calc(100vw - 2rem))",
        },
        success: {
          iconTheme: { primary: "rgb(34 197 94)", secondary: "rgb(23 23 23)" },
        },
        error: {
          iconTheme: { primary: "rgb(239 68 68)", secondary: "rgb(23 23 23)" },
        },
      }}
    />
  );
}
