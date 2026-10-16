# Day 06: Remote Control

**Training project:** `claude-training` (the same Claude Desktop session used for the `/loop` exercises)
**Date:** 2026-10-16
**Exercise:** Start a session at your desk (`/rc`), connect from your phone through claude.ai/code or the Claude app, and send a steer from the phone.

**Branch:** `feat/day-6-exercises`
**Worked with:** Claude (AI assistant in the Claude desktop app)

---

## Overview

| # | Step | Result |
|---|---|---|
| 1 | Start Remote Control at my desk with `/rc` | ✅ Turned on in this Claude Desktop Code-tab session |
| 2 | Connect from my phone | ✅ Opened the same session in the Claude mobile app |
| 3 | Send a steer from the phone | ✅ Sent a new question (the "Ultracode" topic), and the desktop session picked it up and did the work |
| 4 | Confirm the work ran on my Mac, not in the cloud | ✅ Claude ran shell commands on my machine (`claude --version`, reading `~/.claude/settings.json`) in reply to the phone message |

### How we split the work

| Me | Claude |
|---|---|
| Typed `/rc` on the desktop and opened the session in the Claude app | Kept working in the same session, with the same files, tools and history |
| Sent the next topic from my phone | Read the official docs, checked my local setup, and answered |
| Told Claude which message came from the phone | Wrote this summary |

---

## Background: what Remote Control is

Remote Control connects **claude.ai/code** or the **Claude mobile app** to a Claude Code session that is **running on my own machine**. The phone is just another screen and keyboard for that session:

- **Claude keeps running locally.** Code runs, files are read and edited, and tools and MCP servers are used on my Mac. The phone only sends and receives messages.
- **Every device stays in sync.** I can type from the desktop, a browser or the phone, all in the same conversation.
- **No inbound ports are opened.** The local session only makes outbound HTTPS requests to the Anthropic API, which passes messages between the phone and my machine over TLS.
- **Short drops are handled for me.** If the laptop sleeps or the network drops, the session reconnects when the machine is back online.

### Ways to start it

| Where | Command |
|---|---|
| Claude Desktop (Code tab) | `/remote-control` or `/rc` in the prompt box. To disconnect, run it again |
| Inside a `claude` CLI session | `/remote-control` or `/rc`, optionally with a name: `/rc My Project` |
| New CLI session | `claude --remote-control` (or `--rc`) |
| Server mode (several sessions from one process) | `claude remote-control`. It shows a URL, and pressing space shows a QR code |
| Every session, automatically | Desktop: **Settings > Claude Code > Connect new sessions to Remote Control**. CLI: `/config` → **Enable Remote Control for all sessions** |

### Requirements

- **Plan:** Pro, Max, Team or Enterprise. API keys don't work. On Team and Enterprise, an Owner must turn on the Remote Control toggle in the admin settings first.
- **Login:** a claude.ai login (`/login`).
- **Phone:** the Claude app (`/mobile` shows a QR code to download it) or any browser at claude.ai/code.

---

## What I did

### 1. Start it at my desk
In the Claude Desktop Code tab, in the session I was already using for the `/loop` exercises, I typed:

```
/rc
```

The session was registered with claude.ai. From then on the app told Claude that I could follow the conversation from another device.

### 2. Connect from my phone
I opened the **Claude mobile app** and found the session in the Code session list. It showed the whole conversation: the `/loop` work, the MR and the write-up.

### 3. Send a steer from the phone
From the phone I sent the next learning topic:

> this is the new topic for my learn. could you please let me know more details about it? "Ultracode" family: `ultrathink` keyword on a gnarly bug; `/effort` levels on the same bug, compare; note plan-tier availability.

What happened on the desktop session:
- **It handled the message like one typed at the desk.** Claude read the Claude Code docs (model config, workflows, feature availability, changelog) and answered with a full explanation.
- **It ran commands on my Mac.** It ran `claude --version` (2.1.301) and read `~/.claude/settings.json` (`"alwaysThinkingEnabled": false`). This proves the work happened on my machine, not in a cloud sandbox.
- **The `ultrathink` keyword worked from the phone.** My message contained the word, so that turn was an "ultrathink" turn.
- **The desktop showed everything.** When I came back to my desk, the question and the answer were already in the session.

---

## What I learned

1. **Remote Control is a remote screen, not a remote computer.** The phone doesn't run anything. All the work stays on my machine, with my files, tools, git setup and sign-ins.
2. **A steer is just a normal message.** Anything I can type at the desk I can send from the phone: a new task, a correction, an answer to a question, `/model` or `/effort`.
3. **It's the same session everywhere.** History, task lists and the work in progress are shared, so I can switch devices mid-task without re-explaining anything.
4. **The machine must stay on.** If I quit the Desktop app or stop the `claude` process, the session goes offline. A sleeping laptop reconnects when it wakes.
5. **It's secure by design.** There are no open ports and no files uploaded to a cloud VM. Traffic goes over TLS through the Anthropic API, using short-lived credentials. Owners or Pro/Max users can also require **Trusted Devices**, so only enrolled devices can view or steer sessions.
6. **Know which tool fits which job:**

| Tool | Where it runs | Best for |
|---|---|---|
| **Remote Control** | My machine | Steering work already in progress from another device |
| **Cloud sessions** (claude.ai/code) | Anthropic's cloud, with a fresh clone | Starting work without my laptop |
| **Dispatch** | My machine (Desktop) | Sending a new task from the phone with little setup |
| **`/loop` and scheduled tasks** | My session, the Desktop app or the cloud | Repeating checks with nobody watching |

### Limitations to remember
- **One remote session per interactive process.** Use server mode (`claude remote-control`) for several.
- **Dialogs forwarded to the phone can expire.** Permission prompts and questions stay open, but other forwarded dialogs close after about 5 minutes.
- **Some commands still need the CLI on the machine,** for example sending a usage-credits request to an admin on Team or Enterprise.
- **Long disconnects need a manual reconnect.** After a long disconnect (about 30 minutes without a heartbeat), run `/remote-control` again.

---

## Takeaway

With Remote Control I can start a task at my desk, walk away, and keep steering it from my phone. Claude still runs with my full local setup. My phone message about "Ultracode" was handled on my Mac exactly like one typed at the desk. To end it, I run `/rc` again on the desktop, or quit the session.
