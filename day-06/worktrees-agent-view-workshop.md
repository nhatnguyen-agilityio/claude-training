# Day 06: Parallel Isolated Sessions with Git Worktrees and Agent View

**Training project:** Furniture Store (`react-training/practice-one`)
**Date:** 2026-10-16
**Exercise:** Run parallel isolated sessions on two tickets (git worktrees), and watch both in agent view.

**Branch:** `feat/day-6-exercises` (both fix branches start from it)
**Worked with:** Claude (AI assistant in the Claude desktop app), Claude Code v2.1.301

---

## Overview

| # | Step | Result |
|---|---|---|
| 1 | Create two real tickets in GitLab | ✅ Issue #3 and issue #4 |
| 2 | Create one git worktree per ticket from the current branch | ✅ `ct-issue-3` and `ct-issue-4`, each on its own `fix/…` branch |
| 3 | Run one Claude session per ticket, in parallel | ⚠️ #3 ran in its worktree. #4 started in the main folder by mistake |
| 4 | Fix the mistake | ✅ Moved the #4 commit to its own branch with `cherry-pick` + `reset --keep` |
| 5 | Watch both sessions in agent view | ✅ Two background review sessions, one per worktree, shown side by side |
| 6 | Review both fixes | ✅ #3 is correct and complete. ⚠️ #4 is correct but not complete |

### How we split the work

| Me | Claude |
|---|---|
| Asked for two real tickets before starting | Wrote the two tickets so they touch different files, and created them in GitLab after I approved |
| Chose to do the worktree steps by hand, from the current branch | Wrote the step-by-step plan |
| Ran `git worktree add`, started both sessions and gave them their prompts | Explained why agent view was empty, and noticed #4 was in the wrong folder |
| Asked Claude to fix it and show agent view | Moved the #4 commit to the right branch and started two background review sessions |
| Reviewed the results | Wrote this summary |

---

## Background

### What a git worktree is
A worktree is an **extra working folder for the same repository**, checked out on its own branch. Every worktree shares the one `.git` history, so commits, branches and stashes are visible from all of them at once. Each session gets its own copy of the files, so two Claude sessions can edit at the same time without overwriting each other.

```
Training/claude-training/   ← main checkout   (feat/day-6-exercises)
Desktop/ct-issue-3/         ← worktree        (fix/issue-3-stock-wrong-product)
Desktop/ct-issue-4/         ← worktree        (fix/issue-4-sold-out-quantity)
        └── all share claude-training/.git
```

### Two ways to make one

| | `claude --worktree <name>` | `git worktree add <path> -b <branch>` (what I used) |
|---|---|---|
| Where | `.claude/worktrees/<name>/` in the repo | Wherever you choose |
| Branch | `worktree-<name>` | Your own name, such as `fix/issue-3-…` |
| Starts from | `origin`'s default branch unless `worktree.baseRef: "head"` is set | **Your current branch** |
| Isolation checks | Claude Code blocks edits outside the worktree | The session is safe only if you start `claude` **inside** the folder |
| Cleanup | Claude offers to remove it when you exit | `git worktree remove <path>` |

I used `git worktree add`, for two reasons:
- **The default base would be empty.** My `origin/main` only contains `day-01/`, so `--worktree` would have started from a branch with no app code.
- **The branch names follow the team's convention** (`fix/…`) straight away.

### What agent view is
`claude agents` opens one screen listing **background** Claude sessions, grouped as *Needs input*, *Working* and *Completed*, with a one-line summary each. A session gets there in three ways:
- **`←` on an empty prompt** (or `/bg`) moves a running session to the background.
- **`claude --bg --name <name> "<prompt>"`** starts a session in the background.
- **Typing a prompt** in agent view's own input box.

---

## What I did

### 1. Two tickets that don't overlap
Claude drafted two tickets from bugs found earlier today. They change different files, so they can run in parallel without merge conflicts. I approved them, and Claude created them in GitLab:

| Issue | Problem | Files |
|---|---|---|
| **#3**: Buying one product lowers another product's stock | Variant ids `101`/`102` are reused by 20 products, so the stock update lowers the first product it finds | `api/server.js`, `update-stock.ts`, `Payment/index.tsx` |
| **#4**: A sold-out variant can still be bought | `stock \|\| 100` turns stock 0 into 100 | `ProductInfo/index.tsx`, `CartItem/index.tsx` |

### 2. Create the worktrees from the current branch
```bash
git branch --show-current     # feat/day-6-exercises
git worktree add "../../../ct-issue-3" -b fix/issue-3-stock-wrong-product
git worktree add "../../../ct-issue-4" -b fix/issue-4-sold-out-quantity
```
I ran these from the **repo root** instead of `react-training/practice-one`, so `../../../` pointed at my Desktop and the worktrees ended up in `/Users/nhatnguyen/Desktop/ct-issue-3` and `ct-issue-4`. That's fine, since a worktree can live anywhere. It also explains my next error: `cp web/furniture-store/.env …` failed because that path doesn't exist at the repo root. With full paths, copying `.env` and running `pnpm install` in each worktree worked.

### 3. Run the two sessions in parallel
| Session | Folder | Took | Commit |
|---|---|---|---|
| #3 | `ct-issue-3/react-training/practice-one` ✅ | 5m 13s | `715a0e5`: `bugfix(): lower stock only for the purchased product on checkout` |
| #4 | `claude-training` (the **main** checkout) ❌ | 3m 42s | `64146db`: `bugfix(): block adding sold-out variants to cart when stock is 0` |

