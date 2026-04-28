# TaskFlow

TaskFlow is a lightweight task tracking app inspired by Trello. It allows you to create, update, delete, and move tasks across simple workflow columns, with everything persisted in the browser using localStorage. The focus is on simplicity, performance, and usability.

---

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand (with persist middleware for localStorage)
- react-hook-form + Zod (form handling and validation)
- react-markdown + remark-gfm (Markdown support for task descriptions)
- pnpm

---

## Prerequisites

- Node.js 20+
- pnpm

---

## Setup

```bash
pnpm install

Run Development Server
pnpm dev

Build & Start Production
pnpm build
pnpm start

Code Quality
pnpm lint
pnpm exec tsc --noEmit

Project Structure
task-flow/
├── public/                  Static assets
├── src/
│   ├── app/                Next.js app routes and layout
│   ├── components/
│   │   ├── kanban/         Board, columns, cards, modals, editor
│   │   ├── providers/      Global providers (toasts, etc.)
│   │   └── ui/             Reusable UI components
│   ├── constants/          Workflow definitions and configs
│   ├── hooks/              Custom hooks (debounce, etc.)
│   ├── lib/                Utility functions and helpers
│   ├── store/              Zustand global store
│   └── types/              TypeScript types
├── package.json
├── pnpm-lock.yaml
├── README.md
└── DESIGN.md
```
