# Code Review Comparison: High vs Ultra

**Date:** 2026-10-21
**Branch reviewed:** `review/day-10-cart-summary` compared with `feat/day-9-exercises` (seeded cart-summary change)
**Reviews:** `/code-review high` (local) and ultrareview (cloud)

---

## Overview

| | High | Ultra |
|---|---|---|
| Where it runs | Local | Cloud |
| Time taken | About 1 minute | About 20 minutes |
| Findings reported | 9 | 8 |
| Findings verified | No (verification skipped) | Yes, with evidence for each |
| False alarms | 0 | 0 |
| Issues covered (of 12) | 10 | 8 |
| Severity labels | No (ranked only) | Yes (normal / nit) |
| Cost | Included | Free run 1 of 3, then billed |

---

## Issue by issue

| # | Issue | Impact | High | Ultra |
|---|---|---|---|---|
| 1 | An order of exactly $500 is still charged $25 shipping | High | ✅ | ✅ |
| 2 | The summary shows a too-low total while products are still loading | High | ✅ | ✅ |
| 3 | The product page says "Free shipping included", but the cart charges $25 below $500 | High | ❌ | ✅ |
| 4 | Prices lose their trailing zero ("$24.5" next to "$24.50") | Medium | ✅ | ✅ |
| 5 | Every cart product is downloaded twice (different cache key) | Medium | ✅ | ✅ |
| 6 | The cache key is written by hand, which breaks the CLAUDE.md rule | Low | ✅ | ✅ |
| 7 | The product fetch is copied from an existing one and lost its "not found" message | Low | ✅ | ✅ |
| 8 | The same product in two colours creates duplicate queries | Low | ✅ | ✅ |
| 9 | The new data hook has no test file | Low | ❌ | ✅ |
| 10 | The new type is in utils instead of interfaces, which breaks the CLAUDE.md rule | Low | ✅ | ❌ |
| 11 | One failed product hides the whole summary, with no retry | Low | ✅ | ❌ |
| 12 | An empty product list would stay "loading" forever | Low | ✅ | ❌ |
| | **Total** | | **10 / 12** | **8 / 12** |

The issue list comes from checking every finding of both reviews against the code. It's not an official list of the planted bugs.

---

## Scorecard

| Criterion | High | Ultra | Why |
|---|---|---|---|
| Finds the important issues (#1–5) | 7 | 10 | Only Ultra caught the product page promise, which is in a file the change never touched |
| Finds the minor issues (#6–12) | 9 | 6 | High was more thorough on rule breaks and edge cases |
| Accuracy (no false alarms) | 9 | 10 | Both had zero false alarms. Two of High's points are judgement calls |
| Evidence and verification | 6 | 10 | Ultra showed the trigger and the code for each point |
| Severity labels | 7 | 8 | Ultra rated the double download (#5) too low, as a "nit" |
| Speed and cost | 9 | 4 | 1 minute locally, compared with 20 minutes in the cloud and limited free runs |
| **Total (out of 60)** | **47** | **48** | |
| **Score (out of 100)** | **78** | **80** | |

---

## Verdict

| | High | Ultra |
|---|---|---|
| Best at | Fast feedback, small rule breaks and edge cases | Verified findings, problems outside the changed files |
| Weak at | No verification or severity labels, misses issues outside the diff | Slow, limited free runs, skips minor issues |
| Best used | While working on the branch | Once, before merging |

Together the two reviews covered all 12 issues.
