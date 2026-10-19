# Day 07: Evaluating a Plugin Honestly

**Date:** 2026-10-19
**Exercise:** Browse a plugin marketplace, install one useful plugin (e.g. code-intelligence/LSP) and evaluate it honestly.
**Branch:** `feat/day-7-exercises`
**Worked with:** Claude in the Claude desktop app

---

## Summary

I browsed the official plugin marketplace and installed **typescript-lsp**, which gives Claude a real TypeScript "language server" to find definitions, references and types in our furniture-store app. Getting it to work took three fixes, and none of the problems showed a warning. Once it worked, I compared it fairly against no plugin. Claude gave equally correct answers either way, and it only used the plugin when I asked it to. Then I tried harder questions that plain search can't answer. The plugin's real strength turned out to be smaller and different from what I expected: it turns Claude's guesses about types into checked facts.

---

## What I achieved

| # | Goal | Result |
|---|---|---|
| 1 | Browse a marketplace and choose a plugin | ✅ Looked through 315 plugins and chose typescript-lsp because our app is TypeScript |
| 2 | Install it and make it actually work | ✅ After fixing three hidden setup problems |
| 3 | Compare with and without the plugin, fairly | ✅ 12 fresh sessions with the same questions; the only difference was the plugin |
| 4 | Find where it really makes a difference | ⚠️ Only a small difference. One real catch: it got a type right that careful code-reading got wrong |
| 5 | Reach an honest verdict | ✅ It works, but in this project it added little unless I asked for it |

### What the comparison showed

| Question | Without the plugin | With the plugin |
|---|---|---|
| Where is the cart hook used? | ✅ Correct, using text search | ✅ Correct, but still used text search |
| Where is the cart type defined and used? | ✅ Correct | ✅ Correct, plugin not used |
| What breaks if I change the add-to-cart hook? | ✅ Correct and detailed | ✅ Correct and detailed, plugin not used |
| Make a type error. Is the code still OK? | ✅ Found it by running the type checker | ✅ Same. No automatic error report from the plugin |
| Same first question, but told to use the plugin | — | ✅ Correct, but slower (6 steps instead of 3) |

Time and cost were about the same in every pair.

### Harder questions, where search should struggle

| Question | Without the plugin | With the plugin (not named) | With the plugin, named |
|---|---|---|---|
| Which of our 16 data hooks give components untyped data? (correct answer: 8) | ✅ 8 of 8, but worked out by reading, and it said so | ✅ 8 of 8, also by reading. The plugin wasn't used | ✅ 8 of 8, **each one checked** with the plugin (21 checks) |
| The exact type of the product list's page number | ❌ Guessed `number` from the code | ❌ Guessed `number` | ✅ `unknown`, which matches the compiler |
| Cost and time | $0.37, 61s | $0.39, 49s | $0.48, 58s |

Both runs that relied on reading tried to write their own small compiler script to check their work, and couldn't run it. The plugin is the ready-made, safe version of exactly that.

I also checked a rename question by hand: "which lines use the cart item's quantity field?" The plugin found 3 places, but **missed 4** where the cart item is built as a plain object first. Text search found all of them, buried in 22 lines of unrelated matches.

---

## What I learned

1. **Installing a plugin is not the same as it working.** The plugin installed fine even though the program it depends on was missing. Nothing warned me, and Claude quietly fell back to normal search.
2. **My first "with vs. without" test measured nothing.** Both runs gave the same result because the plugin was broken, not because it was useless. Check that a tool really runs before judging it.
3. **Read the plugin's requirements, and check their versions.** The newest TypeScript no longer includes the piece the language server needs, so I had to use the previous version.
4. **Having a tool doesn't mean Claude will use it.** With a quick text search already available, Claude chose search every time. It only used the plugin when I named it in the prompt.
5. **In a small, clearly named codebase, plain search is good enough.** Every name I asked about was unique, so search found exactly the right places, as fast and as accurately as the plugin.
6. **The plugin turns guesses into facts.** Claude is very good at reading code, and it found all 8 untyped hooks without the plugin. But reading is still guessing: twice it confidently gave a type that looked right and wasn't. With the plugin, every type came straight from the compiler.
7. **The plugin is only as good as the code's types.** Find-references follows what TypeScript can connect. Where our code builds plain, unlabelled objects, the plugin can't see the link and misses real uses. So the plugin and our type quality go together.
8. **The useful finding was about my code, not the plugin.** Half of our data hooks give components untyped data, even though the right interfaces already exist. That's worth a ticket.
9. **A fair comparison needs fresh sessions and only one difference.** Same questions, same allowed tools, a new session each time, with only the plugin switched on or off. Otherwise earlier answers or other settings affect the results.
10. **Grade the answers against the truth, not against each other.** I got the correct answers from the compiler first. That's the only reason I could spot the wrong `number` guess, because both reading-based answers agreed with each other.
11. **Report what I find, even when it's small.** I looked for a big difference and found a small one. Saying that honestly is more useful than picking only the questions where the plugin wins.

---

## Challenges and how I handled them

- **The plugin did nothing at first.** Claude checked it step by step and found the missing language-server program. My global package setup couldn't install it the way the plan suggested, so we used a different installer.
- **The next error was "no valid TypeScript".** The newest TypeScript version lacked a needed piece, so we switched to the previous one.
- **The first answer was almost empty.** The plugin needs a moment to load the project, and the second request returned all 44 references.
- **Testing a type error edits real code.** We ran those sessions one after the other and undid the change after each, so the app was left untouched.
