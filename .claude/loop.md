Maintenance pass for the `claude-training` repo. Work through these in order and stop at the first one that has something to do:

1. **Unfinished work.** If this conversation left a task half done, continue it.
2. **The current branch's GitLab MR** (`gitlab.asoft-python.com/nhat.nguyen/claude-training`). Read it with `glab mr view` / `glab ci status` if `glab` is signed in; otherwise open the MR page in the built-in browser. Address new review comments, failed pipelines and merge conflicts.
3. **Checks on changed code.** If files under `react-training/practice-one/web/furniture-store/` changed on this branch, run `pnpm lint` and `pnpm test` there and fix what fails. For other projects, use the commands in the root `CLAUDE.md`.

Rules:
- Follow the root `CLAUDE.md` and, inside `practice-one`, its own `CLAUDE.md`.
- Commit with the `commit-message` skill format (`feat(): …`, `bugfix(): …`, `refactor(): …`, `test(): …`). Never commit to `main`.
- Never push, comment on the MR, or merge without asking me first.
- Don't start new features or refactors that nobody asked for.

If nothing needs doing, reply with one line: `Nothing to do — <branch>, MR <state>`.
