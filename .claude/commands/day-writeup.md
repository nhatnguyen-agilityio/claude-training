---
description: Scaffold a day-NN training write-up focused on what I learned and achieved
argument-hint: <day-number> <topic-slug> [one-line exercise description]
allowed-tools: Write, Bash(git log:*), Bash(git branch:*), Bash(date:*), Bash(ls:*)
disable-model-invocation: true
---

Create the skeleton of a training write-up.

## Inputs
- Day number: `$0` (pad to two digits, e.g. `7` → `07`)
- Topic slug: `$1` (kebab-case, used in the file name)
- Full arguments: $ARGUMENTS. The exercise description is everything after
  the day number and topic slug; it's optional.

If the day number isn't a number or the slug isn't kebab-case, stop and ask
me instead of guessing.

## Context
- Today: !`date +%F`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -8`
- Existing write-ups: !`ls day-*/`

## Focus of a daily write-up
The write-up is about **what I learned and what I achieved**, not a technical
report. Keep it short and in plain language:
- No code blocks, diffs, file trees, command output or config snippets.
- Name a file, command or tool only when the lesson depends on it.
- Each lesson is one bold sentence plus one sentence on why it matters.
- Aim for one screen per section; the whole file well under 100 lines.

## What to do
1. Target file: `day-<NN>/<topic-slug>-workshop.md`. If it already exists,
   stop and tell me — never overwrite a write-up.
2. Write the skeleton with exactly these parts:
   - `# Day <NN>: <Title from the topic>`
   - Header block: **Date** (today), **Exercise**, **Branch** (current branch),
     **Worked with** (Claude in the Claude desktop app).
   - `---`
   - `## Summary`: 2–3 sentences on what I set out to do and how it went.
   - `## What I achieved`: a table `| # | Goal | Result |` with results left as `⏳`.
   - `## What I learned`: a numbered list.
   - `## Challenges and how I handled them`: short bullets.
   - `## Takeaway`: 2–3 sentences.
   - Under each section, one short `<!-- TODO: … -->` hint about what goes there.
     Fill in only facts you know from the inputs and context above; don't invent results.
3. Reply with the file path and the list of TODOs I still need to fill in.
