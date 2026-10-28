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
| 0 | Install `glab`, push the branch, open an MR | ✅ MR !4 opened in the browser (`glab` sign-in didn't work) |
| 1 | `/loop 15m` with the built-in maintenance prompt | ⚠️ Job scheduled and cancelled, but it couldn't reach the MR |
| 2 | `/loop 5m check the deploy` against the local dev servers | ✅ 3 runs, all 200, then stopped |
| 3 | Write `.claude/loop.md` and check that bare `/loop` uses it | ✅ A bare `/loop` loaded `loop.md` and paced itself |

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

**Setup:** `glab` was installed but I couldn't sign in to it, so the branch was pushed with `git` and MR !4 (`feat/day-6-exercises` → `feat/day-5-exercises`) was opened in the browser. It targets day 5 instead of `main` because `main` is 26 commits behind, and an MR into `main` would have shown all of them.

**Run:** I typed `/loop 15m` in a separate Claude session.

| What happened | Detail |
|---|---|
| Scheduled job | `45839e84`, a 15-minute autonomous loop (next run was due at 2:32pm) |
| Checking the MR | ⚠️ The GitLab connector timed out and `glab` wasn't signed in, so the loop couldn't read MR !4 |
| Stopping it | I typed `/loop 15m list my scheduled tasks and cancel the loop` |
| Result | Claude listed the job, deleted it, and confirmed the list was empty |

**What I noticed:**
- **My stop command was itself a loop.** Starting it with `/loop 15m` should have scheduled the cancel to repeat every 15 minutes. Claude saw that repeating a cancel makes no sense and ran it only once. The right way is a plain message: "list my scheduled tasks and cancel the loop", or Esc for a self-paced loop.
- **The maintenance prompt needs a working link to the MR.** Without `glab` or a connected GitLab connector it can't see comments or pipelines, so it can only continue local work and do cleanup.

## Part 2: `/loop 5m check the deploy`

**Setup:** there's no real deploy, so the local furniture-store servers played that role. Claude installed the API's dependencies, created the web app's `.env` (`VITE_LOCAL_API_URL=http://localhost:5001`), and started both servers in the background: the API on `:5001` and Vite on `:5173`.

**Command:**
```
/loop 5m check the deploy: curl http://localhost:5001/products and http://localhost:5173, report both HTTP status codes and any errors in one line
```

The leading `5m` made this a fixed-interval loop. Claude created cron job `9971831d` (`*/5 * * * *`), ran the check once right away, and after that the scheduler sent the prompt back into the chat on each run.

| Run | Time | API `/products` | Web | Errors |
|---|---|---|---|---|
| 1 | 14:32:05 (right away) | 200 (8 ms) | 200 (13 ms) | none |
| 2 | 14:36:54 | 200 (6 ms) | 200 (7 ms) | none |
| 3 | 14:41:39 | 200 (7 ms) | 200 (9 ms) | none |

**Stopping it:** I said "stop the loop", and Claude deleted job `9971831d` with CronDelete.

**What I noticed:**
- **The reports are in the chat.** Each run shows up as the loop's prompt, as if I had typed it, followed by Claude's one-line answer. There's no separate log or notification.
- **Runs come about 4m45s apart, not exactly 5 minutes.** A `*/5` job is moved slightly earlier on purpose.
- **A loop is not a cloud routine.** `/schedule` → List showed no routines: the loop exists only in this session. A cloud routine couldn't do this check anyway, because it can't reach `localhost` and can't run more often than once an hour.
- **The outage test (stopping the API mid-loop) was skipped.**

## Part 3: `.claude/loop.md`

The file is in the repo at [`.claude/loop.md`](../.claude/loop.md). From now on it replaces the built-in maintenance prompt whenever someone types `/loop` with no prompt in this repo. It keeps the same order as the built-in prompt (unfinished work → MR → cleanup) and adds what this repo needs:
- **A way to reach the MR without `glab`:** it falls back to the built-in browser, which is signed in, because `glab` sign-in didn't work in Part 1.
- **The real checks:** `pnpm lint` and `pnpm test` in `web/furniture-store`.
- **The repo's rules:** follow the `CLAUDE.md` files, use the `commit-message` format, and never commit to `main`.
- **Guardrails:** ask before pushing, commenting or merging, and start no new work on its own.
- **A one-line result when idle,** so quiet runs stay short.

**Check:** I typed a bare `/loop`. Claude Code found the file and loaded "loop.md tasks with dynamic pacing" with my instructions included in full, in place of the built-in maintenance prompt. Because there was no interval, no cron job was created. Claude ran the first tick right away and then picked its own delay with `ScheduleWakeup`. Each later tick re-reads `loop.md` (the `<<loop.md-dynamic>>` placeholder), so edits to the file apply on the next run.

The first tick did what the file says: it stopped at step 1, because this write-up was unfinished. It filled in this section and committed locally, but didn't push, because the file says to ask first.

## Takeaways

| | Built-in `/loop` | `/loop 5m <prompt>` | `loop.md` + bare `/loop` |
|---|---|---|---|
| What runs | Built-in maintenance prompt | My prompt, unchanged | My repo's maintenance prompt |
| Timing | Fixed (cron) if I give an interval, otherwise Claude picks | Fixed cron, about every 4m45s | Claude picks the next delay |
| Best for | A quick look after a branch or PR | Polling one thing (a deploy, a build) | A repeatable routine with the team's rules built in |

- **The interval decides the mode.** With an interval, `/loop` creates a cron job; without one, Claude chooses each delay.
- **To stop a loop, don't use `/loop`.** Say "cancel the loop", or press Esc for a self-paced loop. Starting the cancel request with `/loop 15m` almost created another repeating job.
- **Reports appear in the chat** as the loop's prompt followed by Claude's answer. There are no notifications or logs.
- **A loop only lives in the session.** It ends when the session closes, it isn't listed under `/schedule`, and it expires after 7 days. A cloud routine (`/schedule`) keeps running without the session, but it can't reach `localhost` and runs at most once an hour.
- **A loop is only as good as its access.** Without `glab` or a working connector, the MR loop couldn't see the MR. `loop.md` gives it a fallback: the signed-in browser.
