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
- The stack prioritizes **speed of development + clarity over over-engineering**.

### What we rejected (for this scope)

| Alternative   | Reason                                                              |
| ------------- | ------------------------------------------------------------------- |
| Redux Toolkit | Too much boilerplate for a single store domain                      |
| Backend + DB  | Out of scope and time-boxed assignment                              |
| Drag-and-drop | Not required; avoided extra complexity and accessibility edge cases |
| React Query   | No server state exists in this app                                  |

---

## 2. Project setup & development approach

- Initial project structure and reusable UI components were implemented manually.
- UI patterns were inspired by common GitHub issue boards and Trello-style layouts.
- Focus was kept on:
  - Small reusable components
  - Clear separation of concerns (UI / store / logic / constants)
  - Minimal but scalable folder structure

---

## 3. AI / tooling usage (transparency)

This project used AI-assisted development tools:

- **Cursor** → store logic scaffolding, Zustand patterns, refactoring state structure
- **Gemini** → assistance in writing and refining store actions and edge-case handling
- **ChatGPT (optional)** → documentation structuring and architecture explanation

### How AI was used

- Writing and refining Zustand store logic
- Suggesting performance optimizations (selectors, debouncing)
- Helping structure design documentation
- Debugging TypeScript and state update issues

### Human responsibility

- Final architecture decisions
- Component design and structure
- UI decisions and trade-offs
- Performance considerations

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
4. On reload, Zustand hydrates state automatically

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

## 8. One more week — what I would improve

If I had one more week, I would focus on improving scalability, data safety, and usability refinements rather than adding new features.

### 1. Performance improvements (priority: high)
- Add list virtualization for task rendering inside columns
- Optimize filtering logic to avoid unnecessary full re-renders
- Profile and reduce unnecessary Zustand subscriptions

Why:
The app is expected to handle ~1,000 tasks smoothly, and virtualization is the most impactful improvement for maintaining performance at scale.

---

### 2. Persistence safety and data stability (priority: high)
- Introduce schema versioning for persisted localStorage data
- Add migration logic for future changes in task structure
- Add safe fallback handling if stored JSON is corrupted

Why:
Without versioning, any future change to the Task model could break existing user data.

---

### 3. UX and interaction improvements (priority: medium)
- Add full keyboard shortcuts for task creation and movement
- Improve focus management inside modals and drawers
- Optional: add undo/redo for task actions

Why:
The app is keyboard-first as required, and improving interaction flow would make it significantly more usable.

---

### 4. Optional extension (if time allows)
- Add backend sync layer (REST API)
- Enable multi-device persistence or collaboration mode

Why:
This moves the app from a local demo into a real-world collaborative tool, but it is intentionally out of scope for the current assignment.
```
