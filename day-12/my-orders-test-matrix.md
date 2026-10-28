# My Orders: QA test matrix (v1)

**Source:** [My Orders spec](my-orders-spec.md) and child tasks #6–#13 of [#5](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/issues/5) · **Run under:** #12 · **Demo:** Fri 30 Oct 2026

There are 44 test cases: 27 are P1 (must pass for the demo), 14 are P2 and 3 are P3. Updated after the dev Q&A on the tickets (TC-41 to TC-44 are new). Every acceptance criterion maps to at least one case (see section 4). None have been run yet, because the feature isn't built.

## 1. Criteria review (testability gaps)

Nine criteria were too vague to test as written. Six are now answered on the tickets; three keep the QA default.

| # | Gap | Where | QA default | Status |
|---|---|---|---|---|
| G1 | "Correct total" has no rounding or shipping rule | #6, #9 | Same result as `calculateCartSummary` at checkout, 2 decimals | Answered on #6: free from $500, else $25, via `calculateCartSummary` |
| G2 | Date format and timezone not given | #8, #9 | "23 Sep 2025", user's local time | Answered on #8: `Intl.DateTimeFormat`, "23 Sep 2025" |
| G3 | Order number format not given | #8, #9 | "Order #<id>" | Open, default stands |
| G4 | Show more at exactly 10 orders and on the last page | #7, #8 | Button hidden once everything is loaded | Open, default stands |
| G5 | "Asked to log in" is not specific | #11 | Login drawer opens; no order data is fetched or shown | Answered on #11: the login drawer opens |
| G6 | "Product unavailable" is in the spec but no ticket | spec §8, #9 | Add to #9's criteria; tested in TC-23 | Answered: added to #9 |
| G7 | Old orders have no `cardLast4` | #9 | Payment line hidden | Answered on #9: only fields that exist are shown |
| G8 | Badge colors not defined | #10 | Visual check only; contrast ≥ 4.5:1 | Answered on #10: amber, blue, green, red |
| G9 | "Mobile" only names 375px | #8, #9, #11 | Also test 768px (tablet, below the `lg` header switch) | Open, default stands |

## 2. Test data

All runs use a **throwaway copy** of the API, never the real `api/db.json`.

| Persona | Data | Used for |
|---|---|---|
| **U1** (user 1) | Order 1: status "processing", item prices, `totalAmount` | Full data, badge |
| **U2** (user 2) | 8 old orders (no status or prices), including order 15 with a card number and CVV | Old orders, "—", card data hidden |
| **U2+** | U2 plus 3 or 4 orders added on the copy (11 and 12 in total) | Show more, last page |
| **U2-10** | U2 plus 2 orders (exactly 10) | Show more edge |
| **U3** (user 3) | No orders | Empty state |
| **NEW** | An order placed through checkout during the test | Status, prices, totals saved |
| **OTHER** | U2 opens an order of user 10; `/orders/9999` | Not Found |
| **GONE** | An order on the copy with a `productId` that doesn't exist | Product unavailable |

## 3. Test cases

P1 = must pass for the demo · P2 = should pass · P3 = nice to have. Levels: **U** unit, **C** component (Jest + RTL), **E** manual end-to-end. Viewports: **D** desktop 1280px, **M** mobile 375px, **T** tablet 768px. All statuses start as Not run.

### Checkout data (#6)

| ID | Ref | Scenario | Data | Steps | Expected | P | Level | View |
|---|---|---|---|---|---|---|---|---|
| TC-01 | #6 AC1 | New order saved as Processing | NEW | Place an order; read `GET /orders/<id>` | `status` is "processing" | P1 | U+E | D |
| TC-02 | #6 AC2 | Item prices and totals saved | NEW, 2 items, qty 2 | Place an order; read it back | Each item has `price`; `subtotal`, `shipping`, `total` match the cart summary shown at checkout (G1) | P1 | U+E | D |
| TC-03 | #6 AC3 | No card data saved | NEW, card 4242… | Place an order; read it back | No `cardNumber` or `cvv`; `cardLast4` is "4242" | P1 | U+E | D |
| TC-04 | #6 AC4 | `orderDate` is an ISO string | NEW | Read the saved order; run `tsc -b` | ISO string; types compile | P2 | U | — |

### API hooks (#7)

