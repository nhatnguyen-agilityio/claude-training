# Day 13: Devs Implement in Parallel Isolated Sessions

**Date:** 2026-10-26
**Exercise:** Devs implement in parallel isolated sessions, plan mode first, PRs per ticket.
**Tickets:** [#16 Add-to-cart skips the stock check for a new cart row](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/work_items/16) and [#17 Login "remember me" doesn't keep the user signed in](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/work_items/17)
**Branch:** `feat/day-13-exercises` (one branch and one MR per ticket on top of it)
**Worked with:** Claude in the Claude desktop app, as a coordinator plus one dev session per ticket

---

## Summary

I picked two follow-up tickets from day 12 and had them built at the same time, by two separate Claude sessions. Each session worked in its own git worktree (an isolated copy of the repo), started in plan mode, waited for my approval, then built, tested, pushed and opened its own merge request.

My main session acted as the coordinator. It prepared the base branch, posted the lead's decision on the ticket, wrote the briefs and checked both results on GitLab. Along the way, one session found 13 hidden failing tests, so I started a third session to fix them.

When I asked "did we really test and review this?", the honest answer was "only partly". So I added the missing steps:
- a read-only code review of every MR
- the review fixes, done by the same dev sessions
- an end-to-end check of both fixes together in the real app, through the in-app browser

All 3 MRs are open, and none are merged.

---

## What I achieved

| # | Goal | Result |
|---|---|---|
| 1 | Pick tickets for parallel work | ✅ #16 (server) and #17 (login), which touch completely different files, so they can't clash |
| 2 | Prepare a shared base | ✅ `feat/day-13-exercises` created and pushed, and the lead's answer ("Remember me" unticked by default) posted on #17 before work started |
| 3 | Run isolated sessions in parallel | ✅ 2 dev sessions, each in its own worktree and branch, working at the same time |
| 4 | Plan mode first | ✅ Both sessions read the code and showed a plan; nothing changed until I approved it |
| 5 | One MR per ticket | ✅ [!5](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/5) for #16 and [!6](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/6) for #17, each linked from its ticket |
| 6 | Prove each fix | ✅ #16: 4 stock checks against a throwaway copy of the data. #17: new tests, 150/150 on the CI list, lint and build clean |
| 7 | Handle what we found | ✅ A third session fixed hidden failing tests ([!7](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/7)): 999/1013 before, 1021/1021 when merged with !6 |
| 8 | Clear MR descriptions | ✅ All 3 rewritten with my `pr-description` skill (What, Why, How tested, Screenshots, Notes) |
| 9 | Code review | ✅ Each MR reviewed by my read-only `reviewer` sub-agent, with evidence for each finding, and posted on the MR after my OK. No blockers |
| 10 | Act on the review | ✅ #16 now rejects invalid quantities (negative, decimal, text). #17 stores only `id` and `username` and has the missing restore tests |
| 11 | End-to-end check | ✅ Both fixes tested together in the real app on a throwaway copy of the data: 6/6 stock checks and 8/8 "Remember me" checks, with screenshots, and results posted on each MR |

### How the work was split

| Who | Did |
|---|---|
| **Me** | Chose the tickets, answered the setup questions, approved each plan, and decided on merge order and conflicts |
| **Coordinator session** | Created the base branch, posted the lead's answer, wrote each brief, checked the MRs, posted the links on the tickets, and spotted the conflict |
| **#16 session** | Fixed the server stock check and tested it on a throwaway copy of the data |
| **#17 session** | Added the "Remember me" checkbox, saved and cleared the login correctly, and added tests and CI coverage |
| **Tests session** | Fixed 13 old failing tests, then removed its Login change to avoid clashing with !6 |
| **Reviewer sub-agents** | Three read-only reviewers, one per MR, in parallel. They tested each concern before reporting it |
| **Coordinator again (QA)** | Ran the end-to-end check in the in-app browser on a throwaway copy, then cleaned everything up |

---

## What I learned

1. **Parallel work only stays safe when the tickets don't share files.** I picked #16 (server only) and #17 (front-end only) so the two sessions could never edit the same file. When the third session did touch a shared test file, it caused a conflict straight away.
2. **Worktrees give each session its own desk.** Each session had its own copy of the code and its own branch, so one session's half-finished work never got in another's way.
3. **Plan mode first keeps me in control.** Each session read the code and explained its plan before changing anything. Approving two short plans was much easier than reviewing two finished changes cold.
4. **Decisions belong on the ticket before work starts.** I posted the lead's "unticked by default" answer on #17 first, so the dev session read it there instead of guessing.
5. **Always check where a worktree starts.** Both worktrees started from `main`, not the day-13 branch. The sessions noticed and fixed it themselves, but I now check the base before any work begins.
6. **A good brief matters as much as a good skill.** My brief included a ready-made one-line MR description, so the sessions followed it and never used my `pr-description` skill. The skill was fine; my brief overrode it.
7. **Parallel work finds hidden problems.** Running the full test suite showed 13 old failures that CI never caught, because CI runs only a short list of tests.
8. **The coordinator should check, not just trust.** I confirmed each branch, changed files and MR on GitLab myself instead of relying only on the sessions' reports. That's how I caught the conflict between !6 and !7.
9. **"Tests pass" isn't the same as "reviewed".** My first summary sounded finished, but nobody had reviewed the code. The review found real gaps the tests had missed: negative and text quantities got through, and a remembered login kept personal data on disk.
10. **Ask the AI to be honest about what was skipped.** When I asked "so we don't have testing and review?", Claude listed exactly what was and wasn't done instead of defending the earlier summary.
11. **End-to-end testing shows how the pieces fit.** In the real app, the product page already blocks most over-stock adds. The server fix is the safety net behind it, and the cart page is a gap that is still open. Unit tests alone couldn't show that.
12. **Fixes go back to the session that has the context.** The review fixes went to the same dev sessions, which already knew the code, so no new session had to learn it again.

---

## Challenges and how I handled them

- **The app wouldn't start sessions from my coordinator turn.** I offered them as cards instead and started both with a click.
- **The worktrees were cut from the wrong branch.** I messaged both sessions with the fix. Both had already spotted it and moved onto `feat/day-13-exercises` before changing anything.
- **Two MRs fixed the same old Login test.** !6 and !7 conflicted. The tests session removed its copy with a normal follow-up commit (no force-push), and !7 now says to merge it after !6.
- **The MR descriptions didn't follow my skill.** The cause was my brief. I drafted all 3 with `pr-description`, reviewed them, then updated them on GitLab, and corrected the !7 title.
- **The API has no automated tests.** #16 was checked by running the server on a throwaway copy of the data, never the real seed file.
- **A session overwrote a good MR description.** While pushing its review fixes, the #17 session replaced the formatted description with one long paragraph. I restored the format with the new facts. Sessions now update descriptions on GitLab, not through the push command.
- **The tests wouldn't start on my default Node (v18).** The test runner needs Node 20, which CI already uses. The reviewers switched to Node 20; adding a version file to the project would stop this tripping up other devs.
- **The Playwright tool was disconnected.** Claude ran the end-to-end check with the app's built-in browser instead, on a combined copy of both branches that was deleted afterwards.
- **Screenshots can't be uploaded from the in-app browser.** I received them locally and attach them to the MRs by hand.

---

## Takeaway

Parallel sessions are like a small team. They move fast when each person has their own space, a clear brief and a plan the lead has approved. With two isolated sessions in plan mode, two tickets became two clean, tested MRs at the same time. The coordinator's job, checking bases, conflicts and results instead of just trusting reports, is what kept the parallel work safe. Building fast in parallel is only half the job: review and an end-to-end check in the real app are what turned "it works on my branch" into a change I can trust.
