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

## Setup

### 1. Clone the repository

You can clone the project using either HTTPS or SSH:

#### Option 1: HTTPS
```bash
git clone https://github.com/p6remant/task-flow.git

```

#### Option 2: SSH
```bash
git clone git@github.com:p6remant/task-flow.git
```

### 2. Install dependencies: 
```
pnpm install
```

### 3. Run development server: 
```
pnpm dev
```

### 4. Build application: 
```
pnpm build
```

### 5. Start production server: 
```
pnpm start
```

## Project Structure
```
task-flow/
├── public/                  Static assets
├── src/
│   ├── app/                Next.js app routes and layout
│   ├── components/
│   │   ├── kanban/         Board, columns, cards, modals, editor
│   │   ├── providers/      Global providers
│   │   └── ui/             Reusable UI components
│   ├── constants/          Workflow definitions and configs
│   ├── hooks/              Custom hooks
│   ├── lib/                Utility functions and helpers
│   ├── store/              Zustand global store
│   └── types/              TypeScript types
├── package.json
├── pnpm-lock.yaml
├── README.md
└── DESIGN.md
