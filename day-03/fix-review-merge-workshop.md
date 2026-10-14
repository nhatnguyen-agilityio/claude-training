# Day 03: Fix, PR, Code Review and Merge

**Training project:** ToDo App (JavaScript Training)
**Date:** 2026-10-14
**Ticket:** [BUG: ToDo App — completed todos become uncompleted after refreshing the page](https://trello.com/c/DhqL1mqO)
**Pull request:** [nhatnguyen-agilityio/claude-training#1](https://github.com/nhatnguyen-agilityio/claude-training/pull/1) (merged)
**Worked with:** Claude (AI assistant in the Claude desktop app)

---

## Overview

| # | Workshop | Result |
|---|---|---|
| 1 | Fix the Day-2 bug on a branch, small commits, test included | ✅ Fixed on `fix/todo-completed-status`: small commits, 6 tests |
| 2 | Write the PR description, draft with Claude, open the PR | ✅ PR #1 opened with what/why/how/how tested/screenshots |
| 3 | Code-review checklist walkthrough, ≥3 actionable comments | ✅ 5 actionable comments covering all 5 checklist areas |
| 4 | Resolve a seeded conflict, merge, delete the branch | ✅ Conflict resolved, PR merged, branch deleted everywhere |

### How we split the work

| Me | Claude |
|---|---|
| Chose what to do next and approved each step | Planned each workshop step by step |
| Made the decisions (test tool, commit names, which branches, public repo) | Ran git, tests, the browser and Trello for me |
| Rewrote my PR prompt using the 4D framework | Drafted the PR description and took real screenshots |
| Played the dev, then the technical lead | Played the technical lead, then helped as the dev |
| Signed in to GitHub myself (no passwords shared with the AI) | Asked before every outward action: push, create repo, post, merge |

---

## 1. Fix the Day-2 bug on a branch, with small commits and a test

### What the workshop asked
- Fix the Day-2 bug **on a separate branch**.
- Use **small commits**, each doing one thing.
- Include a **test** that proves the fix.

### What we did
- Created the branch `fix/todo-completed-status` from `feat/day-2-exercises`.
- Confirmed the existing test **failed before the fix** (the "before" proof).
- Worked in small steps, one commit each:
  1. `test():` add a safety-net scenario (unticking a todo)
  2. `fix():` the fix itself
  3. `refactor():` remove the code the fix made unused
- Checked the fix **by hand in the browser**, not only with tests.

### What I learned about using AI for this work
- **Ask for the plan first:** "Let me know the plan step by step" gave me a full checklist (branch → test → fix → clean-up → push → PR) before anything changed.
- **Ask "what will we do in this step?"** before saying "do it". Then I understand and approve each change instead of just receiving it.
- **Delegate the git work:** creating the branch, staging only the right file, writing the commit and pushing, all from one short request per step.
- **Ask the AI to prove its work:** Claude ran `npm test` before and after each change and showed me the results.
- **Use the AI's browser for a real check:** Claude ran the app, clicked through the repro steps and showed the result. When it made a mistake (deleting twice), it told me and did the check again.

### What I achieved with AI
- ✅ The full fix delivered from short instructions: branch, 3 small commits and a push
- ✅ Every step **explained first, then done**, so I understood the test → fix → refactor order
- ✅ AI-run evidence: tests went from **2 failed** to **all passing**, plus a hand check in the browser

---

## 2. Write the PR description and open the PR

### What the workshop asked
- Write a PR description with **what / why / how tested / screenshots**.
- **Draft it with Claude, then edit it by hand.**
- Open the PR against the training repo.

### What we did
- **Rewrote my prompt with the 4D framework** before asking Claude:
  - **Delegation:** the AI drafts; I check the facts, add the screenshots and submit.
  - **Description:** I gave all the facts (ticket, branches, root cause, commits, test results), the audience, the format and a 500-word limit.
  - **Discernment:** "Don't invent results; list questions instead of guessing."
  - **Diligence:** verify every fact and use real screenshots.
- Claude drafted the description (**265 words**) and listed **3 questions** for me, including one about old saved data.
- Created a **GitHub repository** and pushed the branches, with GitLab kept as the main remote.
- Claude **ran the app and the tests and took real screenshots**: the bug before the fix, the fix after, and `npm test` before and after.
- Opened **PR #1** on GitHub with the description and the screenshots.

### What I learned about using AI for this work
- **Use the AI to improve my own prompt:** I asked Claude to check my prompt against the 4D framework and rewrite it, before using it.
- **A prompt full of facts gets a factual answer.** Giving the ticket, commits and test results meant the draft had nothing invented.
- **Ask the AI to list what it's unsure about.** One of its questions (old saved data) later became the main review finding.
- **Ask for a measurable result:** "Give the final word count" let me check the 500-word limit right away.
- **The AI can drive a website for me:** in the app's built-in browser, Claude filled in GitHub's "new repository" form, opened the PR and pasted the description.
- **The AI can make the evidence too:** it ran the bugged and the fixed versions and took real screenshots for the PR.
- **Know the limits:**
  - The AI **must not enter my passwords**, so I signed in to GitHub myself.
  - It **can't upload files** in the browser, so it hosted the screenshots on a separate branch instead.

### What I achieved with AI
- ✅ My prompt was reviewed by the AI and improved with the 4D framework
- ✅ A 265-word, fact-based PR description drafted from that prompt
- ✅ A GitHub repository created, a second remote added and every branch pushed by the AI
- ✅ PR #1 opened by the AI, with 3 real screenshots it took itself

> **Honest note:** the workshop asks me to edit the draft by hand. I mostly used Claude's draft as it was. Next time, I'll edit it in my own words before posting.

---

## 3. Code-review checklist walkthrough

### What the workshop asked
- Review a PR in this order: **correctness → tests → readability → security basics → scope**.
- Leave **at least 3 actionable comments**.

### What we did
- Claude played my **technical lead** and reviewed PR #1:
  - Read the ticket and the PR description first
  - Ran the tests
  - **Checked every concern with a quick test before commenting**, so each comment had evidence
- **5 actionable comments**, each with *what + why + suggestion* and a label:

| Area | Finding | Label |
|---|---|---|
| Correctness | Data saved by the old version lost its completed status | 🔴 blocker |
| Tests | No test for old saved data or for right-click delete | 🟡 suggestion |
| Readability | Saving depended on element order | 🟡 suggestion |
| Security basics | Typed HTML was inserted into the page as HTML | follow-up ticket |
| Scope | Each add attached extra delete listeners | nit, follow-up ticket |

- Posted the review on GitHub: 3 inline comments plus a summary with the checklist table.
- **Back in the dev role**, I fixed the blocker and added the tests as **2 more small commits**, replied to every comment, and resolved the fixed threads.

### What I learned about using AI for this work
- **Give the AI a role and a checklist:** "You are my technical lead, follow correctness → tests → readability → security basics → scope" produced a structured, ordered review.
- **Ask the AI for evidence, not opinions:** Claude wrote small throwaway tests to prove each problem before commenting.
- **The AI can post the review for me:** it added the inline comments and the summary on GitHub through the browser, after I said yes.
- **Switch roles in the same conversation:** after the review, I asked Claude to act as the dev, fix the comments, reply and resolve the threads.
- **The AI explains platform limits:** GitHub doesn't let an author "Request changes" on their own PR, and inline comments only work on changed lines. Claude explained this and adapted.

### What I achieved with AI
- ✅ A full 5-area review from one role-play prompt
- ✅ **5 evidence-backed comments** posted on GitHub by the AI (3 were required)
- ✅ A real blocker found by the AI reviewer that my tests had missed
- ✅ The blocker fixed, tests added, replies posted and threads resolved, all with AI help

> **Honest note:** there was no human partner. Claude played the technical lead and reviewed my own PR. Next time, I'll swap PRs with a real partner.

---

## 4. Resolve a seeded conflict, merge and delete the branch

### What the workshop asked
- Create a **merge conflict** on purpose and resolve it on the PR.
- **Merge** the PR.
- **Delete** the branch.

### What we did
- **Seeded the conflict:** acting as a teammate, we changed the same line on `feat/day-2-exercises` that the PR changed.
- **Resolved it** by merging the base branch into the PR branch and **keeping both changes**, not just one side.
- Checked there were **no conflict markers left** and that **all tests passed** before committing.
- Waited for GitHub's merge check, then **merged with a merge commit** to keep the small commits.
- **Deleted the branch** on GitHub, locally (with the safe `git branch -d`) and on GitLab.
- **Synced GitLab** with GitHub so both match.
- **Closed the loop on Trello:** added a comment with the PR link and moved the card to **Done**.

### What I learned about using AI for this work
- **The AI can play a "teammate"** to create realistic practice situations, such as a conflicting change on the base branch.
- **Ask the AI to show its reasoning on a conflict:** Claude showed both sides and explained why it kept both, instead of picking one blindly.
- **The AI checks its own result:** it searched for leftover conflict markers and ran the tests before committing.
- **The AI uses safe commands:** when `git branch -d` refused, it found out why instead of forcing it with `-D`.
- **The AI can work around a slow tool:** while GitHub's page was stuck, it checked GitHub's API in the background.
- **One request can cover several tools:** "sync to GitLab" and "do it with Trello" were handled through git and the Trello connector.

### What I achieved with AI
- ✅ A conflict seeded, explained and resolved with AI help
- ✅ PR #1 merged and the branch deleted on GitHub, locally and on GitLab
- ✅ GitHub and GitLab synced from one short request
- ✅ The Trello card updated with the PR link and moved to **Done** through the Trello connector

---

## What I learned overall: using AI for automation work

1. **Plan before action.** Ask "what are the steps?" or "what will this step do?" before "do it". This kept me in control.
2. **Give the AI a role.** Reporter, BA, dev, technical lead and teammate roles each gave focused, useful results.
3. **Write prompts with the 4D framework.** Delegation, Description, Discernment and Diligence give better and safer results. The AI can also review and rewrite my prompt.
4. **Connect the AI to my tools.** In one conversation it used git and the terminal, the in-app browser (GitHub), GitLab and the Trello connector.
5. **Ask for evidence.** Tests before and after, screenshots, small proof tests and API checks show whether the AI's work is right.
6. **Approve outward actions.** The AI asked before pushing, creating the repo, posting comments and merging, and I said yes or no each time.
7. **Keep some things myself.** Passwords and sign-ins, public or private choices, and company rules about sharing code stay my responsibility.
8. **Know the AI's limits and workarounds.** No password entry, no file uploads in the browser, and GitHub rules about authors. The AI explained each one and found a safe alternative.
9. **Use the AI to document the work.** It wrote my summaries and notes, like this file.

## What I achieved overall with AI

- ✅ Completed all 4 workshops by working with Claude: fix → PR → review → conflict and merge
- ✅ Automated a full real-world flow with AI: **ticket → branch → test → fix → PR → review → fixes → conflict → merge → clean-up → ticket Done**
- ✅ Used the AI across **5 tools**: git and the terminal, Jest tests, the in-app browser (GitHub), GitLab and the Trello connector
- ✅ Used the AI in **4 roles**: dev assistant, technical lead reviewer, teammate and documentation writer
- ✅ Improved my prompting with the **4D framework**, with the AI reviewing my own prompt
- ✅ Got **evidence** for every result: 6 passing tests, real screenshots, and review comments backed by proof tests
- ✅ Stayed in control: each outward action was approved by me, and no passwords were shared with the AI
