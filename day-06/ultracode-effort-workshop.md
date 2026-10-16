# Day 06: The "Ultracode" Family (`ultrathink`, `/effort`, plan tiers)

**Training project:** Furniture Store (`react-training/practice-one`)
**Date:** 2026-10-16
**Exercise:** Use the `ultrathink` keyword on a hard bug, then run the same bug at different `/effort` levels and compare. Note which plans each feature is available on.

**Branch:** `feat/day-6-exercises`
**Worked with:** Claude (AI assistant in the Claude desktop app), Claude Code v2.1.301, model Opus 5.5

---

## Overview

| # | Step | Result |
|---|---|---|
| 1 | Learn the controls from the official docs | ✅ `ultrathink`, `/effort` levels, ultracode, plan availability |
| 2 | Check which effort my sessions use by default | ✅ `medium` (the Opus 5.5 default; nothing overrides it) |
| 3 | Pick a real hard bug | ✅ Stock taken from the wrong product: variant ids are reused across products |
| 4 | Run the same bug 5 times: `medium`, `medium` + `ultrathink`, `high`, `xhigh`, `max` | ✅ All 5 finished, each in its own isolated copy of the repo |
| 5 | Score each run with a hidden API check, tests and a review of its report | ✅ All 5 fixed the bug. Higher effort found more and checked more, at a much higher cost |

### How we split the work

| Me | Claude |
|---|---|
| Chose to run the comparison for real instead of leaving blanks | Read the docs and checked my local effort settings |
| Approved the plan and the usage cost | Found a real bug, wrote the shared prompt and a hidden scoring check |
| Reviewed the results | Ran the 5 headless sessions, scored them and wrote this summary |

---

## Background: the four controls

| Control | Scope | What it does |
|---|---|---|
| **`ultrathink`** (a keyword in the prompt) | One turn | Adds an instruction to reason more deeply. **The effort level sent to the API doesn't change.** "think hard" and similar phrases are ordinary text, not keywords |
| **`/effort <level>`** | The session | Sets how much Claude reasons on every turn: `low` · `medium` · `high` · `xhigh` · `max` |
| **Extended thinking** | The model | Always on for Opus 5.5, Sonnet 5.5 and Haiku 5.5, which use adaptive thinking. My `alwaysThinkingEnabled: false` setting has no effect on them |
| **Ultracode** (`/effort ultracode`) | The session | Not an effort level. With it on, Claude runs big tasks as **dynamic workflows** (scripts that coordinate many subagents). It uses many more tokens |

### Ways to set effort (the first one set wins)
1. **An explicit choice:** `CLAUDE_CODE_EFFORT_LEVEL`, `claude --effort <level>`, or `/effort <level>` in a session.
2. **Settings:** `modelSettings` (per model) or `effortLevel`. `effortLevel` accepts `low` to `xhigh`, not `max`, and a top-level `effortLevel` doesn't apply to Opus 5.5.
3. **The model's default:** **`medium`** on Opus 5.5, Sonnet 5.5 and Haiku 5.5, `xhigh` on Opus 4.7, and `high` on other models.

**On my machine** the environment variable and settings are both unset, so every normal prompt runs at **`medium`**.

### Plan-tier availability

| | Pro | Max | Team | Enterprise | API / Bedrock / Vertex |
|---|---|---|---|---|---|
| `ultrathink` and all `/effort` levels | ✓ | ✓ | ✓ | ✓ (admins can cap effort per role) | ✓ |
| Default model | Opus 5.5 | Opus 5.5 | Opus 5.5 | Opus 5.5 | Opus 5.5 (Foundry: Sonnet 4.5) |
| Ultracode / dynamic workflows | Off until turned on in `/config`; workflow size defaults to `small` | ✓ | ✓ | ✓ | ✓ |
| Fable models | May bill to usage credits | Same | Same | Same | n/a |

- **No effort level is locked to a plan.** What the plan changes is **how fast you hit your usage limits**: higher effort, `ultrathink` and ultracode all use more tokens. `/usage` warns about `max` effort and workflows.
- **Any organization can cap effort** with the `maxEffortLevel` managed setting. Enterprise admins can also cap it per role. Requests above the cap are lowered to it.
- **`max` lasts only for the session** unless you set it with the environment variable, and the docs warn it can overthink.

---

## The experiment

### The bug: a real one, not seeded
The shop owner's symptom report, which was the only thing each run was given:

> Customers keep buying the Modern Ceramic Lamp, but its stock never goes down. Meanwhile the Boucle Accent Chair's stock keeps dropping … a checkout showed an "Insufficient stock" problem for a lamp order, and afterwards the stock of some other product we hadn't sold had changed.

What's actually wrong:
1. **Variant ids aren't unique.** Products 1 and 8–26 all reuse variant ids `101` and `102`.
2. **Checkout sends only the variant.** It sends `{ variantId, quantity }`, and `PATCH /products/update-stock` takes stock from the **first** product with that id, which is always product 1.
3. **Hidden second cause:** on "Insufficient stock", the loop `continue`s to the **next** product with the same id and lowers *that* product's stock.
4. **Trap:** a quick "fix" would renumber the ids in `db.json`, which `CLAUDE.md` forbids.

