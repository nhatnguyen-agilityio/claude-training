# Day 10: Fixing What the Review Found (Retro Notes)

**Date:** 2026-10-21
**Exercise:** Fix what the review found, get the merge request green, and note false positives for the retro.
**Worked with:** Claude (AI assistant in the Claude desktop app)

## Summary

I fixed all 12 issues that the two reviews found on the seeded cart-summary branch, added tests that prove each fix, and asked for a second review to check the work. The second review found nothing from the original list. It raised 10 new points: I fixed 2, kept 5 as follow-ups, and found 1 false positive. I also gave the repo its first CI pipeline, so the merge request can show a green check.

## What I achieved

| Goal | Result |
|---|---|
| Fix every issue the reviews found | ✅ All 12 fixed in one commit |
| Prove the fixes with tests | ✅ 13 new tests. They fail on the old code and pass on the new code |
| Keep the build healthy | ✅ Lint, build and all 75 cart tests pass |
| Re-check with a second review | ✅ None of the 12 came back. 2 new points fixed, 5 kept as follow-ups |
| Make the merge request "green" | ✅ Added a GitLab CI pipeline (lint, build, cart tests). ⏳ Waiting for the first run on GitLab |
| Note false positives for the retro | ✅ See below |

## False positives and judgement calls (for the retro)

**First reviews (High and Ultra): 0 false positives.** Every finding pointed at a real problem. Two of them were closer to opinion than bugs: where a type should live, and whether one failed product should hide the whole summary. I fixed both anyway, because they matched the project rules and made the page friendlier.

**Second review (after my fixes): 1 false positive out of 10.**

| Point | My call | Why |
|---|---|---|
| A line "isn't formatted by Prettier" | ❌ **False positive** | Prettier confirmed the file was already formatted. The reviewer said it hadn't checked |
| Money adds up wrong at exactly $500 because of rounding | ✅ Fixed | Rare (no cart from the shop data triggers it), but cheap to prevent |
| Tests write the cache key by hand | ✅ Fixed | It breaks a project rule from `CLAUDE.md` |
| A deleted product leaves the summary stuck on an error | 📌 Follow-up | A real gap, but it needs a product decision |
| "Try again" gives no feedback while it retries | 📌 Follow-up | A small UX polish |
| The product request is defined in two places | 📌 Follow-up | Cleanup, not a bug |
| Two data files for the same endpoint | 📌 Follow-up | A project rule, but moving it is a bigger change |
| Two different price formatters | 📌 Follow-up | Cleanup, not a bug |
| The summary recalculates on every render | ➖ Not worth it | Too small to matter on a cart page |
| A missing product would count as $0 | ➖ Not worth it | Can't happen with today's code |

**What each tool missed** (from the comparison): High missed the product page's shipping promise and the missing hook tests. Ultra missed the type location, the retry and the empty cart case.

## What I learned

- **A review finding is a starting point, not a verdict.** Checking each point before acting turned one false positive into a 1-minute check instead of a wasted change.
- **A test should fail before the fix.** Running the new tests on the old code proved they really catch the bugs. The old tests had all passed with the bugs still in.
- **Reviewing again after fixing pays off.** The second review didn't find the old issues again, but it found two small things my fixes had introduced or left behind.
- **"Green" needs something to turn green.** The repo had no CI, so I had to add a pipeline before a merge request could pass or fail at all.
- **The review's confidence matches its effort.** The High review says plainly when it hasn't verified something, and that was exactly where its false positive came from.

## Challenges and how I handled them

- **The tools didn't match the project.** My global pnpm was too old for the lockfile, so I used the matching version just for this project.
- **Choosing the right comparison.** Every review and check had to compare against the day-9 branch, not `main`, or it would have reviewed hundreds of unrelated files.
- **Old failing tests.** 14 tests in unrelated parts of the app already fail, so the pipeline only runs the cart tests and the old failures don't hide real results.
- **Can't check GitLab runners yet.** I couldn't confirm that GitLab has a runner for the pipeline, so the first push will show it.

## Takeaway

Fixing review findings goes best as a loop: check each finding, fix it with a test that fails first, review again, then let CI confirm. The false positives were rare, and each one took only a quick check to rule out.
