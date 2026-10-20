# Day 08: Model Context Protocol (MCP) in Practice

**Date:** 2026-10-20
**Exercise:** Build an MCP server from the *Introduction to Model Context Protocol* course, add the GitHub connector and the Playwright MCP server, and use one MCP tool end-to-end in a session (query PRs, comment on one).
**Branch:** `feat/day-8-exercises`
**Worked with:** Claude in the Claude desktop app, plus a terminal session for the GitHub steps

---

## Summary

After finishing the MCP course, I built my own small MCP server for the furniture store and connected it to Claude Code. Then I added GitHub and Playwright as MCP servers, and used GitHub end-to-end: Claude found an unresolved review thread on my only pull request, checked the code, and posted a reply that I approved. Almost every step hit a real-world problem first, and fixing those taught me more than the happy path would have.

---

## What I achieved

| # | Goal | Result |
|---|---|---|
| 1 | Understand the course: clients, tools, resources, prompts, inspector | ✅ Mapped every lesson onto my own furniture-store example |
| 2 | Build my own MCP server | ✅ A read-only store server with 2 tools, 3 resources and 1 prompt, tested in the MCP Inspector |
| 3 | Use it from Claude Code | ✅ Claude picked my tools by itself and gave correct stock answers |
| 4 | Add the GitHub MCP server | ✅ After the sign-in failed, connected with a read-only token kept in the Keychain |
| 5 | Add the Playwright MCP server | ✅ Pinned in the project for the whole team. It found a real bug in my app on its first run |
| 6 | Use one MCP tool end-to-end | ✅ Queried PRs, checked the code, and posted a reply on PR #1 after approving it |

---

## What I learned

1. **MCP has three building blocks, each controlled by someone different.** Tools are chosen by Claude, resources are picked by me with `@`, and prompts are run by me with `/`. Knowing who's in control tells me which one to build.
2. **Claude Code is already the MCP host and client.** In real work I only build the server and plug it in. The course built both sides so I could see what happens inside.
3. **Test a server on its own before connecting it.** The MCP Inspector let me check every tool, resource and prompt with real data, without Claude in the loop.
4. **Libraries move faster than courses.** The newest MCP SDK renamed the main class, so I pinned the version the course uses. Checking versions first saved me from confusing errors.
5. **Good tool descriptions make Claude use a tool without being asked.** Unlike yesterday's code-intelligence plugin, Claude used my store tools straight away, because their names and descriptions matched the questions.
6. **Shared servers need trust.** A server added to the project file has to be approved by each person before it runs, which is the right default for anything that runs code on my machine.
7. **Not every service supports Claude Code's sign-in.** GitHub's sign-in doesn't allow automatic registration, so a fine-grained token with the smallest permissions was the safe alternative.
8. **Keep secrets out of config files.** The token lives in the macOS Keychain, and the config only refers to it by name. I had to check the saved value carefully: twice I stored the command text instead of the token.
9. **Desktop apps and terminals don't share the same environment.** GitHub worked in the terminal but not in the desktop app, because the app never reads my shell settings.
10. **A browser tool tests the real app, not just the code.** Playwright opened my store, found the products failing to load, and traced it to a missing slash in the API address, which our own setup guide had documented wrongly.
11. **Writing to another system needs a deliberate human yes.** Auto mode happily read GitHub but blocked posting the comment. Claude didn't look for a way around it; I switched modes and approved the exact text myself.
12. **Check the facts before commenting.** Claude checked the code first, so the reply said honestly that one part of the refactor was done and one wasn't. The thread stays open because the work isn't finished.

---

## Challenges and how I handled them

- **The newest SDK didn't match the course.** I pinned the earlier version so every lesson's code worked as taught.
- **GitHub's sign-in button failed.** I switched to a read-only fine-grained token, and later gave it write access only for the comment step.
- **The token kept being saved wrong.** The clipboard still held the command I had just copied. I fixed it by editing the item directly in Keychain Access.
- **GitHub worked in the terminal but not in the desktop app,** so I ran the GitHub steps in a terminal session.
- **Playwright was already installed through my account.** I added a pinned copy to the project so the team gets the same version, and kept its test output out of git.
- **The store showed "Invalid URL".** My local settings lacked a trailing slash. I fixed it and corrected the project guide, so the next person doesn't hit it.
- **Auto mode blocked the comment.** I switched to the mode that asks first, read the exact text, and approved it once.

---

## Takeaway

MCP turns Claude from something that only knows my code into something that can work with my real systems: my store's data, my GitHub, and my app running in a browser. The value came as much from the setup problems as from the features. Each one showed a real boundary to respect: the right version, the right scope, where secrets live, and when a human must approve an action. My rule from today: let Claude read freely through MCP, but keep every write to another system behind an explicit yes.
