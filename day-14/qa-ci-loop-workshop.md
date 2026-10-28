# Day 14: QA Regression, Automated Suite in CI, and /loop

**Date:** 2026-10-27
**Exercise:** QA regression + automated suite in CI; `/loop` babysits the build.
**Starting point:** 4 open MRs from day 13 ([!5](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/5) stock check, [!6](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/6) remember me, [!7](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/7) old failing tests, [!8](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/8) spec update). Each was tested alone, never together.
**Worked with:** Claude in the Claude desktop app, as QA, then CI engineer, then build babysitter

---

## Summary

I took the role of QA for the day. Claude first combined all four day-13 MRs on a local branch and ran every test we have, plus a manual pass in the real app. Everything passed together, and the manual pass found an older checkout bug that no test covered.

With the build proven, I approved merging the four MRs. Claude then turned the CI pipeline into a real safety net: the full unit test suite instead of a short list, plus the Playwright end-to-end tests in a new stage.

The last part, `/loop` babysitting the build, taught me the most. The loop worked, but it found that the build could never run: the project has no CI runner. The same problem had silently failed yesterday's pipelines too. I then used `/loop` locally to prove the end-to-end tests aren't flaky.

---

## What I achieved

| # | Goal | Result |
|---|---|---|
| 1 | Test all day-13 work together | ✅ !5–!8 combined on a local branch with no conflicts, nothing pushed |
| 2 | Run every automated suite | ✅ 1025/1025 unit tests, lint and build clean, 12/12 API tests, 9/9 e2e tests (twice) |
| 3 | Manual regression pass | ✅ 12 API checks and 3 checks in the real app (login, cart, full checkout), all on a throwaway copy of the data |
| 4 | Report the results | ✅ [`regression-report.md`](regression-report.md), committed |
| 5 | Log what we found | ✅ [#19](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/work_items/19): checkout takes stock from the wrong product. It existed before these MRs |
| 6 | Merge the tested work | ✅ !5 → !6 → !7 → !8 merged after my OK, and the result is file-for-file the build we tested |
| 7 | Automated suite in CI | ✅ [!9](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/9): full unit tests, a new e2e stage, failure reports kept for a week, Node 20 pinned for developers |
| 8 | `/loop` babysits the build | ⚠️ The loop ran and diagnosed the pipeline in minutes: **no runner**. The pipeline itself is still waiting for a runner |
| 9 | Prove the e2e tests are stable | ✅ A `/loop` ran the e2e suite 5 times, 3 minutes apart: 45/45 passed, no flaky tests |

### How the work was split

| Who | Did |
|---|---|
| **Me** | Chose the order of the day, approved the merge, the ticket, the CI change and the MR, and decided what each loop should do |
| **Claude as QA** | Combined the MRs, ran every suite, did the manual pass, wrote the report, and drafted the #19 ticket for my review |
| **Claude as CI engineer** | Wrote the new pipeline, checked it with GitLab's CI lint, ran each job's commands locally, and opened !9 with a full description |
| **Claude as babysitter (`/loop`)** | Watched the pipeline, found why it was stuck, and stopped instead of waiting. Then ran the flaky-test loop and kept the tally |

---

## What I learned

1. **"Each MR passes" isn't the same as "they pass together".** Combining all four on a throwaway branch first gave me the confidence to merge them, without touching the real branches.
2. **Regression testing finds old bugs, not only new ones.** The manual checkout pass showed that buying one product reduces another product's stock. It had been there since the original code, and no test covered checkout.
3. **Manual checks still matter next to automated ones.** All the automated suites were green, and the bug was only found by clicking through the real checkout.
4. **A bug report is only useful with proof.** The #19 ticket has exact steps, expected versus actual results, and the cause, so a developer can pick it up without asking questions.
5. **A pipeline should run when the pipeline changes.** My first CI draft would have skipped every job on the MR that changed it. Adding the CI file to each job's trigger fixed that.
6. **The loop's real value was the diagnosis, not the waiting.** It found in minutes that the project has no runner. Yesterday's MRs had failed for the same reason after 80 minutes in the queue, and nobody had noticed.
7. **Give every loop a stop condition.** "Stop after 5 runs" or "stop when green" keeps a loop from running, and costing tokens, forever.
8. **A loop that can't make progress should stop, not repeat.** When a port was busy, Claude cancelled the loop instead of recording 5 empty failures.
9. **Repeating a test is how you catch flakiness.** One green run proves little. Five runs in a row with the same result is real evidence.
10. **Pick the cheapest way to watch something.** Polling through the browser in an expensive model works but costs a lot. A signed-in `glab` with a background watcher, or a cheaper model, would do the same job for less.
11. **Check before trusting, even mid-task.** When I asked whether the MRs had been merged, Claude checked GitLab directly instead of answering from memory.

---

## Challenges and how I handled them

- **I thought the MRs had been merged without me.** Claude explained that the merge was only on a local test branch, then confirmed on GitLab that all four were still open.
- **The wrong pnpm version started rebuilding my packages.** The default pnpm was older than the lockfile. Claude switched to the matching version, and nothing in the repo changed.
- **A test script sent requests without the JSON header.** Every API call came back as an error, and Claude spotted that the script was at fault, not the app. It reran the checks in a different shell.
- **My other project was using the test port.** Claude didn't stop it on its own. It asked, waited, noticed when it was still running, and only stopped it after I said so.
- **Docker wasn't running**, so the CI jobs couldn't be tried in their real images on my machine. Claude checked everything it could locally and was clear about what only the real pipeline can prove.
- **The project has no CI runner.** That one needs my decision: turn on shared runners, or register a runner on my Mac.

---

## Still open

- Choose a runner, then rerun the `/loop` babysitter on !9 to see its first green pipeline.
- Fix [#19](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/work_items/19), and add an automated checkout test so it can't come back.
- Push this branch (`feat/day-14-exercises`).

---

## Takeaway

QA isn't just "run the tests". It's testing the pieces together, clicking through what the tests don't cover, and writing down what you find so someone can act on it. CI only helps if it actually runs, and `/loop` earned its place by showing me quickly that ours didn't, something that had gone unnoticed for a day. A loop with a clear job and a clear stop condition is a cheap, patient teammate, whether it's watching a pipeline or running the same tests five times in a row.
