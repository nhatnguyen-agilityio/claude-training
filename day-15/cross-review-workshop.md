# Day 15: Cross-Review Between Dev, QA and BA

**Date:** 2026-10-28
**Exercise:** Cross-review: dev reviews QA's test code; QA reviews a dev PR; BA checks merged behavior against the acceptance criteria. Gaps become same-day tickets.
**Done so far:** Part 1, the dev review of QA's test code, with all 9 findings fixed. The dev MR for part 2 is open ([!10](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/10)).
**Worked with:** Claude in the Claude desktop app, as reviewer and coordinator, with a Sonnet sub-agent writing the fixes

---

## Summary

The idea of the day is a role swap: each role reviews another role's work, because each one sees problems the other misses. QA writes tests from the user's side. A dev reads the same tests from the code side and asks whether they would really catch a bug.

Before starting, I set up a new branch for the day and opened an MR (!10) for yesterday's checkout stock fix, so that QA has a real dev MR to review in part 2.

For part 1, I reviewed QA's API and e2e tests with `/code-review` at high effort. It found 9 issues. Before deciding anything, I asked Claude to prove the "weak test" findings by putting the bug into a throwaway copy of the code and checking whether the test noticed. One test missed the bug completely, one gap was real but smaller than it looked, and one turned out to be minor. All 9 became GitLab tickets the same day (#20–#28).

Then I fixed all 9 the same day. A Sonnet sub-agent wrote the fixes, one commit per ticket, and Claude reviewed them and repeated the break-the-code checks. This time every weak test failed when its bug was put back, which proves the fixes work. Each ticket got a closing comment with its commit and proof, and was closed.

---

## What I achieved

| # | Goal | Result |
|---|---|---|
| 1 | Set up the day | ✅ New branch `feat/day-15-exercises` and a `day-15/` folder |
| 2 | Give QA a real dev MR to review | ✅ [!10](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/10) opened for the checkout stock fix, with a reviewed description |
| 3 | Dev review of QA's test code | ✅ `/code-review high` on the API tests and the e2e tests: 9 findings |
| 4 | Prove the weak-test findings | ✅ 3 findings checked by breaking the code on purpose. Results below |
| 5 | Same-day tickets for the gaps | ✅ 9 tasks posted: [#20](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/work_items/20) to [#28](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/work_items/28), each with the problem, the proof and acceptance criteria |
| 6 | Fix the tickets | ✅ All 9 fixed in 9 commits (`4d5e899` to `aa2485b`), pushed, commented and closed |
| 7 | Prove the fixes | ✅ The same broken code now makes each weak test fail. 2 new e2e tests (unticked logout, remembered user wins on reload) |

**Tests after the fixes:** API 31/31 (was 30), unit 1033/1033, e2e 13/13 in two runs (was 11), the add-to-cart group passes when repeated, lint and type check clean. The real data file was never touched.

**What the 9 findings were about:**
- 3 tests that could miss a real bug (the logout test, add-to-cart error cases, the quantity 0 case)
- 2 risks of flaky or misleading failures (a test group that can't pass on a retry, a check made too early)
- 2 coverage gaps (tests tied to the seed data, a spec decision with no test)
- 2 clean-ups (setup code and a selector copied between files)

**What the proof showed:**

| Finding | What we broke | Result |
|---|---|---|
| Logout test | Logout no longer clears the tab's session | ❌ The test still passed: a real gap |
| Add-to-cart error cases | The server saves the cart before checking stock | ⚠️ The API tests still passed, but the e2e test caught it: a real gap, but smaller |
| Quantity 0 | The whole-number rule allows 0 | ⚠️ Still rejected, but by a different rule with the wrong message: minor |

The real data file and my branch stayed untouched during the checks.

### How the work was split

| Who | Did |
|---|---|
| **Me (as dev)** | Ran the review, asked for proof before deciding, chose to ticket every finding and then fix them all. Approved the MR, every ticket, the push and every closing comment |
| **Claude (Opus)** | Ran the review angles, put each bug into a throwaway copy and ran the tests, briefed the sub-agent, reviewed its work, repeated the proof, and drafted the MR, tickets and comments |
| **Sonnet sub-agent** | Wrote the 9 fixes as one commit per ticket and ran every suite, following my cost rule (Opus advises, Sonnet codes) |

---

## What I learned

1. **Green tests don't mean good tests.** A test can pass today and still pass after the bug comes back. Only reading the test, or breaking the code on purpose, shows whether it protects anything.
2. **A review is reading, not running.** I first planned to run every test many times. The real work of "dev reviews QA's tests" is reading them. Running tests is only for proving a finding.
3. **Prove before you decide.** Breaking the code on purpose changed my view of the findings: one was worse than it sounded, one was smaller, and one was minor. Without the proof, I'd have given them all the same weight.
4. **Look at the whole safety net.** The add-to-cart gap was real in the API tests, but the e2e test caught it. A gap in one layer isn't always a gap for the product.
5. **The role swap finds different problems.** QA's tests checked the right features. The dev view found how they could fail: shared data, retries, timing, and copied code.
6. **Same-day tickets keep nothing lost.** Every finding is now a ticket with the proof and clear acceptance criteria, linked to the feature ticket it belongs to.
7. **Discuss first, then act.** I stopped Claude to talk through the plan before anything ran. That's how the plan changed from "run the tests" to "review, then prove".
8. **The same proof works twice.** Breaking the code showed the tests were weak, and breaking it the same way after the fix showed they're now strong. One check, used before and after.
9. **One commit per ticket keeps it traceable.** Each closed ticket points to exactly one commit, so anyone can see what changed for it.

---

## Challenges and how I handled them

- **What counts as a review?** I wasn't sure whether running the tests was the right approach. Talking it through made it clear that the review is reading the code, and running the tests is only for proof.
- **The review needed a target.** QA's tests arrived across several merged MRs, so there was no single MR to review. The normal review accepts folders, so I pointed it at the two test folders.
- **QA needed a dev MR.** Yesterday's fix had been committed straight to the day branch, so I opened !10 for it.
- **Not every finding is equal.** I chose to ticket all 9 but kept the priorities honest: 2 high, 1 medium, 6 low.
- **One fix needed a product decision.** For quantity 0, the shopper got "Missing required fields". I chose the same message as other bad quantities, a one-line server change.
- **The shared test helper couldn't live in the test folder.** Node runs every file in `test/` as a test, so the helper went into `api/support/` instead.

---

## Still open

- Part 2: QA reviews the dev MR !10.
- Part 3: BA checks the merged behavior of #16, #17 and #19 against their acceptance criteria.

---

## Takeaway

The value of the cross-review is the change of viewpoint. QA's tests covered the right behavior, but only a dev reading them asked "would this still pass if the code broke?" Breaking the code on purpose turned opinions into facts, same-day tickets gave every gap a clear definition of done, and the same check after the fixes proved the gaps are closed.
