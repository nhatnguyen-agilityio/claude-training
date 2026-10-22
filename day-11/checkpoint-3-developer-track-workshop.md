# Day 11: Checkpoint 3 – Developer Track

**Date:** 2026-10-22
**Exercise:** Checkpoint 3: one skill + one hook merged; one MCP tool used end-to-end; one `/code-review` report acted on; role-day exercise done.
**Branch:** `feat/day-11-role-day`, to be merged into `feat/day-11-exercises`
**Worked with:** Claude in the Claude desktop app

---

## Summary

I did a full developer "role day" on one real ticket: **checkout ignored what the customer typed**, so orders were saved with the old card and phone. Along the way I built a new skill and a new hook, used the Playwright MCP to reproduce the bug in the real app and prove the fix, and acted on every finding from a code review. The fix also stopped orders from storing full card numbers. Everything is committed and tested; the merge request is the last step.

---

## What I achieved

| # | Checkpoint item | Result |
|---|---|---|
| 1 | One skill + one hook | ✅ Skill `fix-bug-from-report` and hook `protect-seed-data` built and tested. ⏳ Merged once the MR into the day-11 branch is approved |
| 2 | One MCP tool used end-to-end | ✅ The Playwright MCP placed real orders in the app: once to show the bug, then to prove the fix, twice |
| 3 | One `/code-review` report acted on | ✅ 9 findings, all fixed. A second review found nothing |
| 4 | Role-day exercise | ✅ One ticket taken from bug report to tested fix, review, CI and merge request |

### The ticket, before and after

| What the customer typed | Saved before the fix | Saved after the fix |
|---|---|---|
| Card ending 4242 | Old card ending 1111 ❌ | Only the last 4 digits, 4242 ✅ |
| Phone 84900000111 | Old phone +84 987654321 ❌ | 84900000111 ✅ |
| Name on card "Alice Test" | Old name "Alice Nguyen" ❌ | Alice Test ✅ |
| (nothing) | Full card number, CVV and old leftover fields ❌ | None of these stored ✅ |

---

## What I learned

1. **A skill turns a good habit into a team routine.** `fix-bug-from-report` writes down how we fix bugs: acceptance criteria, a failing test first, the smallest fix, then checks. I followed it step by step, and it kept the work tidy.
2. **A new skill isn't always available in the session that created it.** I had to follow it by hand this time. A fresh session picks it up.
3. **A guard needs to think like someone trying to get around it.** My first version of the hook could be bypassed with a path like `../../api/db.json`, a different letter case, or a different editing tool. Automated security reviews spotted this. Comparing the actual file, not its name, fixed it.
4. **A guard should fail closed.** If the hook can't read its input, it now blocks the edit instead of quietly allowing it.
5. **Test in a sandbox, not on shared data.** Running the app against a throwaway copy of the API let me place real orders without touching the team's seed data, and I proved its fingerprint never changed.
6. **End-to-end testing finds what unit tests miss.** The Playwright run also found that the phone field can't accept "+84", which no test had caught.
7. **Write the failing test first, even when the code is hard to test.** The existing tests faked the form fields, so typing never reached the form. Moving the logic into a small function made it easy to test, and the old failing tests turned out to use an expired test card.
8. **Code review finds more than the original bug.** It flagged that orders stored full card numbers and CVVs, which my fix had kept doing. Fixing the root cause was better than fixing only the reported symptom.
9. **Re-review after fixing.** A short second review confirmed the fixes held and nothing new had appeared.
10. **Protect test credentials too.** Even a seed test password ends up in tool logs, so I deleted the browser logs afterwards.

---

## Challenges and how I handled them

- **The first browser run couldn't log in.** My permission for reading the test password was written the wrong way, and Claude correctly refused to find a way around it. Giving it proper access to the sandbox folder fixed it.
- **The phone field rejected "+84".** I continued with digits only and recorded it as a separate bug to fix later.
- **Three rounds of security feedback on the hook.** Each one was real, so I hardened the hook three times and re-tested it with 11 tricky cases.
- **One test failed once out of eight CI-style runs.** It never failed again, so I couldn't name it. I'll watch for it in the merge request pipeline.
- **The day branches only exist on GitLab, not on `main`.** Following the plan, everything stays inside the day-11 work and is merged into its branch.

---

## Takeaway

A developer day with Claude works best as one loop: a skill that sets the routine, hooks that keep it safe, an MCP tool that tests the real app, and a review that pushes the fix further than the ticket asked. Each tool caught something the others missed, and the strongest habit of the day was proving every step: before and after, in tests, in the browser and in the data.