**What went wrong with #4:** I started it in a terminal that was still in the main folder. It fixed the bug well, but it edited and **committed directly onto `feat/day-6-exercises`**. The worktree only protects a session that is started inside it.

### 4. Fixing the misplaced commit
The commit wasn't pushed, so it was easy to move:
```bash
cd /Users/nhatnguyen/Desktop/ct-issue-4
git cherry-pick 64146db            # copy the fix onto fix/issue-4-sold-out-quantity → b3a9b31

cd ".../claude-training"
git reset --keep 8ed5bab           # take it off feat/day-6-exercises, keeping my uncommitted lockfile change
```
`--keep` matters here: unlike `--hard`, it refuses to throw away uncommitted work. That kept my unrelated `api/pnpm-lock.yaml` change.

### 5. Watching both in agent view
**First try: agent view was empty** ("0 awaiting input · 0 working · 0 completed"). Both sessions were still running in the **foreground** of their terminals, and agent view only lists background sessions.

**Second try:** Claude started a short review session in each worktree, directly in the background:
```bash
cd /Users/nhatnguyen/Desktop/ct-issue-3/react-training/practice-one && claude --bg --name review-issue-3 "Review the last commit … Don't edit files or commit."
cd /Users/nhatnguyen/Desktop/ct-issue-4/react-training/practice-one && claude --bg --name review-issue-4 "Review the last commit … Don't edit files or commit."
```
Both rows appeared in agent view right away (`review-issue-3`, `review-issue-4`, *starting… → working → completed*), each running in its own folder at the same time.

### 6. What the reviews found
- **#3 is correct and complete.**
  - `productId` now goes through the whole path (type → Payment → server).
  - The server finds the variant using `productId` + `variantId`.
  - New tests cover two products that share variant `101`.
  - The only gap: `server.js` has no tests of its own.
- **#4 is correct but not complete.** `ProductInfo` and `CartItem` now use `?? 0`, show "Sold out" and disable the buttons. But a sold-out variant can still be added:
  - from **product cards** (`ProductItem`), which have no sold-out check;
  - through **`/carts/add-to-cart`** on the API, which checks stock only when the item is already in the cart.

  These need to be added before #4's MR is merged.
- **Both: no new test failures.** The 14–16 failures were in suites neither commit touched (Button, Sidebar, Login, …). On the #4 branch, Payment also still fails because its expired test card (`12/25`) is only fixed on the #3 branch.

### Final state
```
$ git worktree list
…/Training/claude-training   8ed5bab [feat/day-6-exercises]
/Users/nhatnguyen/Desktop/ct-issue-3   715a0e5 [fix/issue-3-stock-wrong-product]
/Users/nhatnguyen/Desktop/ct-issue-4   b3a9b31 [fix/issue-4-sold-out-quantity]
```
Nothing is pushed yet, and no MRs have been opened.

---

## What I learned

1. **A worktree isolates folders, not sessions.** It only protects a session that is started **inside** it. If I start `claude` in the wrong terminal, it happily edits the main checkout. `claude --worktree` is safer, because Claude Code itself then blocks edits outside the worktree.
2. **Always check where you are before starting a session.** Run `pwd` and `git branch --show-current`. Both of my mistakes today (worktrees landing on the Desktop, and #4 in the main folder) came from running a command in the wrong folder.
3. **Shared history makes mistakes easy to fix.** All worktrees share one `.git`, so a commit made on the wrong branch can be copied with `git cherry-pick` and removed with `git reset --keep`, without copying any files between folders.
4. **A worktree only contains tracked files.** Gitignored files like `.env` and `node_modules` have to be copied or installed in each worktree. A `.worktreeinclude` file does the copying automatically for `claude --worktree`.
5. **Agent view only shows background sessions.** To watch sessions there, start them with `claude --bg`, or press `←` / `/bg` in a running one. A foreground session never shows up.
6. **Plan tickets so they don't touch the same files.** #3 and #4 changed different files, so they could run fully in parallel and will merge without conflicts.
7. **A parallel reviewer is cheap and useful.** The background review sessions found real gaps in #4 (product cards, the add-to-cart API) that the fixing session missed.
8. **`--worktree` starts from the default branch.** By default it branches from `origin`'s default branch. In this repo that's an almost empty `main`, so either set `"worktree": { "baseRef": "head" }` or create the worktrees yourself with `git worktree add`.

### Agent view controls I used

| Key / command | What it does |
|---|---|
| `claude agents` | Open agent view |
| `←` on an empty prompt, or `/bg` | Send the current session to the background |
| `claude --bg --name <n> "<prompt>"` | Start a session directly in the background |
| `↑` / `↓`, `Space` | Select a session and look at it without opening it |
| `Enter`, then `←` | Open a session, then go back to the list |
| `Ctrl+S` | Group the rows by folder |
| `Ctrl+X` | ⚠️ Stops and deletes; avoid it while the work isn't committed |

---

## Next steps
- [ ] Add the missing sold-out checks to #4 (`ProductItem`, `/carts/add-to-cart`).
- [ ] Push both `fix/…` branches and open two MRs into `feat/day-6-exercises` (`Closes #3`, `Closes #4`).
- [ ] After merging, clean up: `git worktree remove /Users/nhatnguyen/Desktop/ct-issue-3` and the same for `ct-issue-4`.
