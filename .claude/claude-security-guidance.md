# Security guidance for this repo

Most of the app code is in `react-training/practice-one`: `api/` is a json-server mock backend (`server.js`, `db.json`), and `web/furniture-store/` is the React app.

## API (`api/server.js`)
- Never store, compare or return passwords in plain text. Hash them (for example with bcrypt) and never send a password field back in a response.
- Routes that read or change a user's data (carts, orders, payments, stock) must check that the request belongs to that user. Never trust a `userId` from the request body or URL on its own.
- Validate the type and range of every number from a request (ids, quantities, stock). Reject negative, zero or non-numeric quantities.
- Don't put user input into error messages, logs or regexes without escaping it.

## Web app (`web/furniture-store/src`)
- Never use `dangerouslySetInnerHTML`, `innerHTML` or `eval` with product, user or API data.
- Never hardcode API URLs. Build them from `constants/env-variables.ts` and `constants/api-routers.ts`.
- Never call `fetch` directly in components; go through an `apis/` hook.
- Don't keep passwords or full payment card numbers in `localStorage` or `sessionStorage`.
