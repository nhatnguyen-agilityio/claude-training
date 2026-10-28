# Day 14: QA Regression Report

**Date:** 2026-10-27
**Build under test:** !5, !6, !7 and !8 merged together on a local branch `test/day-14-regression` (`c0d6c58`), cut from `feat/day-13-exercises`. The branch was not pushed, and the MRs are still open and unmerged on GitLab.
**Merge order:** [!5](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/5) → [!6](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/6) → [!7](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/7) → [!8](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/8), with no conflicts.
**Environment:** Node 20.20.0, pnpm 9.15.9, Chromium (Playwright 1.55.0). Every check ran against a throwaway copy of `api/db.json`, and the real file was unchanged afterwards (checksum compared).

---

## Verdict

✅ **The four MRs work together.** No regressions, and every automated suite is green.
⚠️ **One new bug found** in checkout, which existed before these MRs (see B1). It's logged as [#19](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/work_items/19) and doesn't block !5–!8.

---

## Automated suites

| Suite | Result | Notes |
|---|---|---|
| Jest, full suite (not just the CI list) | ✅ 1025 / 1025 tests, 59 / 59 suites | The 13 old failures fixed by !7 stay fixed when combined with !6 |
| ESLint | ✅ clean | |
| Build (`tsc -b && vite build`) | ✅ passes | Only the usual chunk-size warning |
| API tests (`node --test`, from !5) | ✅ 12 / 12 | |
| Playwright e2e (from !6) | ✅ 9 / 9, run twice | Not flaky: 27.8 s and 26.2 s |

## Manual checks

| # | Check | Expected | Result |
|---|---|---|---|
| R1 | Sign up a new user | 201 | ✅ |
| R2 | Log in | 200, no password in the response | ✅ |
| R3 | Wrong password / duplicate username | 401 / 400 | ✅ |
| R4 | New cart row over stock (3 > 2) | 400 "Insufficient stock" | ✅ (#16 fix) |
| R5 | New cart row within stock | 201 | ✅ |
| R6 | Existing row pushed over stock | 400 | ✅ |
| R7 | Sold-out variant | 400 | ✅ |
| R8 | `PATCH /carts/:id` quantity 99 (direct API call) | Should be rejected | ⚠️ 200, known open gap (cart edits skip the stock check) |
| R9 | `PATCH /carts/:id` quantity −4 | Should be rejected | ⚠️ 200, same gap |
| R10–R11 | `update-stock` over stock / decimal quantity | 400 | ❌ See B1 |
| R12 | Clear a user's cart | 200, 0 rows left | ✅ |
| U1 | Log in in the UI with "Remember me" unticked | Only `{id, username}` in sessionStorage | ✅ (#17 fix) |
| U2 | Cart drawer: type 15 when stock is 10 | Capped | ✅ saved as 10, so the UI blocks the R8 gap |
| U3 | Full checkout (shipping → test card → Pay Now) | Order confirmed, cart cleared, **the bought product's** stock goes down | ❌ Order confirmed and cart cleared, but the wrong product's stock went down (B1) |

---

## Bugs found

### B1. Checkout takes stock from the wrong product ([#19](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/work_items/19))

- **What happens:** I bought 1 × product 8 (variant 101). Product 8's stock stayed at 10, and **product 1's stock went from 2 to 1**.
- **Why:**
  - Payment sends only `variantId` to `PATCH /products/update-stock`.
  - Variant ids are not unique: `101` is used by 20 products.
  - The route changes the first product it finds with that variant id.
- **Also in the same route:**
  - When that first product is short of stock, the loop moves on and takes the stock from the next product with the same variant id (R10 took 5 from product 8).
  - It accepts decimals: R11 left stock at 0.5.
  - `previousStock` in the response shows the value after the change, not before.
  - It returns 200 when some items fail.
- **Where:** `api/server.js` (`/products/update-stock`) and `web/furniture-store/src/components/Payment/index.tsx`.
- **Since when:** the original source (`011fecf`), so it isn't a regression from !5–!8.
- **Suggested fix:**
  - send `productId` with each item, and match on product and variant
  - check stock for every item before changing any of them
  - require positive whole numbers
  - return 400 when any item fails

### Known gap, still open: cart edits skip the stock check

`PATCH /carts/:id` accepts any quantity (R8, R9). The UI caps the quantity at the stock, so normal users can't hit it, but the API doesn't protect itself. This is already listed as an open question in the spec (!8).

---

## Not covered

- Mobile layout. Checks ran at desktop width only.
- Browsers other than Chromium.
- Checkout as an automated e2e test: U3 was manual only. It's worth adding once B1 is fixed.