| ID | Ref | Scenario | Data | Steps | Expected | P | Level | View |
|---|---|---|---|---|---|---|---|---|
| TC-05 | #7 AC1 | List URL, sort and page size | mocked fetch, user 2 | Render `useUserOrders(2)` | Calls `orders/?userId=2&_sort=orderDate&_order=desc&_page=1&_limit=10` | P1 | U | — |
| TC-06 | #7 AC1 | Load more uses `X-Total-Count` | mock total 12 | Fetch the next page | Page 2 is requested; `hasNextPage` is false after it | P1 | U | — |
| TC-07 | #7 AC2 | Detail URL | mocked fetch | Render `useOrderDetail(31)` | Calls `orders/31` | P1 | U | — |
| TC-08 | #7 AC3 | No request without a user | userId undefined | Render the hook | No fetch call | P2 | U | — |
| TC-09 | #7 | Server error surfaces | mock 500 | Render the hook | `isError` is true | P2 | U | — |

### My Orders list (#8)

| ID | Ref | Scenario | Data | Steps | Expected | P | Level | View |
|---|---|---|---|---|---|---|---|---|
| TC-10 | #8 AC1, US1 | Newest first, with all fields | U2 | Log in; open `/orders` | 8 orders, newest first; each shows "Order #id", date "23 Sep 2025", item count as total quantity ("3 items", "1 item"), total or "—", badge or none | P1 | C+E | D |
| TC-11 | #8 AC1 | Old orders: "—" and no badge | U2 | Look at any old order | Total "—"; no badge; no "$0.00" or "undefined" | P1 | C+E | D |
| TC-12 | #8 AC1 | Order with full data | U1 | Open `/orders` | Total shown with `formatPrice`; Processing badge | P1 | E | D |
| TC-13 | #8 AC3 | Show more loads the next 10 | U2+ (12) | Click Show more | 10 shown, then 12; button disappears (G4) | P1 | C+E | D |
| TC-14 | #8 AC3 | Exactly 10 orders | U2-10 | Open `/orders` | 10 shown, no Show more button | P2 | C | — |
| TC-15 | #8 AC4 | Empty state | U3 | Open `/orders` | "You haven't placed any orders yet." with Start shopping → `/products` | P1 | C+E | D |
| TC-16 | #8 AC5 | Loading skeleton | slow network (DevTools) | Open `/orders` | Skeleton rows, no layout jump | P2 | C+E | D |
| TC-17 | #8 AC5 | Error with Try again | stop the API | Open `/orders`; restart the API; click Try again | Error message, then the list loads | P1 | C+E | D |
| TC-18 | #8 AC6 | Click goes to detail | U2 | Click an order | URL `/orders/<id>`, detail shown | P1 | E | D |
| TC-19 | #8 AC7 | Mobile and tablet layout | U2 | Repeat TC-10 at 375 and 768px | Cards stack; no horizontal scroll; text not cut off | P1 | E | M, T |

### Order detail (#9)

| ID | Ref | Scenario | Data | Steps | Expected | P | Level | View |
|---|---|---|---|---|---|---|---|---|
| TC-20 | #9 AC1, US2 | All fields for a new order | NEW | Open its detail | Number, date, badge, items (image, name, color/size, qty, price), address, contact, "Card ending 4242", subtotal / shipping / total | P1 | C+E | D |
| TC-21 | #9 AC2 | Old order without prices | U2 order | Open its detail | Prices and totals "—"; payment line hidden | P1 | C+E | D |
| TC-22 | #9 AC6 | Card data never shown | U2 order 15 | Open its detail; search the page and DOM | Card number and CVV appear nowhere in the page or the DOM | P1 | C+E | D |
| TC-23 | #9 AC4 (G6) | Product no longer exists | GONE | Open its detail | Item shows "Product unavailable"; the page doesn't crash | P2 | C+E | D |
| TC-24 | #9 AC5 | Another user's order | OTHER | As U2, open user 10's order id | Not Found; none of that order's data is shown | P1 | E | D |
| TC-25 | #9 AC5 | Id that doesn't exist | OTHER | Open `/orders/9999` | Not Found | P2 | C+E | D |
| TC-26 | #9 AC7 | Back link | U2 | Click "Back to My Orders" | Returns to `/orders` | P2 | E | D |
| TC-27 | #9 AC7 | Mobile and tablet layout | NEW | Repeat TC-20 at 375 and 768px | Sections stack; item rows wrap; no horizontal scroll | P1 | E | M, T |

### StatusBadge (#10)

| ID | Ref | Scenario | Data | Steps | Expected | P | Level | View |
|---|---|---|---|---|---|---|---|---|
| TC-28 | #10 AC1, US3 | Each status | processing, shipped, delivered, cancelled | Render each | Labels "Processing" amber, "Shipped" blue, "Delivered" green, "Cancelled" red | P1 | C | — |
| TC-29 | #10 AC2 | No status or unknown status | undefined, "lost" | Render | Renders nothing | P1 | C | — |
| TC-30 | #10 AC3 | Storybook story | — | Open the story | All 4 states visible | P3 | C | — |

