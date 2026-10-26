# Day 13: Devs Implement in Parallel Isolated Sessions

**Date:** 2026-10-26
**Exercise:** Devs implement in parallel isolated sessions, plan mode first, PRs per ticket.
**Tickets:** [#16 Add-to-cart skips the stock check for a new cart row](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/work_items/16) and [#17 Login "remember me" doesn't keep the user signed in](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/work_items/17)
**Branch:** `feat/day-13-exercises` (one branch and one MR per ticket on top of it)
**Worked with:** Claude in the Claude desktop app, as a coordinator plus one dev session per ticket

---

## Summary

I picked two follow-up tickets from day 12 and had them built at the same time, by two separate Claude sessions. Each session worked in its own git worktree (an isolated copy of the repo), started in plan mode, waited for my approval, then built, tested, pushed and opened its own merge request.

My main session acted as the coordinator. It prepared the base branch, posted the lead's decision on the ticket, wrote the briefs and checked both results on GitLab. Along the way, one session found 13 hidden failing tests, so I started a third session to fix them. All 3 MRs are open, and none are merged.

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

### How the work was split

| Who | Did |
|---|---|
| **Me** | Chose the tickets, answered the setup questions, approved each plan, and decided on merge order and conflicts |
| **Coordinator session** | Created the base branch, posted the lead's answer, wrote each brief, checked the MRs, posted the links on the tickets, and spotted the conflict |
| **#16 session** | Fixed the server stock check and tested it on a throwaway copy of the data |
| **#17 session** | Added the "Remember me" checkbox, saved and cleared the login correctly, and added tests and CI coverage |
| **Tests session** | Fixed 13 old failing tests, then removed its Login change to avoid clashing with !6 |

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

---

## Challenges and how I handled them

- **The app wouldn't start sessions from my coordinator turn.** I offered them as cards instead and started both with a click.
- **The worktrees were cut from the wrong branch.** I messaged both sessions with the fix. Both had already spotted it and moved onto `feat/day-13-exercises` before changing anything.
- **Two MRs fixed the same old Login test.** !6 and !7 conflicted. The tests session removed its copy with a normal follow-up commit (no force-push), and !7 now says to merge it after !6.
- **The MR descriptions didn't follow my skill.** The cause was my brief. I drafted all 3 with `pr-description`, reviewed them, then updated them on GitLab, and corrected the !7 title.
- **The API has no automated tests.** #16 was checked by running the server on a throwaway copy of the data, never the real seed file.

---

## Takeaway

Parallel sessions are like a small team. They move fast when each person has their own space, a clear brief and a plan the lead has approved. With two isolated sessions in plan mode, two tickets became two clean, tested MRs at the same time. The coordinator's job, checking bases, conflicts and results instead of just trusting reports, is what kept the parallel work safe.
