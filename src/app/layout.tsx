import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { AppToaster } from "@/components/providers/app-toaster";
import { cn } from "@/lib/cn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow — Kanban",
  description:
    "Keyboard-accessible Kanban board optimized for large task lists with local persistence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(geistSans.variable, geistMono.variable, "min-h-screen font-sans antialiased")}
      >
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
