# Day 15: Cross-Review Between Dev, QA and BA

**Date:** 2026-10-28
**Exercise:** Cross-review: dev reviews QA's test code; QA reviews a dev PR; BA checks merged behavior against the acceptance criteria. Gaps become same-day tickets.
**Done so far:** Part 1, the dev review of QA's test code. The dev MR for part 2 is open ([!10](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/10)).
**Worked with:** Claude in the Claude desktop app, as reviewer and coordinator

---

## Summary

The idea of the day is a role swap: each role reviews another role's work, because each one sees problems the other misses. QA writes tests from the user's side. A dev reads the same tests from the code side and asks whether they would really catch a bug.

Before starting, I set up a new branch for the day and opened an MR (!10) for yesterday's checkout stock fix, so that QA has a real dev MR to review in part 2.

For part 1, I reviewed QA's API and e2e tests with `/code-review` at high effort. It found 9 issues. Before deciding anything, I asked Claude to prove the "weak test" findings by putting the bug into a throwaway copy of the code and checking whether the test noticed. One test missed the bug completely, one gap was real but smaller than it looked, and one turned out to be minor. All 9 became GitLab tickets the same day (#20–#28).

---

## What I achieved

| # | Goal | Result |
|---|---|---|
| 1 | Set up the day | ✅ New branch `feat/day-15-exercises` and a `day-15/` folder |
| 2 | Give QA a real dev MR to review | ✅ [!10](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/merge_requests/10) opened for the checkout stock fix, with a reviewed description |
| 3 | Dev review of QA's test code | ✅ `/code-review high` on the API tests and the e2e tests: 9 findings |
| 4 | Prove the weak-test findings | ✅ 3 findings checked by breaking the code on purpose. Results below |
| 5 | Same-day tickets for the gaps | ✅ 9 tasks posted: [#20](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/work_items/20) to [#28](https://gitlab.asoft-python.com/nhat.nguyen/claude-training/-/work_items/28), each with the problem, the proof and acceptance criteria |

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
| **Me (as dev)** | Ran the review, asked for proof before deciding, and chose to ticket every finding. Approved the MR and every ticket before it was posted |
| **Claude** | Ran the review angles, put each bug into a throwaway copy and ran the tests, drafted the MR description and the 9 tickets |

---

## What I learned

1. **Green tests don't mean good tests.** A test can pass today and still pass after the bug comes back. Only reading the test, or breaking the code on purpose, shows whether it protects anything.
2. **A review is reading, not running.** I first planned to run every test many times. The real work of "dev reviews QA's tests" is reading them. Running tests is only for proving a finding.
3. **Prove before you decide.** Breaking the code on purpose changed my view of the findings: one was worse than it sounded, one was smaller, and one was minor. Without the proof, I'd have given them all the same weight.
4. **Look at the whole safety net.** The add-to-cart gap was real in the API tests, but the e2e test caught it. A gap in one layer isn't always a gap for the product.
5. **The role swap finds different problems.** QA's tests checked the right features. The dev view found how they could fail: shared data, retries, timing, and copied code.
6. **Same-day tickets keep nothing lost.** Every finding is now a ticket with the proof and clear acceptance criteria, linked to the feature ticket it belongs to.
7. **Discuss first, then act.** I stopped Claude to talk through the plan before anything ran. That's how the plan changed from "run the tests" to "review, then prove".

---

## Challenges and how I handled them

- **What counts as a review?** I wasn't sure whether running the tests was the right approach. Talking it through made it clear that the review is reading the code, and running the tests is only for proof.
- **The review needed a target.** QA's tests arrived across several merged MRs, so there was no single MR to review. The normal review accepts folders, so I pointed it at the two test folders.
- **QA needed a dev MR.** Yesterday's fix had been committed straight to the day branch, so I opened !10 for it.
- **Not every finding is equal.** I chose to ticket all 9 but kept the priorities honest: 2 high, 1 medium, 6 low.

---

## Still open

- Part 2: QA reviews the dev MR !10.
- Part 3: BA checks the merged behavior of #16, #17 and #19 against their acceptance criteria.
- Fix tickets #20–#28, starting with the two high ones (#20, #21).

---

## Takeaway

The value of the cross-review is the change of viewpoint. QA's tests covered the right behavior, but only a dev reading them asked "would this still pass if the code broke?" Breaking the code on purpose turned opinions into facts, and same-day tickets made sure every gap has an owner and a clear definition of done.