### Navigation and access (#11)

| ID | Ref | Scenario | Data | Steps | Expected | P | Level | View |
|---|---|---|---|---|---|---|---|---|
| TC-31 | #11 AC1, US4 | User menu item | U2 | Open the user menu on desktop and in the mobile sidebar | "My Orders" goes to `/orders` | P1 | C+E | D, M |
| TC-32 | #11 AC2 | Button after checkout | NEW | Finish checkout | "View my orders" goes to `/orders`, new order on top | P1 | E | D |
| TC-33 | #11 AC3 | Logged out, list | logged out | Open `/orders` directly | Login drawer opens; no orders request is sent (G5) | P1 | E | D |
| TC-34 | #11 AC3 | Logged out, detail | logged out | Open `/orders/1` directly | Same as TC-33 | P1 | E | D |
| TC-35 | #11 AC4 | Refresh while logged in | U2 | On `/orders`, refresh | Stays on `/orders`; no flash of the login drawer | P1 | E | D |
| TC-36 | #11 | Log out while on the page | U2 | Log out from `/orders` | Order data disappears; login is asked for | P2 | E | D |

### Buy again (#13, stretch)

| ID | Ref | Scenario | Data | Steps | Expected | P | Level | View |
|---|---|---|---|---|---|---|---|---|
| TC-37 | #13 AC1, US5 | All items in stock | NEW | Click Buy again | All items in the cart with the same variant and qty; cart opens | P2 | E | D |
| TC-38 | #13 AC2, AC3 | Some or all items out of stock | stock 0 on the copy | Click Buy again | Missing items named in a message; if all are out, the button is disabled with an explanation | P2 | E | D |

### Added after the dev Q&A

| ID | Ref | Scenario | Data | Steps | Expected | P | Level | View |
|---|---|---|---|---|---|---|---|---|
| TC-41 | #6 (dev Q&A) | Failed order and double submit | NEW; stop the API before Pay, then restart | Click Pay with the API down; then double-click Pay with it up | An error message shows and the cart is kept; Pay is disabled while saving; only one order is created | P1 | C+E | D |
| TC-42 | #8 AC2 | First item's image on each card | U2, plus a GONE order | Open `/orders` | Each card shows its first item's image; the GONE order shows a placeholder | P2 | C+E | D, M |
| TC-43 | #9 AC3 | Old order with missing contact fields | U2 order with only `shippingAddress` | Open its detail | The address string is shown; no empty rows, "undefined" or blank labels | P2 | C+E | D |
| TC-44 | #9 AC2 | Price comes from the order | NEW; change that product's price on the copy | Open the order's detail | Item prices and totals are the ones saved at checkout, not the new price | P2 | E | D |

### Non-functional

| ID | Ref | Scenario | Data | Steps | Expected | P | Level | View |
|---|---|---|---|---|---|---|---|---|
| TC-39 | all pages | Keyboard and screen reader basics | U2 | Tab through the list and detail | Visible focus; Enter opens an order; images have alt text; badge contrast ≥ 4.5:1 (G8) | P3 | E | D |
| TC-40 | all pages | Clean console and build | — | Run TC-10–TC-35; `pnpm test`, `pnpm lint`, `pnpm build` | No console errors; all three commands pass | P3 | E | D |

## 4. Coverage

All 31 acceptance criteria and the 5 user stories have at least one case.

| Ticket / story | Criteria | Cases | Covered |
|---|---|---|---|
| #6 Data | AC1–AC4 + dev Q&A | TC-01–04, 41 | 4 / 4 |
| #7 API hooks | AC1–AC3 + error | TC-05–09 | 3 / 3 |
| #8 List | AC1–AC7 | TC-10–19, 42 | 7 / 7 |
| #9 Detail | AC1–AC7 | TC-20–27, 43, 44 | 7 / 7 |
| #10 StatusBadge | AC1–AC3 | TC-28–30 | 3 / 3 |
| #11 Navigation and access (now M) | AC1–AC4 | TC-31–36 | 4 / 4 |
| #12 QA | Runs this matrix | All P1 + TC-40 | — |
| #13 Buy again | AC1–AC3 | TC-37–38 | 3 / 3 |
| US1–US5 | Spec stories | TC-10, 20, 28, 31, 37 | 5 / 5 |

**Exit rule for the demo:** all 27 P1 cases pass, with no open 🔴 defect.

## 5. Defect template (for comments on #12)

**[TC-xx] Short title**: Steps: 1… 2… 3… · Expected: … · Actual: … · Data: persona / order id · Env: browser, viewport, branch · Evidence: screenshot or console log
