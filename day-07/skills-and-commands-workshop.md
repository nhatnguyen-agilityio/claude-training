# Day 07: Team Skills and Personal Slash Commands

**Date:** 2026-10-19
**Exercise:** Write one team skill and one personal custom slash command; ship them via a PR to the repo's `.claude/`.
**Branch:** `feat/day-7-exercises`
**Worked with:** Claude in the Claude desktop app

---

## Summary

After the *Introduction to Agent Skills* course, I built two things: a **team skill** that teaches Claude how our furniture-store app writes API hooks, and a **personal slash command** that starts my daily write-ups. Both work. Testing them with real input found one bug in the command, which I fixed and re-tested. Shipping them through a merge request is still to do.

---

## What I achieved

| # | Goal | Result |
|---|---|---|
| 1 | Write a team skill | ✅ `how-we-write-api-hooks`: the team's rules and templates for adding an API hook |
| 2 | Prove the skill works | ✅ Claude followed it to build a real hook that passed all its tests on the first try |
| 3 | Put the skill in the right place | ✅ Moved into the furniture-store app, so it applies only to that app |
| 4 | Write a personal slash command | ✅ `/day-writeup`: creates the skeleton of my daily write-up |
| 5 | Prove the command works | ✅ After one fix. Three runs covered a wrong-argument bug, refusing to overwrite, and creating a new file |
| 6 | Prove only I can start the command | ✅ Claude is blocked from running it and is told to ask me to type it |
| 7 | Ship both through a merge request | ⏳ Not done yet |

---

## What I learned

1. **A skill's description decides when it is used.** Claude picks a skill on its own only if the description clearly says *what* it does and *when* to use it, in the words people really type.
2. **Skills should be built from real examples.** Templates copied from the app's existing code made the generated hook correct the first time.
3. **Keep the main skill file short.** Details like templates go in extra files that Claude only reads when it needs them, so the skill stays easy to read and cheap to load.
4. **Put a skill where it belongs.** A skill about one app lives in that app's folder and applies only there, so it doesn't get in the way of other projects.
5. **Skills are for the team, commands are for me.** A skill is shared know-how that Claude can use by itself. My command only runs when I type it: Claude knows it exists but is blocked from starting it, so it can't run by accident.
6. **Test with real input before shipping.** Reading the command file looked fine, but the first real run showed the arguments were off by one. One run found what a review missed.
7. **Test every path, not just the happy one.** Three runs tested three different situations, and each behaved differently.
8. **Tell the tool to stop and ask when something looks wrong.** A small "if the input looks wrong, ask me" rule turns a silent mistake into a question.
9. **Make sure a test result means what I think it means.** My first manual-only check "passed" for the wrong reason. Comparing against a second command without the setting showed the real cause.

---

## Challenges and how I handled them

- **The main branch was almost empty,** so I built on top of the day 6 branch instead, the same way earlier days were done.
- **The command read its arguments in the wrong order.** Claude noticed, used what I meant, and fixed the command. The next run confirmed the fix.
- **My first manual-only check proved the wrong thing.** Claude couldn't find the command, but only because it was brand new: a test command *without* the manual-only setting couldn't be found either. Once the command was loaded, Claude got a clear "blocked, ask the user to run it" message, which is the real proof.
- **I deleted my write-up to test the "create a new file" case,** and lost the filled-in version because it wasn't committed yet. Claude rebuilt it from our session. Next time I'll commit first, or test with a throwaway name.

---

## Takeaway

A skill is the way to share team know-how so Claude applies it consistently, and a slash command is a personal shortcut I start on purpose. Writing them was the easy part. The real value came from testing them with real input, which found a bug, proved the fix, and showed me how they behave in each situation.
