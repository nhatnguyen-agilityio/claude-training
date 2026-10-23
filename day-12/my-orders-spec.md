# My Orders: feature spec (v1)

**Ticket:** [#5 My Orders: let customers see their orders](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/issues/5)
**Project:** furniture-store (`react-training/practice-one`)
**Author:** BA (Day 12 kickoff) · **Status:** agreed with the client · **Demo:** Friday 30 October 2026

## 1. Overview and goal

Customers place orders, but then they can't see them anywhere. v1 gives logged-in customers a **My Orders** list and an **order detail** page that shows what they bought, what they paid and where the order is. It must work on desktop and mobile.

**Success means:** in the demo, a customer places an order, finds it at the top of My Orders with status *Processing* and the correct total, and opens it to see every item.

## 2. Users

- **Logged-in customer** (main user): checks past orders and a single order's details.
- **Logged-out visitor:** asked to log in before seeing anything.
- **Stakeholders** (the demo audience): need a simple, reliable v1.

## 3. Scope

**In scope (v1)**
- My Orders list: 10 newest orders first, with "Show more".
- Order detail: items, address and contact, masked payment, subtotal / shipping / total.
- Status badge: Processing, Shipped, Delivered, Cancelled.
- Checkout saves status, item prices and totals on new orders.
- Entry points: a "My Orders" item in the user menu and a "View my orders" button on the order confirmation.
- Login required. Customers see only their own orders.
- Stretch: "Buy again" on the detail page.

**Out of scope**
- Cancel order, tracking numbers, search and filters, invoices/PDF.
- Back-filling old orders in the seed data.
- A separate login page (login stays in the side drawer).

## 4. Decisions (from the client's answers on #5)

| # | Topic | Decision |
|---|---|---|
| 1 | Status | Processing / Shipped / Delivered / Cancelled. New orders are saved as Processing. Old orders show **no badge**. (The BA decided this; the client left it to us.) |
| 2 | Totals | Save prices and totals from now on. Old orders show "—". |
| 3 | Fields | List: number, date, item count, total, status. Detail: items, address and contact, "Card ending 1234", subtotal / shipping / total. |
| 4 | Actions | Cancel, tracking, search and invoices are out. "Buy again" is a stretch ticket. |
| 5 | Long lists | 10 per page, newest first, "Show more". |
| 6 | Access | Login required, own orders only. |
| 7 | Deadline | Demo on Fri 30 Oct 2026, core tickets first. |

**Added after the dev Q&A on the tickets (#6–#13):**

| Topic | Decision | Ticket |
|---|---|---|
| Saved price | `product.price` (what the customer pays). `basePrice` and `sale` are display-only. | #6 |
| Shipping | Free from $500, otherwise $25, via `calculateCartSummary`. | #6 |
| Checkout errors | Show an error when saving the order fails, and disable Pay while saving (no double charge). | #6 |
| Item products | Reuse `useGetCartProducts`. The "own order" check is on the detail page, not in the hook. | #7, #9 |
| Item count | Total quantity (2 chairs + 1 lamp = "3 items"). | #8 |
| Dates | `Intl.DateTimeFormat`, e.g. "23 Sep 2025". No new package. | #8 |
| List image | Each card shows the first item's image, or a placeholder. *(Lead's change.)* | #8 |
| Old orders | Show only the fields that exist. Prices always come from the order, never from today's product. | #9 |
| Badge colors | Processing amber, Shipped blue, Delivered green, Cancelled **red** *(lead's change)*. | #10 |
| Login guard | The login drawer is opened from pages via a small context; auth gets an `isReady` flag. #11 is now **M** and starts early. | #11 |
| Buy again | One add-to-cart call per item. Skip items with less stock than ordered. | #13 |

## 5. User stories and acceptance criteria

**US1: See my orders.** As a logged-in customer, I want a list of my orders so I can find something I bought.
- Given I have orders, when I open `/orders`, then I see my 10 newest orders with number, date, item count (total quantity), total (or "—") and status badge (or none).
- Each card shows the first item's image, or a placeholder if that product is unavailable.
- Given I have more than 10 orders, when I click "Show more", then the next 10 load.
- Given I have no orders, then I see an empty state with "Start shopping".
- Given loading or an error, then I see a skeleton, or an error message with "Try again".

**US2: See one order.** As a logged-in customer, I want to open an order and see everything about it.
- Given my order, when I open `/orders/:id`, then I see the items (image, name, color/size, quantity, price), shipping address and contact, "Card ending 1234", and subtotal / shipping / total.
- Given an old order, then prices and totals show "—", and only the contact and address fields that exist are shown. Prices always come from the order.
- Given an item whose product no longer exists, then it shows "Product unavailable" and the page still loads.
- Given someone else's order or a missing id, then I see Not Found.
- The full card number and CVV are never shown.

**US3: Know the status.** As a customer, I want a clear status label so I know what is happening.
- Processing amber, Shipped blue, Delivered green, Cancelled red. No status means no badge.

**US4: Reach it easily, keep it private.**
- "My Orders" is in the user menu on desktop and mobile. The order confirmation has a "View my orders" button.
- Logged out, then asked to log in. Refreshing while logged in keeps me on the page.

**US5 (stretch): Buy again.** As a customer, I want to reorder a past order in one click.
- Items in stock go to the cart with the same variant and quantity. Items out of stock are skipped, with a message.

## 6. Screens (wireframes)

**My Orders list: desktop**
```
My Orders
┌───────────────────────────────────────────────────────────┐
│ [img] Order #31   23 Sep 2025   3 items   $412.00  [Processing] › │
├───────────────────────────────────────────────────────────┤
│ [img] Order #24   12 Sep 2025   1 item    —                  › │
└───────────────────────────────────────────────────────────┘
                     [ Show more ]
```

**My Orders list: mobile (375px)**
```
My Orders
┌─────────────────────────┐
│ [img] Order #31  [Processing] │
│ 23 Sep 2025 · 3 items    │
│ $412.00               › │
└─────────────────────────┘
```

**Order detail**
```
‹ Back to My Orders
Order #31 · 23 Sep 2025            [Processing]
──────────────────────────────────────────────
[img] Oslo Chair · Grey / M     x2     $120.00
[img] Lamp Nova · Black         x1     $172.00
──────────────────────────────────────────────
Shipping to: Nhat N., 12 Le Loi, Da Nang, Vietnam
Contact: email · phone
Payment: Card ending 1234
Subtotal $412.00 · Shipping $0.00 · Total $412.00
[ Buy again ]  (stretch)
```
On mobile, the sections stack and each item row wraps under its image.

**Empty state:** "You haven't placed any orders yet." with a [Start shopping] button.

## 7. Data and API

- **List:** `GET /orders?userId=<id>&_sort=orderDate&_order=desc&_page=<n>&_limit=10`. The total comes from `X-Total-Count`.
- **Detail:** `GET /orders/:id`. The page checks `order.userId === user.id`.
- **Products for items:** `GET /products?id=…&id=…`, for names and images.
- **New order fields saved at checkout:** `status: "processing"`, `items[].price`, `subtotal`, `shipping`, `total`, plus the existing contact fields, `cardholderName` and `cardLast4`.
- **Type fix:** `orderDate` is an ISO string.
- **Known data gaps:** 24 of 25 seed orders have no status, total or prices, and they come in 4 different shapes. We don't rewrite the seed data.

## 8. States and edge cases

- Loading (skeleton), error ("Try again"), empty ("Start shopping").
- An old order without prices or status: "—" and no badge.
- Someone else's order id, or an id that doesn't exist: Not Found.
- Refresh while logged in: no bounce to login (the user is restored after the first render).
- A product that no longer exists: show the item with "Product unavailable".

## 9. Security notes

- The API has no auth, so the UI must hide other users' orders. A real backend check is a follow-up.
- 11 old seed orders contain full card numbers and CVV. Never render them. Show only `cardLast4`, when it exists.
- `GET /orders/:id` still sends those card fields to the browser. Stripping them on the server is a high-priority follow-up right after the demo.

## 10. Risks

- **Deadline:** 7 core tickets in one week. "Buy again" is the first thing to drop.
- **Mixed old data shapes:** the UI must tolerate any missing field.
- **Prices change:** handled by saving prices from now on and showing "—" for old orders.

## 11. Ticket map (child tasks of #5)

| Ticket | Title | Size | Depends on |
|---|---|---|---|
| #6 | Data: save status, prices and totals on new orders | M | — |
| #7 | API hooks: user orders list and order detail | S | #6 |
| #8 | My Orders list page (/orders) | M | #7, #10 |
| #9 | Order detail page (/orders/:id) | M | #7, #10 |
| #10 | StatusBadge common component | S | — |
| #11 | My Orders navigation and login guard | M (was S) | — (start early) |
| #12 | QA: My Orders end-to-end on desktop and mobile | S | #6–#11 |
| #13 | Stretch: "Buy again" on order detail | S | #9 |

**Suggested order:** #6, #10 and #11 in parallel → #7 → #8 and #9 → #12 → #13 if time allows (after the add-to-cart stock bugfix).

**Follow-up tickets agreed in the dev Q&A (to open, linked to #5):**
- Silent stock-update and cart-clear failures after checkout.
- Strip card number and CVV from order responses (high priority after the demo).
- Add-to-cart doesn't check stock for a new cart row (do before #13).
- Login "remember me" doesn't work (after the demo).
- `removeCustomerInfo` clears the wrong storage key.
