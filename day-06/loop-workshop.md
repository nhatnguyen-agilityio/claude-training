# Day 06: Recurring Prompts with `/loop`

**Training project:** `claude-training` (GitLab MR) and Furniture Store (`react-training/practice-one`)
**Date:** 2026-10-16
**Exercises:**
- Part 1: `/loop 15m` on an open MR, using the built-in maintenance prompt.
- Part 2: A custom loop, `/loop 5m check the deploy`.
- Part 3: Write a `loop.md` for the repo.

**Branch:** `feat/day-6-exercises`
**Worked with:** Claude (AI assistant in the Claude desktop app)

---

## Overview

| # | Step | Result |
|---|---|---|
| 0 | Install `glab`, push the branch, open an MR | ⏳ |
| 1 | `/loop 15m` with the built-in maintenance prompt | ⏳ |
| 2 | `/loop 5m check the deploy` against the local dev servers | ⏳ |
| 3 | Write `.claude/loop.md` and check that bare `/loop` uses it | ⏳ |

---

## Background: what `/loop` does

`/loop` reruns a prompt for as long as the session stays open. Its behaviour depends on what you give it:

| You type | What happens |
|---|---|
| `/loop 5m <prompt>` | Your prompt runs on a fixed cron schedule |
| `/loop <prompt>` | Your prompt runs, and Claude picks the next delay each time (1 min to 1 h) |
| `/loop` or `/loop 15m` | The built-in maintenance prompt runs, or `loop.md` if one exists |

The built-in maintenance prompt does three things, in order: continue unfinished work, look after the branch's PR/MR (comments, CI, conflicts), then run cleanup passes. `loop.md` (`.claude/loop.md` for a project, `~/.claude/loop.md` for a user) replaces that prompt. Recurring tasks expire after 7 days.

---

## Part 1: `/loop 15m` with the built-in maintenance prompt

_To be filled in after the run._

## Part 2: `/loop 5m check the deploy`

_To be filled in after the run._

## Part 3: `.claude/loop.md`

_To be filled in after the run._

## Takeaways

_To be filled in._
