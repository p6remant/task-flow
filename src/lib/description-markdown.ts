import { marked } from "marked";
import TurndownService from "turndown";

import { descriptionHtmlToPlain } from "@/lib/description-html";

marked.use({
  gfm: true,
  breaks: true,
});

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});

// strip risky markup from `marked` output (no JSDOM; safe on the server)
function sanitizeMarkedHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\s*on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

// HTML from the store → markdown for the editor
export function descriptionHtmlToMarkdown(html: string): string {
  if (!html?.trim()) return "";
  try {
    const md = turndown.turndown(html).trim();
    if (md) return md;
  } catch {
    /* fall through */
  }
  return descriptionHtmlToPlain(html);
}

// markdown from the editor → HTML for `descriptionHtml`
export function markdownToDescriptionHtml(markdown: string): string {
  const src = markdown.trim();
  if (!src) return "<p><br></p>";
  const raw = marked.parse(src, { async: false }) as string;
  const safe = sanitizeMarkedHtml(raw);
  return safe || "<p><br></p>";
}
