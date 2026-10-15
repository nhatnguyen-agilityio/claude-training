---
name: commit-message
description: "Write a one-line commit message for this project in the team format `feat(): …`, `bugfix(): …`, `refactor(): …` or `test(): …`, based on the staged changes, and verify and correct commit messages people write themselves. Use whenever someone asks to commit, write, suggest, check or fix a commit message, gives their own message to commit with, or describes their changes for a commit in this repository."
---

# Commit message

Every commit in this project uses **one line** in this format:

```
<type>(): <what the change does>
```

## Types

Use exactly one of these four types:

| Type | Use it when the change… | Example |
|---|---|---|
| `feat` | adds or extends something the user or another developer can use: a page, component, API field, option | `feat(): add quantity selector to product detail page` |
| `bugfix` | makes something that was wrong work correctly | `bugfix(): keep cart items after page reload` |
| `refactor` | changes how the code is written without changing what it does: renames, moves, clean-up, removing dead code | `refactor(): extract price formatting into a helper` |
| `test` | only adds or changes unit tests (test files, test helpers, mocks), with no change to app code | `test(): add unit tests for cart total calculation` |

Choosing between `test` and the other types:
- **Only test files changed** → `test`
- **A feature plus its tests** in one commit → `feat`
- **A bug fix plus its tests** in one commit → `bugfix`
- **A refactor plus test updates it needed** → `refactor`

Changes that fit none of these exactly go to the closest type:
- docs or config for a new feature → `feat`
- config that fixes something broken → `bugfix`
- formatting, dependency tidy-up, renaming files → `refactor`
- test setup or test config only (for example `jest.config.cjs`) → `test`

## Rules for the message

- **One line only.** No body, no bullet list, no blank line.
- **Keep the parentheses empty:** `feat():`, not `feat(cart):`.
- **At most 72 characters** for the whole line, including `feat(): `.
- **Start with a lowercase verb in the present tense:** add, update, remove, fix, show, move, rename…
- **Say what the change does for the code or the user**, not how you did it.
  - ✅ `bugfix(): show error message when login fails`
  - ❌ `bugfix(): change if statement in Login.tsx`
- **Be specific.** Name the thing that changed.
  - ✅ `feat(): add search by product name to header`
  - ✅ `test(): cover empty cart in checkout summary`
  - ❌ `feat(): update code` / `bugfix(): fix bug` / `refactor(): changes` / `test(): add tests`
- **No full stop at the end.**
- **English only.**

## How to write it

1. Look at what will be committed:
   ```bash
   git diff --staged --stat
   git diff --staged
   ```
   If nothing is staged, look at `git status` and `git diff`, then ask which files should go into the commit. Do not stage files on your own guess.
2. Decide the type from the table above.
3. If the staged changes do **two different things** (for example, a new feature and an unrelated bug fix), say so and suggest splitting them into separate commits, one message each.
4. Write the one-line message and check it against every rule above.
5. Show the message to the person. Only run `git commit` if they asked you to commit:
   ```bash
   git commit -m "<type>(): <message>"
   ```

## When the person gives their own message

If the person writes a message themselves (for example *"commit with `fix login`"* or *"is `feat(): update` OK?"*), **always verify it against the staged changes before using it**. Never commit a message just because the person typed it.

1. **Read the staged changes** the same way as in "How to write it", step 1.
2. **Check the message against the code**, not only against the format:
   - **Type:** does it match what the code actually does? A message saying `feat()` on a change that only fixes a bug is wrong.
   - **Content:** does it describe the **real** change? It must name what was added, fixed, changed or tested. A message that is vague, describes something else, or misses the main change fails.
   - **Format and rules:** every rule in "Rules for the message".
3. **Decide:**
   - **Everything passes** → say it's good and use it exactly as written.
   - **Anything fails** → write an improved message and show both, with a short reason for each change:

     ```
     Your message:  fix login
     Suggested:     bugfix(): show error message when login password is wrong
     Why:
     - missing type and "():" → added bugfix(), because the change fixes wrong behavior
     - "fix login" is vague → now says what was fixed (the missing error message)
     ```
4. **Commit only with the person's agreement.** If the message was changed, ask whether to use the suggested version, keep theirs, or edit it, and wait for an answer before running `git commit`.

Keep the person's wording where it is already correct. Change only what's needed to make it accurate and follow the rules.

## Checklist before giving the message

- [ ] Type is `feat`, `bugfix`, `refactor` or `test`
- [ ] Format is `<type>(): <message>` with empty parentheses
- [ ] One line, at most 72 characters, no full stop
- [ ] Starts with a lowercase present-tense verb
- [ ] Clearly says what changed, without needing to read the code
- [ ] Matches the staged changes: right type, and describes the real change (also for messages the person wrote)
