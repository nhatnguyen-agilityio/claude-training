# Day 11: Testing the Web App with Claude in Chrome and the Browser Pane

**Date:** 2026-10-21
**Exercise:** Claude in Chrome: test the training web app from a session (console logs, form fill); browser pane app-preview loop.
**Branch:** `feat/day-11-exercises`
**Worked with:** Claude in the Claude desktop app, and Claude Code in the terminal with `--chrome`

---

## Summary

I let Claude test the furniture store like a real user in two different browsers. In my own Chrome, through the Claude in Chrome extension, it read the console on three pages, tried the login and sign-up forms, and completed a full checkout. That found three real problems, including a checkout that silently ignores what the customer types. In the desktop app's browser pane, Claude and I ran a quick change, look, fix loop twice. It added low-stock and out-of-stock warnings to the product page, and the tests caught a gap that the screen alone didn't show.

---

## What I achieved

| # | Goal | Result |
|---|---|---|
| 1 | Connect Claude in Chrome | ✅ The extension connected to my Chrome on my Pro plan, and Claude worked in its own tabs |
| 2 | Check console logs from a session | ✅ Home and products pages are clean. The product page logs a real HTML error in the breadcrumb |
| 3 | Fill forms from a session | ✅ Recorded every validation message on login and sign-up, then did a full login → cart → checkout → payment with a test card |
| 4 | Find real bugs | ✅ 3 found (below). None fixed yet |
| 5 | Run the browser pane preview loop | ✅ 2 loops on the product page, each checked with screenshots and the console |
| 6 | Keep the change safe | ✅ Lint and type checks pass, the tests were fixed, the seed data was restored, and the change is committed |

### What Claude found in Chrome

| Problem | Why it matters |
|---|---|
| **The checkout ignores what you type.** The saved order used the customer's old saved card and phone number, not the test card and phone entered in the form | A customer could be charged on the wrong card, and the order has the wrong contact details |
| **The breadcrumb puts a list item inside another list item** (product page only) | Invalid HTML: screen readers can read it wrongly, and React warns about it on every visit |
| **The forms ask for a username, but the sign-up check doesn't validate emails,** and the two forms word the same rule differently | Confusing messages, and the Google/Apple buttons refer to fields that don't exist |

### What the browser pane loops built

| Loop | Change | Tries | What happened |
|---|---|---|---|
| 1 | Show **"Only N left" in red** when a variant has fewer than 5 in stock | 1 | Worked first time. I had to lower a variant's stock to see it, since product 1 had 9 and 7 |
| 2 | Show **"Out of stock"** and **disable Add to cart** at 0 | 2 | Looked right in the pane, but **6 tests failed**: their sample products had no stock at all. I fixed the test data, and the tests passed |

---

## What I learned

1. **Claude in Chrome tests like a person, not like a unit test.** Clicking through a real checkout found a bug no existing test covered: the order ignores the form.
2. **Reading the console is easiest when Claude does it page by page.** It separated real problems from harmless dev noise and explained why only one page showed the error.
3. **Tests and the screen catch different things.** In loop 2 the page looked perfect, but only the tests showed that some sample data was incomplete.
4. **The browser pane makes the change, look, fix loop very short.** The page reloaded on its own after each edit, and Claude checked it with a screenshot and the console in the same conversation.
5. **Choose the browser by job.** Chrome uses my real browser and logins, and is best for testing like a user. The pane is built into the app and starts the dev servers itself, so it's best while building.
6. **Testing changes the data.** Logging in, ordering and changing stock all wrote to the shared seed data, so restoring it afterwards has to be part of the routine.

---

## Challenges and how I handled them

- **I couldn't see Claude's tab in Chrome at first.** Claude works in its own tab group, which may be collapsed or in another window. Asking it which tab it was using solved that.
- **Port clashes.** The pane starts its own servers, so I stopped the terminal ones first to free the ports.
- **Nothing low in stock to test.** I lowered a variant's stock through the app's own stock API, and restored the data afterwards.
- **The button only showed "Sign in" when logged out.** I logged in a test user in the pane to see the real out-of-stock button.

---

## Takeaway

Claude in Chrome is my tester: it uses the app as a customer would and reports what's broken, with the console as evidence. The browser pane is my build partner: change something, watch it reload, check it, repeat. Together with the tests, they caught problems that each one alone would have missed.
