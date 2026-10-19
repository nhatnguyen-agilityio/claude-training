---
name: how-we-write-api-hooks
description: "How the team adds or changes data-fetching code in this furniture-store app: one kebab-case file per endpoint in src/apis/ exporting a TanStack Query hook, with routes, query keys and the base URL taken from src/constants/, plus a Jest test next to it. Use whenever someone asks to add, change, fix or test an API call, endpoint, query or mutation hook, or to fetch or send data from a component in furniture-store."
---

# How we write API hooks (furniture-store)

All paths below are relative to `src/` in the furniture-store app (the folder
that contains this `.claude/`).

Components never call `fetch`. Every endpoint gets its own hook in `apis/`,
and components only use that hook.

## Steps

1. **Check what exists.** Look in `apis/` for a hook on the same endpoint and
   extend it instead of adding a second one.
2. **Route.** Add the path to `API_ROUTES` in `constants/api-routers.ts`
   (UPPER_SNAKE key, value ends with `/`, e.g. `ORDERS: 'orders/'`).
3. **Query key** (queries only). Add a key factory to `QUERY_KEY` in
   `constants/query-keys.ts`, e.g. `USER_ORDERS: (userId: number) => ['orders', userId]`.
   Start the array with the resource name so related queries can be
   invalidated together.
4. **Types.** Put request/response types in `interfaces/<resource>.ts`
   (`<Name>Interface`). Reuse an existing interface when one fits.
5. **Hook file.** Create `apis/<verb>-<resource>.ts` in kebab-case
   (`user-orders.ts`, `add-order.ts`, `update-cart.ts`):
   - Reading data → copy [templates/query-hook.ts](templates/query-hook.ts).
   - Creating/updating/deleting → copy [templates/mutation-hook.ts](templates/mutation-hook.ts).
6. **Invalidate.** In a mutation's `onSuccess`, invalidate every `QUERY_KEY`
   whose data the change affects (e.g. adding to cart → `QUERY_KEY.USER_CART(userId)`).
7. **Test.** Create `apis/<same-name>.test.ts` from
   [templates/hook.test.ts](templates/hook.test.ts). Cover at least: success,
   the exact URL/body sent, HTTP error, network error, and (mutations) the
   invalidated key. Name tests "should … when …".
8. **Use it.** In the component, call the hook and render its loading and
   error states.
9. **Verify** from the app root (where `package.json` is):
   ```bash
   pnpm test src/apis/<file>.test.ts
   pnpm lint
   ```

## Rules

- Build URLs with `new URL(\`${API_ENDPOINT}${API_ROUTES.X}\`)` and
  `url.searchParams.set(...)`. Never hardcode `http://localhost:5001` or any host.
- Never inline query keys like `['orders', id]` in hooks or components; always use `QUERY_KEY`.
- Always check `res.ok` and `throw new Error(...)`, preferring the server's
  `error` field when the body has one.
- Use relative imports (`../constants/...`), matching existing files.
- Mutation hooks return `{ mutate, mutateAsync, ...rest, isLoading: isPending, error: error?.message || '' }`
  so components handle all mutations the same way.
- Tests mock `../constants/api-routers` and `../constants/env-variables` with
  `jest.mock` and stub `global.fetch`; they never hit the real API.
- Don't change `api/db.json` to make a hook work. If the endpoint needs
  server logic, add a route in `../../api/server.js` and say so.

## Reference files

- Query example: `apis/user-cart.ts` + `apis/user-cart.test.ts`
- Mutation example: `apis/add-cart.ts` + `apis/add-cart.test.ts`
