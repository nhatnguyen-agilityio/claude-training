# Day 14: Devs Run Code Review and Fix the Findings

**Date:** 2026-10-27
**Exercise:** Devs run `/code-review` (ultrareview if anything touched auth/data); fix findings.
**Changes reviewed:**
- the checkout stock fix for [#19](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/work_items/19), on `feat/day-14-exercises`
- the CI test suite, [!9](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/9) on `ci/full-test-suite`

**Worked with:** Claude in the Claude desktop app, as reviewer triage and coordinator, with Sonnet sub-agents writing the fixes

---

## Summary

The checkout bug found in this morning's regression (#19) was fixed first. Claude planned the fix, and a Sonnet sub-agent wrote the code and tests. Claude then proved the new tests fail on the old code and pass on the new code. On my decision, the fix went straight onto the day-14 branch instead of through an MR, and #19 was closed.

Then came the review requirement. Two pieces of code were waiting for review, so I sorted them by risk:
- **The #19 fix changes how stock is written to the database.** That's "data", so it got the deep cloud review (`/code-review ultra`).
- **The CI change (!9)** touches neither auth nor data, so the normal review at high effort was enough.

The ultra review found 5 real problems, and the most serious was a design problem the fix itself had created. The high review of !9 found 9, including a version mismatch that would have made CI behave differently from my machine. I chose which findings to fix. Every fix was tested, committed, pushed and reported on the ticket or MR.

---

## What I achieved

| # | Goal | Result |
|---|---|---|
| 1 | Fix the regression bug | ✅ #19 fixed (`7df2dae`): checkout only reduces the stock of the product that was bought. The new tests fail on the old code, so they really catch the bug |
| 2 | Pick the right review for each change | ✅ Ultra for the data change, normal "high" review for the CI change |
| 3 | Ultra review, scoped to the fix only | ✅ 7 files, all in `practice-one`. 5 findings (2 normal, 3 small) |
| 4 | Check findings before fixing | ✅ All 5 confirmed against the code, with a short table of "real or not, fix or ticket, why" |
| 5 | Fix the ultra findings | ✅ All 5 fixed in 3 commits (`6d255e6`, `7c9375b`, `952b353`) |
| 6 | Review !9 at high effort | ✅ 9 findings; I chose 5 to fix now and left 4 for later |
| 7 | Fix the !9 findings | ✅ 5 fixed in `bbf8aa2`, and GitLab's CI lint says the file is valid |
| 8 | Report the results | ✅ Review summaries posted on #19 and !9: findings, fix commits, test results and what's still open |

**Tests after all fixes (day-14 branch):** API 30/30, unit 1033/1033 (up from 1025), e2e 11/11 in three runs in a row, lint and build clean. The real data file was never touched.

### How the work was split

| Who | Did |
|---|---|
| **Me** | Approved the #19 plan, decided to commit straight to day-14, started the ultra review, and chose which findings to fix. Approved every commit, push and post |
| **Claude (Opus) as coordinator** | Planned the fixes, set the review scope, checked every finding against the code, reviewed the sub-agents' work, ran every test and wrote the GitLab updates |
| **Ultra review (cloud)** | A deep multi-agent review of the #19 fix only |
| **Claude as high-effort reviewer** | Reviewed !9 from 8 angles (bugs, removed behaviour, callers, reuse, simplicity, efficiency, root cause, team rules) |
| **Sonnet sub-agents** | Wrote the #19 fix and the 5 ultra-review fixes with their tests, following my cost rule (Opus advises, Sonnet codes) |

---

## What I learned

1. **Match the review to the risk.** Data and auth changes deserve the deep (and billed) review. A CI file doesn't. Deciding which is which took one minute and saved cost.
2. **Scope the review before you pay for it.** The ultra review won't take a folder, only a branch, a commit or a PR. Giving it the commit just before the fix as the base limited it to exactly the 7 files of the fix, instead of the whole branch history.
3. **A fix can create the next bug.** Making the stock update all-or-nothing was right, but checkout still saved the order before updating stock. So one short item could now leave a confirmed order with no stock deducted at all. The tests passed. Only the review saw it.
4. **Fixing at the right depth changes the design.** The real answer to finding 1 wasn't a patch. It was changing the order of checkout: reserve the stock first, then create the order. If anything is short, the shopper sees a message and keeps their cart.
5. **Check every finding before acting.** Each one was confirmed against the code first. That made the fix list easy to approve and kept us from "fixing" things that weren't broken.
6. **Prove a test catches the bug.** Running the new tests against the old code (11 of 16 failed, and the e2e test showed the wrong stock) is what shows they're worth keeping.
7. **Don't trust "it was just a flake".** A sub-agent reported one random e2e failure. Claude reran the suite three times before accepting it. All passed, but checking is what makes that a fact.
8. **A normal review still finds real problems.** The !9 review spotted that the API folder quietly forces pnpm 10 while CI uses pnpm 9, and that the e2e image runs a different Node version. The tests can't catch problems like these, but they would make CI behave differently from my machine.
9. **The person decides what gets fixed.** Claude recommended "fix 2–5 and ticket finding 1", and I chose to fix all five. For !9 I chose 5 of 9. Every choice is recorded on GitLab.
10. **One commit per kind of change.** The ultra fixes went in as three commits (checkout flow, cart input, server tidy-up), so each one is easy to review or revert.
11. **Cheap model for code, strong model for judgement.** Sonnet wrote the fixes and Opus reviewed them. The quality held, and most of the token-heavy work ran on the cheaper model.

---

## Challenges and how I handled them

- **The ultra review refused a folder path.** It accepts only a branch, commit or PR. We used the commit before the fix as the base, and the launch dialog confirmed the scope (7 files) before anything ran.
- **I changed my mind about the MR.** I stopped the MR halfway and asked for the fix to go straight onto the day-14 branch. That branch didn't have the merged day-13 work the fix needed, so Claude asked first, merged it in, applied the fix, and reran every test.
- **The best fix had a trade-off.** If saving the order fails *after* the stock was reserved, that stock stays deducted. We accepted this because it's the safe direction (it can't oversell) and wrote it down on #19.
- **Some findings had to wait.** For !9, I kept the deeper changes for later: pinning pnpm in `package.json`, running pipelines after merge, and two small clean-ups.
- **CI still can't really run.** The project has no CI runner, so the !9 fixes are checked by GitLab's CI lint and by running the commands locally, not by a real pipeline yet.
- **The browser pane closed mid-task.** Claude reopened GitLab and posted the review note without losing anything.

---

## Still open

- Set up a CI runner so !9 runs for the first time.
- The 4 remaining !9 findings: pin pnpm in `package.json`, run pipelines on the target branch, remove a redundant flag, and update the job comments.
- A ticket for `PATCH /carts/:id`, which still skips the stock check on the server.

---

## Takeaway

Code review isn't a box to tick after the tests pass. It's how you find the problems tests don't know to look for. The deep review earned its cost on the data change by finding a design flaw the fix itself had created. The normal review was enough for the CI file and still found a real version mismatch. What made it work was the routine around the review: scope it, check every finding, let me choose, fix at the right depth, prove the fix with tests, and write it all down on the ticket.
