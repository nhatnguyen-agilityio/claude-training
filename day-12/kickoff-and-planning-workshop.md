# Day 12: Kickoff and Planning a Mini-Product with Role Play

**Date:** 2026-10-23
**Exercise:** One real-ish mini-product. The "client" (the lead) wants a feature for the app: the lead briefs it vaguely, the BA runs intake, QA drafts the test matrix, and devs ask questions only through the tickets.
**Feature:** My Orders (order history and order details) for the furniture store
**Ticket:** [#5 My Orders: let customers see their orders](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/issues/5)
**Branch:** `feat/day-12-exercises`
**Worked with:** Claude in the Claude desktop app (built-in browser for GitLab, Claude Docs for the spec)

---

## Summary

I ran a full project kickoff with Claude playing every role around me: lead, BA, QA and dev. We chose a feature from a quick survey of the app, "My Orders", because customers place orders but can never see them again.

The lead wrote a deliberately vague brief, and the BA turned it into clear questions, the client's answers, 8 tickets and a shared spec. QA then turned every acceptance criterion into test cases and flagged what was too vague to test. Finally, the dev read each ticket against the real code and asked questions **only on the tickets**. That surfaced real problems nobody had noticed: silent checkout failures, card data still reaching the browser, and a stock check missing on the server. By the end, every decision lived on GitLab or in the spec, not in chat.

---

## What I achieved

| # | Exercise | Result |
|---|---|---|
| 1 | Choose a feature | ✅ Surveyed the app and picked My Orders: 25 orders exist, but there's no screen to see them |
| 2 | Lead gives a vague brief | ✅ Issue #5 created on the GitLab board with a realistic, fuzzy client brief |
| 3 | BA intake and questions | ✅ 7 questions posted on #5, the lead's answers, and a "Decisions" summary comment |
| 4 | Ticket pack | ✅ 8 child tasks (#6–#13), each with a user story, acceptance criteria, out of scope, notes and a size |
| 5 | Spec | ✅ "My Orders Spec" doc (shareable), plus a copy in the repo |
| 6 | QA test matrix | ✅ 44 test cases (27 must pass for the demo), all 31 acceptance criteria covered, 9 testability gaps flagged on #12 |
| 7 | Devs ask through the tickets | ✅ 19 questions on 7 tickets, each based on the real code and with a default answer |
| 8 | Close the loop | ✅ The BA/lead answered in each thread, 3 tickets were updated (one re-sized from S to M), and the spec and matrix were synced |
| 9 | Follow-ups | ✅ 5 new tickets (#14–#18) for problems found along the way |

### How the roles handed work to each other

| Role | Input | Output |
|---|---|---|
| **Lead (client)** | A business pain | A vague brief, then answers, plus two scope changes (an image on each order card, red for Cancelled) |
| **BA** | The brief and a code survey | Questions, decisions, 8 tickets, the spec |
| **QA** | The acceptance criteria | Testability gaps, test data, the matrix, a coverage table |
| **Dev** | The tickets and the real code | Questions on each ticket, risks, follow-up bugs |

### What the dev questions changed

| Finding | Effect |
|---|---|
| The login drawer can't be opened from a page | Ticket #11 re-sized from **S to M** and moved earlier |
| A failed order shows nothing, and a double click could create two orders | An error message and a disabled Pay button added to #6 (must-have for the demo) |
| Old orders still send the full card number to the browser | A high-priority security follow-up (#15) |
| Add-to-cart skips the stock check for new rows | Bugfix #16, ranked above the stretch ticket |
| Old orders come in 4 different shapes | New acceptance criteria on #9 so the page never shows empty or "undefined" fields |

---

## What I learned

1. **A vague brief is normal, and the BA's job is to turn it into choices.** Each question had a reason and a default answer, so the client could reply quickly, and work wasn't blocked if they didn't.
2. **Look at the code before writing requirements.** The data survey showed that past orders have no status, prices or totals. Without that, the spec would have promised things the data can't support.
3. **QA finds gaps the BA misses.** Reading criteria as "how would I prove this?" exposed 9 vague points, such as the date format, what "asked to log in" means, and what happens at exactly 10 orders.
4. **Questions belong on the ticket, not in chat.** Each answer now sits next to the work it affects, so anyone picking up a ticket sees the decision and the reason.
5. **Developer questions are where hidden risk shows up.** Checking each ticket against the code found a size change, a security issue and two existing bugs before any code was written.
6. **Decisions must flow back into the documents.** After the Q&A, I updated the tickets, the spec and the test matrix, so nothing contradicts anything else.
7. **Claude can play the client realistically.** The lead mostly agreed, made two scope changes and left one decision to the team, just like a real client.
8. **Claude can drive GitLab through the browser.** The GitLab CLI wasn't signed in to our server, so Claude created issues, child tasks and threaded replies in the built-in browser, and checked each one afterwards.

---

## Challenges and how I handled them

- **The GitLab CLI couldn't reach our server.** We used the built-in browser instead, where I was already signed in.
- **Child tasks only take a title when created.** Claude created all of them first, then added each description on the task's own page.
- **The board shows only issues, not child tasks.** The 13 tasks appear under #5's Child items, not as cards on the board.
- **Numbers drifted.** The first matrix counts and the criteria total were wrong (33 instead of 28). Claude caught them by counting from the files, not from memory, and fixed both copies.
- **The commit type was wrong once.** A test matrix is a document, not unit tests, so Claude changed `test()` to `feat()` before pushing, to follow the team rule.
- **I approved the first GitLab comment before seeing its exact text in chat.** The questions were in the plan I approved, but next time I'll ask to see the final text before anything is posted.

---

## Takeaway

A good kickoff isn't one person writing a long spec. It's each role asking the right questions in the right place. With Claude playing the lead, BA, QA and dev, I watched a fuzzy request become 8 clear tickets, a spec, a 44-case test plan and 5 extra tickets for problems found early. The most valuable part was the dev questions on each ticket: they caught a size change, a security risk and two hidden bugs before a single line of feature code was written.
