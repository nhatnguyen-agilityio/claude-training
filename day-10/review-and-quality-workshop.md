# Day 10: Review and Quality

**Date:** 2026-10-21
**Exercise:** `/code-review` on a real branch, then ultrareview (`/code-review ultra`) on a seeded-buggy branch, and compare the signal. Then fix what the review found, get the merge request green, and note false positives for the retro.
**Branch:** `review/day-10-cart-summary` (to be pushed as `feat/day-10-cart-summary`)
**Worked with:** Claude in the Claude desktop app

---

## Summary

I put two kinds of Claude code review side by side on the same buggy cart-summary change: the quick local `/code-review` and the deep cloud ultrareview. Then I fixed everything they found. Between them the two reviews found 12 real issues with no false alarms, and all 12 are now fixed with tests that prove it. The repo also got its first CI pipeline so the merge request can show a green check. The fixes are committed but not pushed yet, and the first pipeline run on GitLab is still to come.

---

## What I achieved

| # | Goal | Result |
|---|---|---|
| 1 | Review the seeded branch with the local `/code-review high` | ✅ 9 findings in about 1 minute, covering 10 of the 12 issues |
| 2 | Review the same branch with ultrareview | ✅ 8 verified findings in about 20 minutes, covering 8 of the 12. Used 1 of my 3 free runs |
| 3 | Compare the signal | ✅ Both had 0 false alarms. High scored 78/100 and Ultra 80/100, and together they caught all 12 |
| 4 | Fix what the reviews found | ✅ All 12 issues fixed, with 13 new tests that fail on the old code and pass on the new |
| 5 | Check the fixes with a second review | ✅ None of the 12 came back. 2 new small points fixed, 5 kept as follow-ups, 1 false positive |
| 6 | Get the merge request green | ✅ Added a GitLab CI pipeline, and lint, build and all 75 cart tests pass locally. ⏳ First run on GitLab after the push |
| 7 | Note false positives for the retro | ✅ Written up in the retro notes |

### The two reviews at a glance

| | `/code-review high` | Ultrareview |
|---|---|---|
| Runs | On my machine, in my session | In the cloud |
| Time | About 1 minute | About 20 minutes |
| Proof | No proof for its findings | Each finding is reproduced and verified |
| Strong at | Rule breaks and edge cases in the changed files | Problems outside the change, like a product page promise that no longer matched |
| Cost | Normal usage | 3 free runs, then usage credits |
| Best used | While working | Once, before merging a big change |

---

## What I learned

1. **The two reviews complement each other.** Neither found everything alone, but together they covered all 12 issues.
2. **Verification is what you pay for with ultrareview.** It was slower and found fewer small issues, but every finding came with proof, and it caught a problem in a file the change never touched.
3. **Always tell a review what to compare against.** In this repo, `main` holds only day 1, so a review without a base branch would have covered hundreds of unrelated files, or been refused.
4. **A finding is a starting point, not a verdict.** Checking each point first meant the one false positive cost a 1-minute check instead of a pointless change.
5. **A test should fail before the fix.** The existing tests all passed with the bugs in place. Running my new tests on the old code proved they really catch each bug.
6. **Review again after fixing.** The second review found two small gaps that my own fixes had left.
7. **"Green" needs a pipeline.** The repo had no CI, so a merge request could never pass or fail until I added one.

---

## Challenges and how I handled them

- **The seeded branch wasn't where I expected.** It didn't exist on GitLab until it was pushed, and then it was already open in another session's folder. I checked it out in its own folder under a new branch name instead.
- **The wrong default base.** Every review and check used the day-9 branch as the base, never `main`.
- **Old tools.** My global pnpm was too old for the project's lockfile, so I ran the matching version just for this project.
- **Old failing tests.** 14 tests in unrelated parts of the app already fail, so the pipeline runs only the cart tests. That way it stays a fair signal for this change.
- **Unknown CI runner.** I couldn't confirm that GitLab has a runner for the new pipeline. The first push will show whether it runs.

---

## Takeaway

Use the quick local review while working and the verified cloud review once before merging, because together they miss very little. Treat what they find as a loop: check each finding, fix it with a test that fails first, review again, and let CI confirm.
