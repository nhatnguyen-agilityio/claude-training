# Day 09: Claude Code Hooks

**Date:** 2026-10-20
**Exercise:** Add hooks for format-on-edit, block-forbidden-command and notify-on-finish to the furniture-store app.
**Branch:** `feat/day-9-exercises`
**Worked with:** Claude in the Claude desktop app

---

## Summary

I learned how hooks let Claude Code run my own scripts at fixed moments: before a command runs, after a file is edited, and when Claude finishes. The furniture-store app now has three hooks. One formats every file Claude edits, one blocks commands that break our team rules, and one notifies me when Claude is done. Each one was tested with prepared inputs and then live in a real session.

---

## What I achieved

| # | Goal | Result |
|---|---|---|
| 1 | Understand the existing format-on-edit hook | ✅ It runs the app's own Prettier on every file Claude writes or edits inside furniture-store |
| 2 | Add block-forbidden-command | ✅ Blocks 5 kinds of commands from our rules. 17 of 17 test commands behaved as expected, and it blocked a command live |
| 3 | Add notify-on-finish | ✅ Shows a macOS notification when Claude finishes. It fired at the end of a fresh session. ⚠️ I still need to confirm the banner on screen |
| 4 | Keep each day's work on its own branch | ✅ Moved the hook commits from the day-8 branch to a new day-9 branch, without changing anything on GitLab |

### The three hooks

| Hook | When it runs | What it does |
|---|---|---|
| format-on-edit | After Claude writes or edits a file | Formats the file with the project's Prettier settings |
| block-forbidden-command | Before every shell command | Stops npm or yarn in the pnpm projects, pushes to main or dev, force-pushes, creating new git repos, resetting the shared seed data, and deleting the home or root folder |
| notify-on-finish | When Claude finishes its turn | Shows a "Finished in furniture-store. Your turn." notification with a sound |

---

## What I learned

1. **Hooks are guaranteed; instructions are not.** CLAUDE.md asks Claude to follow rules, but a hook always runs. For anything that must happen every time, a hook is the right tool.
2. **Each hook event fits a different job.** "Before a tool" can stop an action, "after a tool" can clean up its result, and "when finished" is good for notifications.
3. **A blocking hook explains itself to Claude.** When the command hook says no, Claude reads the reason and can correct itself, for example by switching from npm to pnpm.
4. **Write the rules from the project's own rules.** Every blocked command came from our CLAUDE.md "never do" list, so the hook enforces what the team already agreed.
5. **Rules need exceptions.** The todo app legitimately uses npm, so the npm rule only applies inside the pnpm projects.
6. **Where a hook lives decides when it runs.** Hooks in the furniture-store folder only apply when Claude starts there. I first put the command hook at the repo root, then moved it next to the other hooks so all three behave the same way.
7. **Test with prepared inputs first, then live.** Feeding sample commands to the script caught mistakes cheaply. The live run proved Claude Code really calls it.
8. **A text-matching guard can over-block.** My harmless test that only printed the words "git init" was blocked too. A hook like this is a guardrail against honest mistakes, not a security wall.
9. **Proving a hook fired needs evidence.** For the notification hook, I briefly made the script write a marker file, ran a fresh session, saw the marker, and then removed that line again.
10. **Keep each day's work on its own branch.** The hook commits had landed on the day-8 branch. Because they weren't pushed yet, moving them to a new day-9 branch was quick and safe.

---

## Challenges and how I handled them

- **The command hook first lived in the wrong place.** I moved it into the furniture-store settings, next to the format hook, and deleted the root copy.
- **Moving the script with git silently did nothing,** because the file wasn't tracked yet. A normal move fixed it.
- **My own test was blocked.** The words "git init" inside a harmless message matched a rule. It proved the hook worked, and it showed me the limits of text matching.
- **I can't see a notification for someone else.** The script runs without errors, but whether the banner appears depends on macOS notification settings for Script Editor, so I'll check it on my own screen.
- **The commits were on the wrong day's branch.** I made a new day-9 branch from the latest work, moved the day-8 branch back to what's on GitLab, and committed the last hook on day 9.

---

## Takeaway

Hooks turn "please remember to…" into "this always happens". Formatting, safety rules and notifications no longer depend on Claude or me remembering. The real skill is choosing the right moment for each hook, keeping its rules matched to the team's agreements, and testing it both on its own and live.