### Setup
- **5 git worktrees**, one per run, so the runs couldn't see each other's edits.
- **Every run was the same:** `claude -p "<same prompt>" --model claude-opus-5-5 --effort <level>`, headless, with workflows turned off and the same allowed tools.
- **Run B** had `ultrathink.` added to the front of the prompt and ran at `medium`.
- **Hidden check,** never shown to the runs: it starts each run's API against a fresh copy of `db.json` and checks 3 things:
  - **H1:** buying product 12 lowers product 12, not product 1.
  - **H2:** an order for all 10 of product 20 empties product 20 and leaves product 8 alone.
  - **H3:** another order for product 20 is then rejected, with no side effects.
  - The unfixed code fails all 3.

### Results: cost

| Run | Effort | Time\* | Turns | Thinking tokens | Output tokens | Cost\*\* |
|---|---|---|---|---|---|---|
| A | `medium` (baseline) | 3m 38s | 29 | 2.1k | 12.9k | $0.96 |
| B | `medium` + `ultrathink` | 6m 30s | 52 | 4.1k | 22.3k | $1.54 |
| C | `high` | 8m 09s | 59 | 5.2k | 25.4k | $1.55 |
| D | `xhigh` | 9m 35s | 48 | 21.2k | 41.6k | $2.13 |
| E | `max` | 17m 48s | 110 | 64.5k | 100.7k | $6.09 |

\* The 5 runs ran in parallel on one Mac, so the times include some contention.
\*\* `total_cost_usd` as reported by Claude Code (the API-equivalent cost). On a subscription this comes out of usage limits instead.

### Results: quality

| | A medium | B ultrathink | C high | D xhigh | E max |
|---|---|---|---|---|---|
| Hidden check H1 / H2 / H3 | ✅✅✅ | ✅✅✅ | ✅✅✅ | ✅✅✅ | ✅✅✅ |
| Found cause 1 (ids reused, looked up by variant only) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Found cause 2 (`continue` falls through to another product) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Made the update all-or-nothing | ✅ | ✅ | ❌ (listed as a follow-up) | ✅ | ✅ |
| Reproduced the bug on the **old** code first | ❌ | ✅ | ✅ | ✅ | ✅ |
| Left `db.json` alone (`CLAUDE.md` rule) | ✅ | ✅ | ✅ | ✅ (cited the rule) | ✅ (cited the rule) |
| Added a regression test | ✅ (web) | ✅ (web) | ✅ (web) | ✅ (web) | ✅ (web + 7 new API tests) |
| Ran lint / type checks | none | `tsc` | none | lint | lint + `tsc` |
| Compared the full test run with the baseline | ❌ | partly | ✅ | ✅ (spotted a flaky test) | ✅ |
| Flagged that checkout ignores stock failures | ❌ | ✅ | partly | ✅ | ✅ |
| Found **other** related bugs (add-to-cart skips the stock check for new rows; `stock \|\| 100` treats 0 as 100) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Size of the change | 5 files | 5 files | 5 files (+ a small `previousStock` fix) | 5 files | 8 files (new `stock.js` module and tests) |

**What every run did:**
- Fixed an outdated test fixture: a card expiring `12/25` was making two Payment tests fail.
- Left the 14 web-test failures that already existed, in 7 unrelated suites, and didn't break anything else.
- Recommended recounting the stock that was already wrong.

---

## What I learned

1. **`medium` was enough to fix this bug.** It's the default on Opus 5.5 and was by far the cheapest and fastest. It found both causes and passed every hidden check.
2. **Higher effort bought rigor, not correctness.**
   - **Reproducing first:** from `ultrathink` and `high` upward, runs reproduced the bug on the old code before fixing it.
   - **Checking more:** `xhigh` and `max` also compared against the baseline test run and ran lint and type checks.
   - **Seeing further:** only `max` found the neighbouring stock bugs.
3. **`ultrathink` is a cheap way to go deeper once.** At the same `medium` effort it cost about 1.6× the baseline. It got close to `high` in rigor (it reproduced the bug first and ran `tsc`) at the same cost, without changing the session's level.
4. **Cost rises steeply at the top.** `max` cost **6.3×** `medium`, with 30× the thinking tokens and 4× the turns. It also made the biggest change, a new module plus API tests, which is good work but more than the ticket asked for. This matches the docs' warning about overthinking.
5. **A cheap middle level is a good default for bug work.**
   - **Everyday tickets:** `medium`.
   - **Bug fixes where verification matters:** `high`, or `medium` + `ultrathink` for one hard turn.
   - **A broad audit** ("what else is wrong around here?"): `xhigh` or `max`.
6. **Plan tier matters for budget, not features.** All levels work on every plan. On Pro and Max the cost shows up as usage limits, and Team and Enterprise can cap effort centrally.

### Limits of this comparison
- **One run per level on one bug,** so some of the differences could be run-to-run noise.
- **Headless runs** (`-p`) couldn't ask me questions or get extra permissions. Some lint and format commands were denied in every run.
- **Parallel runs** shared the CPU, so the times are only roughly comparable.

### How to repeat it
```bash
# one isolated copy per run
git worktree add --detach ../run-medium HEAD
cd ../run-medium
claude -p "<bug report>" --effort medium --output-format json   # duration, turns, tokens and cost are in the JSON
# repeat with --effort high / xhigh / max, and once with "ultrathink. <bug report>" at medium
```
