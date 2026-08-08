# AGENTS.md — Todo Master

## Project Overview
Todo Master is a single-page React + TypeScript + Tailwind CSS v4 todo management app. Data persists in `localStorage`. The UI is in Thai. No backend — all state lives in the browser.

## Tech Stack
- **React 19** with TypeScript (TSX)
- **Vite 6** as the dev server and bundler
- **Tailwind CSS v4** via `@tailwindcss/vite` (no postcss.config; pure CSS import in `src/index.css`)
- **lucide-react** for icons
- **motion** (framer-motion successor) for animations
- **dotenv** for env loading (Gemini API key support in README)

## Project Structure
```
src/
  main.tsx              — React entry point
  index.css             — Tailwind v4 entry (`@import "tailwindcss"`)
  App.tsx               — Root component: auth, routing, filter logic, stats
  types.ts              — Shared types: Todo, User, FilterState, TodoStats, Priority, Status, DueFilter
  data/initialData.ts   — Seed data: INITIAL_USERS, INITIAL_TODOS
  utils/storage.ts      — localStorage CRUD, date helpers (Thai locale)
  components/
    AuthView.tsx         — Login/Register + quick demo accounts
    Navbar.tsx           — Header, create button, user switcher dropdown
    DashboardStats.tsx   — Stats cards + progress bar
    TodoFilters.tsx      — Search, status/priority/due/sort filters, view mode toggle
    TodoCard.tsx         — Individual todo card (grid + list view modes), status quick-switch
    TodoModal.tsx        — Create/Edit modal form
    ConfirmModal.tsx     — Delete confirmation
    Toast.tsx            — Toast notification system
```

## Key Business Rules
1. **Todos belong to users** — `user_id` links todos to users. Users can only edit/delete their own todos.
2. **New todo defaults** — status `Todo`, priority `Medium`, category `ทั่วไป`, no due date.
3. **Overdue logic** — a todo is overdue when `due_date < today` and `status !== 'Done'`.
4. **Due date format** — `YYYY-MM-DD` ISO date string throughout.
5. **Auto-select first user** on first load if no saved user exists.
6. **Categories** — fixed list: `['งานบริษัท', 'โปรเจกต์', 'ส่วนตัว', 'การเงิน', 'การเรียน', 'สุขภาพ', 'ทั่วไป']`.

## Naming & Style Conventions
- **Files**: PascalCase for components (e.g. `TodoCard.tsx`), camelCase for utilities (e.g. `storage.ts`).
- **Components**: Functional components with `React.FC<Props>` typing. Use named exports for components.
- **Imports**: Absolute path aliases not yet configured in tsconfig beyond `@/*`. Prefer relative imports from `src/`.
- **Tailwind**: Dark slate theme (`bg-slate-950`, `text-slate-100`, etc.). Primary accent is indigo (`indigo-600`).
- **No comments** unless explicitly requested.
- **Thai language** for all user-facing strings and toast messages.

## TypeScript
- Target: ES2022, JSX: react-jsx, strict enough via Vite bundler.
- Lint command: `npm run lint` (runs `tsc --noEmit`).

## Scripts
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server at port 3000, host 0.0.0.0 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type check (`tsc --noEmit`) |
| `npm run clean` | Remove `dist/` and `server.js` |

## Modifying the App
- **Adding a field to Todo**: Update `types.ts`, then `initialData.ts`, `TodoModal.tsx`, `TodoCard.tsx`, and `storage.ts` `saveTodo()`.
- **Adding a filter**: Add value to `FilterState` in `types.ts`, implement in `App.tsx` `filteredTodos`, and add UI in `TodoFilters.tsx`.
- **Changing the theme**: Modify `index.css` (Tailwind v4) and component class names.
- **New components**: Follow the pattern in `src/components/` — functional component, PascalCase filename, named export.

## Environment
- `.env` files are gitignored. `.env.example` exists.
- `GEMINI_API_KEY` is referenced in README but not used in src/ currently.

## Build Notes
- Vite HMR is disabled in AI Studio via `DISABLE_HMR=true`. Do not change `vite.config.ts` HMR/watch settings.
- `node_modules/` is gitignored. Run `npm install` after pulling changes.
