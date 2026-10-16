# Day 05: Auto Memory, Compaction and Checkpointing

**Training project:** Furniture Store (`react-training/practice-one`)
**Date:** 2026-10-16
**Exercises:**
- Part 1: Auto memory + compaction: run a long session, compact, observe what survives.
- Part 2: Checkpointing / `/rewind`: make a bad edit, rewind it. ([jump to Part 2](#part-2-checkpointing-and-rewind))
**Branch:** `feat/day-5-exercises`
**Worked with:** Claude (AI assistant in the Claude desktop app)

---

## Overview

| # | Step | Result |
|---|---|---|
| 1 | Baseline: check context and loaded memory | ✅ 33.3k / 1M tokens (3%), only the root `CLAUDE.md` loaded, memory folder empty |
| 2 | Plant 6 probe facts in different places | ✅ 2 saved to auto memory, 2 kept in chat only |
| 3 | Make the session long with real work | ✅ Context grew to 262k tokens (26%) |
| 4 | `/compact` with no instructions | ✅ 262k → 42.4k tokens |
| 5 | Ask the probes after compaction | ⚠️ 4 kept, 3 partly lost |
| 6 | `/compact` with instructions | ✅ Every fact I asked for was kept |
| 7 | Ask the probes in a brand-new session | ⚠️ Only facts saved on disk survived |
| 8 | Inspect memory, clean up, safety check | ✅ Only the `claude-training` memory folder changed |

### How we split the work

| Me | Claude |
|---|---|
| Asked for each step to be run once, with the result shown | Planned the experiment and the probe questions |
| Asked to limit memory to `claude-training` and keep other projects' memory | Checked how memory is stored and added a safety check |
| Decided which test memory to keep and which to delete | Ran a separate test session with the Claude Code CLI and recorded every result |
| Reviewed the results | Wrote this summary |

---

## Background: where does Claude's knowledge live?

| Place | What it is | Loaded when |
|---|---|---|
| `CLAUDE.md` (repo root) | Team rules, committed to git | At the start of every session, and again after `/compact` |
| Nested `CLAUDE.md` (for example `react-training/practice-one/CLAUDE.md`) | Rules for one folder | Only when Claude reads files in that folder |
| Auto memory | Small notes Claude saves itself, one file per fact plus a `MEMORY.md` index, in `~/.claude/projects/<start-folder>/memory/` | At the start of every session |
| Chat history | Everything said, read and run in the session | Current session only; `/compact` replaces it with a summary |

**Memory is stored per start folder.** Each project gets its own folder under `~/.claude/projects/`. I started every test session from the `claude-training` root, so the memory of my other projects (FoodChoose, g-management, langgraph, Ditto…) could not be touched. A session started from `react-training/practice-one` would use a *different* memory folder.

---

## 1. Baseline

- **Context:** 33.3k / 1M tokens (3%). This model has a 1M-token window, so I triggered compaction by hand instead of waiting for automatic compaction.
- **Memory files:** only the root `CLAUDE.md` (1.1k tokens). The practice-one `CLAUDE.md` was **not** loaded.
- **Auto memory folder:** empty. The other project memory folders were all at 0 files too.

## 2. Plant probe facts

I sent one message containing four facts, and two more facts came up during the session:

| Probe | Fact | Where it was stored |
|---|---|---|
| P1 | Code word `BLUE-PELICAN-42` | Chat only |
| P2 | Wishlist decision: localStorage key `fs-wishlist-v1` | Chat only |
| P3 | Test names written as "should … when …" | Auto memory (`test-name-format.md`, type `feedback`) |
| P4 | Standup at 9:30 every day | Auto memory (`daily-standup.md`, type `user`) |
| P5 | practice-one rules: pnpm only, never hand-edit `src/components/ui/*` | `CLAUDE.md` files on disk |
| P6 | Exact test result: 965 passed, 16 failed, 981 total | Tool output in chat |
| P7 | Contents of `apis/update-stock.ts` | Read into chat |

Claude saved P3 and P4 straight away: one file per fact with a name, description and type, plus a line in `MEMORY.md`. It kept P1 and P2 in chat only, because I said "for this session", and it offered to save P2 as a project decision.

## 3. Make the session long

Three read-only tasks: summarize every file in `src/apis`, run the full test suite, and explain the cart flow from the `Cart` component to `api/server.js`.

- Context: **4% → 26%** (262k tokens; 237.5k of that was chat messages).
- Side finding: **16 tests are currently failing** in furniture-store (8 suites). This is outside the exercise, so I left it as a follow-up.

## 4–5. `/compact` with no instructions, then probe

Context went from **262k to 42.4k tokens**: the chat became a short summary.

| Probe | Answer after `/compact` | Result |
|---|---|---|
| P1 code word | BLUE-PELICAN-42 | ✅ kept in the summary |
| P2 wishlist key | `fs-wishlist-v1` | ✅ kept in the summary |
| P3 test names | "should … when …" | ✅ from auto memory |
| P4 standup | 9:30 every day | ✅ from auto memory |
| P5 practice-one rules | pnpm ✅, never-edit folder "don't know" | ⚠️ the root `CLAUDE.md` was reloaded, but the nested one was lost |
| P6 test numbers | "16 failed… don't know how many passed" | ⚠️ half the number lost |
| P7 file contents | Answered only after **re-reading** the file | ⚠️ contents lost, file name kept |

## 6. `/compact` with instructions

I re-ran the tests, read `practice-one/CLAUDE.md` and the pages, then ran:

```
/compact Keep the code word, every decision we made, exact numbers from tool outputs, and the practice-one CLAUDE.md rules (commands and never-do list).
```

Context went from **106.5k to 39.8k tokens**.

| Probe | Plain `/compact` | `/compact` with instructions |
|---|---|---|
| P1 code word | ✅ | ✅ |
| P2 wishlist key | ✅ | ✅ |
| P5 practice-one rules | ⚠️ pnpm only | ✅ pnpm + never edit `src/components/ui/*` |
| P6 test numbers | ⚠️ 16 failed only | ✅ 965 passed / 16 failed / 981; suites 47 / 8 / 55 |

## 7. New session

| Probe | Answer | Result |
|---|---|---|
| P1 code word | "Don't know" | ❌ |
| P2 wishlist key | "Don't know" | ❌ |
| P3 test names | "should … when …" (from saved memory) | ✅ |
| P4 standup | 9:30 every day (from saved memory) | ✅ |
| P5 practice-one rules | pnpm ✅, never-edit folder ❌ | ⚠️ the nested `CLAUDE.md` isn't loaded at startup |
| P6 test numbers | "Don't know" | ❌ |
| P7 file contents | "Don't know" | ❌ |

## 8. Inspect, clean up, safety check

- Deleted the test-only memory P4 (`daily-standup.md`) and its line in `MEMORY.md`.
- Kept P3 (`test-name-format.md`): test names as "should … when …" are a real preference for this repo.
- Safety check: `claude-training` now has 2 files (`MEMORY.md` + `test-name-format.md`). Every other project memory folder still has 0 files.

---

## Final results: what survives

| Where the fact lives | After plain `/compact` | After `/compact` with instructions | New session |
|---|---|---|---|
| Root `CLAUDE.md` | ✅ | ✅ | ✅ |
| Auto memory | ✅ | ✅ | ✅ |
| Nested `CLAUDE.md` (read during the session) | ❌ | ✅ | ❌ until Claude reads that folder |
| Decision or code word said clearly in chat | ✅ | ✅ | ❌ |
| Exact numbers from tool output | ⚠️ partly | ✅ | ❌ |
| File contents | ❌ re-read | not tested | ❌ |

## What I learned

1. **Anything on disk survives; chat doesn't.** `CLAUDE.md` and auto memory came back after every compaction and in a new session. The chat survived only as a summary, and not at all in a new session.
2. **Summaries keep the meaning but drop details.** Clearly stated facts (a code word, a decision) were kept. Exact numbers and file contents were the first to go.
3. **Tell `/compact` what to keep.** One sentence of instructions saved everything I listed, including things the plain summary had dropped.
4. **Nested `CLAUDE.md` files are fragile.** They load only when Claude reads that folder, and after compaction they act like chat. Rules that must always apply belong in the root `CLAUDE.md`, or I should start Claude from the project folder.
5. **Save lasting decisions on purpose.** Say "remember this for this project" (auto memory) or add the decision to `CLAUDE.md`. Otherwise it is gone in the next session.
6. **Memory is per start folder.** Starting from the repo root kept the experiment away from my other projects. Starting from a subfolder would give a separate memory.
7. **Check and clean memory.** Memory files are plain Markdown that I can read, edit or delete. Test entries should be removed so they don't steer later sessions.

## What I achieved with AI

- ✅ Ran a controlled experiment with 7 probe facts in 4 storage places and 4 checkpoints
- ✅ Measured context use at each step: 3% → 26% → 4% (plain compact) and 11% → 4% (compact with instructions)
- ✅ Showed that `/compact` with instructions keeps exact details that a plain `/compact` drops
- ✅ Found that the nested practice-one `CLAUDE.md` isn't loaded at startup and is lost after a plain compaction
- ✅ Kept the experiment inside `claude-training`, confirmed by before/after file counts
- ✅ Found a side issue to follow up on: 16 failing tests in furniture-store

---

# Part 2: Checkpointing and `/rewind`

**Exercise:** Make a bad edit, rewind it.
**Target file:** `react-training/practice-one/web/furniture-store/src/components/CartButton/index.tsx`
**How I worked:** Claude wrote a step-by-step plan, and I ran every step by hand in a terminal `claude` session started from the repo root.

## Overview

| # | Step | Result |
|---|---|---|
| 0 | Prepare: upgrade the CLI, check `git status` | ✅ Upgraded 2.0.14 → 2.1.301 with the native installer; tree clean except `day-05/` |
| 1 | Make a good edit (a comment above `cartCount`) | ✅ 1 line added |
| 2 | Make a bad edit on purpose | ✅ 3 bad changes, `git diff --stat`: 11 insertions, 21 deletions |
| 3 | `/rewind` code and conversation | ✅ Bad edit gone, chat rewound, Claude only remembers the comment |
| 4 | `/rewind` code only | ✅ File restored, but Claude still remembered the bad edit and got confused |
| 5 | Change a file with a shell command (`sed`), then rewind | ⚠️ The rewind **did** undo it, which differs from the plan's prediction (explained below) |
| 6 | Clean up with git | ✅ `git checkout --` the file; `git status` clean except `day-05/` |

### How we split the work

| Me | Claude |
|---|---|
| Ran each step by hand and chose the rewind points and options | Wrote the step-by-step plan and picked a target file with passing tests |
| Asked to upgrade the old CLI first | Upgraded it with the official installer (retrying after a network timeout) |
| Checked every result with `git diff` | Read my session log afterwards and wrote this summary |

## Step 0: Prepare

- My `claude` CLI was **2.0.14**, installed long ago with npm under nvm. The latest npm version needs Node 22+, so Claude used the official native installer instead. Version **2.1.301** is now at `~/.local/bin/claude` and updates itself.
- Note: my rewind session had already started on the old 2.0.14, a few minutes before the upgrade finished. `/rewind` worked fine there. The old CLI also showed errors from a retired model it used for session titles, another reason to upgrade.

## Step 1: Good edit

Prompt: *"In CartButton/index.tsx, add a short comment above `cartCount` explaining it. Don't change anything else."*
→ Claude added `// Total number of items in the cart`.

## Step 2: Bad edit on purpose

Prompt: *"Always show the red badge even when the cart is empty, rename the aria-label to 'Shopping bag', and remove the forwardRef wrapper."*
→ Claude made all three changes. `git diff --stat`: **11 insertions, 21 deletions**. Removing `forwardRef` breaks the cart drawer trigger, and the label change breaks accessibility and tests.

## Step 3: `/rewind`, restore code and conversation

- I rewound to **before the good edit** and restored both code and conversation, then re-sent the good-edit prompt. This gave a clean timeline with only the good change.
- `git diff --stat`: **1 insertion**, only the comment.
- Asked *"What did we last change in CartButton?"* → *"We added a comment above `cartCount`…"* Claude had no memory of the bad edit, because its conversation was rewound too.

## Step 4: `/rewind`, restore code only

- I repeated the bad prompt, then rewound with **Restore code** only.
- Asked *"Did you change CartButton?"* → Claude said it had made the changes, but the file *"has been reverted… likely by a linter or some other process"*.
- **Lesson:** with "code only", Claude still remembers the edit but sees the old file, so it **guesses wrong about why**: it blamed a linter, not the rewind. Afterwards, tell Claude you rewound, or rewind the conversation too.
- Not done: the "conversation only" option. I skipped it, so that case isn't covered here.

## Step 5: Shell change (`sed`), then rewind

- Prompt: *"Using a bash command (sed), change the aria-label in CartButton to 'Bag'."* Claude ran `sed -i ''`.
- I rewound with **Restore code** to before that prompt. `git diff` then showed **only the comment**, so the "Bag" change was gone. Claude again blamed *"a file watcher or linter"*.
- **Why it worked, unlike the plan's prediction:** the session log shows Claude had been backing up `CartButton/index.tsx` since the first Edit-tool change, which made the file *tracked*. Rewinding restores the whole tracked file from its backup, which also overwrote the `sed` change.
- **The real limit:** checkpoints only back up files that Claude edited with its file-edit tools. A file changed **only** by shell commands (`sed`, `rm`, `mv`, scripts) or by me outside Claude is not backed up, so `/rewind` can't bring it back. Git is still the safety net.

## Step 6: Clean up

- `git checkout -- …/CartButton/index.tsx` restored the original file, comment included.
- `git status`: only `day-05/` untracked. The working tree is clean.
- Not done: running the CartButton tests after each step. The evidence is the `git diff` output and Claude's answers.

## Results: what `/rewind` restores

| Rewind option | File changes | Claude's memory of the chat |
|---|---|---|
| Restore code and conversation | ✅ Restored | ✅ Rewound, so no confusion |
| Restore code only | ✅ Restored | ❌ Still remembers the edit and blames "a linter" |
| Restore conversation only | not tested | not tested |
| Shell change to an **already tracked** file | ✅ Restored (whole file from backup) | n/a |
| Shell change to an **untracked** file | ❌ Not restored (use git) | n/a |

## What I learned

1. **Every prompt creates a checkpoint.** `/rewind` (or Esc twice) lists them, and I choose code, conversation or both.
2. **Rewind both when the whole idea was wrong.** Then Claude forgets the bad path and won't repeat it.
3. **After "code only", tell Claude.** Otherwise it sees a file it doesn't recognize and makes up a reason.
4. **Checkpoints track files, not commands.** They back up files Claude edits with its tools. Shell-only changes and my own changes aren't saved.
5. **Rewind is a quick undo, not a backup.** Commit good work to git, and use `git diff` to check what a rewind really did.
6. **Keep tools up to date.** The old CLI worked, but the native installer gives an always-current, self-updating version.

## What I achieved with AI

- ✅ Upgraded Claude Code from 2.0.14 to 2.1.301 with the official installer, without depending on Node
- ✅ Made a good edit and a bad edit, then removed only the bad one with `/rewind`
- ✅ Compared "code and conversation" with "code only", and saw Claude get confused when only the code was rewound
- ✅ Found from the session log that rewind restores whole tracked files, which explains why the `sed` change was undone
- ✅ Finished with a clean working tree, checked with `git diff` and `git status`
