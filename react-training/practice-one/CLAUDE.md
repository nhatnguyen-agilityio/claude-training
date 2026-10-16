# practice-one — Furniture Store

eCommerce practice app. `api/` = json-server mock backend, `web/furniture-store/` = React SPA.

## Commands (pnpm only)

- API: `cd api && pnpm install && pnpm start` → http://localhost:5001
- Web: `cd web/furniture-store && pnpm install && pnpm dev`
  - Needs `.env` (copy `.env.sample`): `VITE_LOCAL_API_URL=http://localhost:5001`
- Test: `pnpm test` (Jest + RTL) · single file: `pnpm test src/apis/products.test.ts`
- Lint / types / build: `pnpm lint` · `pnpm build` (runs `tsc -b`)
- Storybook: `pnpm storybook` (port 6006)

## Conventions (web/furniture-store/src)

- Stack: React 19 + TS, Tailwind v4, shadcn/ui, TanStack Query, React Hook Form, React Router.
- Components: `components/<PascalName>/index.tsx` + `<Name>.test.tsx` (+ `.stories.tsx` if visual).
- Data fetching: one kebab-case file per endpoint in `apis/` exporting a query/mutation hook; routes in `constants/api-routers.ts`, keys in `constants/query-keys.ts`, base URL from `constants/env-variables.ts`.
- Shared constants live in `constants/`; types in `interfaces/`.
- Use relative imports (match existing code). Style with Tailwind classes; variants via `cva`.
- Tests mock `fetch` and `constants/*` modules (see `apis/products.test.ts`); wrap hooks in `QueryClientProvider`.
- Prettier: single quotes, trailing commas, 80 cols (auto-run by hook on Claude edits).
- Commits: `feat(): …`, `bugfix(): …`, `refactor(): …`, `test(): …` (use the commit-message skill).

## Never do

- Never use npm or yarn, or commit a lockfile other than `pnpm-lock.yaml`.
- Never hand-edit `src/components/ui/*` (shadcn-generated) — wrap it in `components/common/` instead.
- Never hardcode API URLs or query keys — use `constants/`.
- Never call `fetch` directly in components — go through an `apis/` hook.
- Never commit `.env`, real credentials, `coverage/` or `dist/`.
- Never reset or bulk-rewrite `api/db.json`; it is the shared seed data.
- Never skip or delete failing tests to make them pass; fix the cause.
- Never push to `main`/`dev` directly — branch + merge request.
