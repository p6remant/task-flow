# TaskFlow — Design document

## 1. Stack

### What we used

| Layer       | Choice                             | Role                                                      |
| ----------- | ---------------------------------- | --------------------------------------------------------- |
| Framework   | Next.js 15 (App Router), React 19  | Routing, layouts, and client-heavy UI structure           |
| Language    | TypeScript                         | Safer refactors across store and UI                       |
| Styling     | Tailwind CSS 4                     | Fast styling with consistent UI patterns and focus states |
| State       | Zustand                            | Single global board store with colocated actions          |
| Persistence | Zustand `persist` + `localStorage` | Keeps tasks after reload without backend                  |
| Forms       | react-hook-form + Zod              | Typed validation for task creation                        |
| Markdown    | react-markdown + remark-gfm        | Rich task descriptions                                    |
| Utilities   | Custom hooks + helpers             | Debounce, board utilities, and formatting logic           |

### Why these choices

- **Zustand** keeps state simple and localized for a single-domain app (task board).
- **Next.js** provides structure even though this is a frontend-only app.
- **localStorage persistence** meets the requirement without introducing backend complexity.

### What we rejected (for this scope)

| Alternative   | Reason                                                              |
| ------------- | ------------------------------------------------------------------- |
| Redux Toolkit | Too much boilerplate for a single store domain                      |
| Backend + DB  | Out of scope and time-boxed assignment                              |

---

## 2. Project setup & development approach

- Initial project structure and reusable UI components were implemented manually.
- UI patterns were inspired by common GitHub issue boards and Trello-style layouts.
- Focus was kept on:
  - Small reusable components
  - Clear separation of concerns (UI / store / logic / constants)
  - Minimal but scalable folder structure
  - Performance optimization

---

## 3. AI / tooling usage

This project used AI-assisted development tools:

- **Cursor** → store logic scaffolding and Zustand patterns
- **Gemini** → assistance in writing and refining store actions and edge-case handling

### How AI was used

- Writing and refining Zustand store logic
- Suggesting performance optimizations

### UI reference

- UI patterns and layout inspiration were taken from GitHub issue boards and Trello-style interfaces.

---

## 4. Architecture

### Where state lives

All application state is stored in:

- `src/store/board-store.ts`

### State structure

- `tasksById` → normalized task storage
- `columns` → ordered task IDs per workflow column
- `nextIssueNumber` → incremental task identifier

### Data flow

1. UI triggers actions (create/update/move/delete task)
2. Zustand store updates:
   - task data (`tasksById`)
   - column mapping (`columns`)
3. `persist` middleware syncs state to `localStorage`

---

### Persistence model

- Stored in `localStorage`
- Key is defined in app constants
- Only essential state is persisted:
  - tasks
  - columns
  - issue counter

---

### Simple flow diagram

```text
UI (React Components)
        ↓
Zustand Store (Actions + State)
        ↓
localStorage (persist)        
```

## 8. One more week — what I would improve

If I had one more week, I would focus on extending the system toward real-world usage along with performance optimization.

---
### 1. System evolution (priority: high)
- Add backend API layer for tasks (REST or similar)
- Replace localStorage with server-based persistence

Why:
This moves the app from a local-only demo into a real-world scalable application.

---

### 2. Performance improvements (priority: high)
- Add list virtualization for task rendering inside columns

Why:
The app is expected to handle ~1,000 tasks smoothly, and virtualization is the most impactful improvement for maintaining performance at scale.

---

### 3. Multi-user support (priority: medium)
- Add user authentication
- Enable user-wise task creation (each user has isolated tasks)

Why:
This allows the app to evolve from a single-user tool into a multi-user system.
