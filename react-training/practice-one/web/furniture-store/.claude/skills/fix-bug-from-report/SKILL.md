---
name: fix-bug-from-report
description: "How the team fixes a reported bug in this furniture-store app: restate it with acceptance criteria, reproduce it, write a failing test first, make the smallest fix, verify with tests, lint and types, check it end-to-end against a throwaway copy of the API, then commit as bugfix(). Use whenever someone asks to fix a bug, defect or regression in furniture-store, reported from manual or browser testing, a code review, a ticket or an issue."
---

# Fix a bug from a report (furniture-store)

All paths are relative to the furniture-store app root (the folder that
contains this `.claude/`). The API lives in `../../api`.

## Steps

1. **Restate the bug.** One sentence on what happens and one on what should
   happen. Turn the second into 1–3 acceptance criteria you can test.
2. **Find the cause.** Read the code path from the UI to the API call
   (`src/components/…` → `src/apis/…`). Name the exact line before changing it.
3. **Reproduce it.** Prefer a unit test. If the bug needs the whole app
   (forms across steps, saved data), reproduce it end-to-end too (step 7).
4. **Write a failing test first.** Put it next to the code
   (`<Name>.test.tsx`), name it "should … when …", and run it to see it fail
   for the right reason. Mock `fetch` and `constants/*` as the existing tests do.
5. **Make the smallest fix** that makes the test pass. Don't refactor
   unrelated code in the same commit. For data fetching, follow the
   how-we-write-api-hooks skill (hooks in `src/apis/`, keys and routes from
   `src/constants/`).
6. **Verify locally:**
   ```bash
   pnpm test <the related test files>
   pnpm lint
   pnpm exec tsc -b
   ```
   If tests in the touched files were already failing before your change, fix
   them too or say clearly why not. Never skip or delete a failing test.
7. **Check it end-to-end on a throwaway API** when the bug involves saved data:
   copy `../../api` to a temporary folder (symlink its `node_modules`), start
   that copy on port 5001 and the web app on 5173, then repeat the reported
   steps in the browser (Playwright MCP or the browser pane). Read the result
   back from the copy's API. Delete the copy when done. **Never run the flow
   against the real `api/db.json`**: it's shared seed data.
8. **Commit** with the commit-message skill: one line, `bugfix(): <what now
   works>`. Keep the test and the fix in the same commit.

## Rules

- Acceptance criteria first; a fix without a test that proves it isn't done.
- Use only public test data (seed users, Stripe's documented test cards).
  Never real personal or payment details.
- Don't touch `src/components/ui/*` (shadcn-generated) to fix a bug.
- If the real cause is in the API (`../../api/server.js`), fix it there and
  say so; don't hide it in the UI.
- Report anything you couldn't verify, such as an end-to-end check you skipped.
