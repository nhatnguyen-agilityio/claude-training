# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A personal training workspace. The only git repo is this root (`claude-training`, remote `gitlab.asoft-python.com:nhat.nguyen/claude-training`). It holds:

- `day-NN/` — Markdown write-ups for Claude Code training exercises (no code).
- `react-training/` and `javascript-training/` — copies of two older GitLab repos. Their `.git` folders were removed on purpose, so all changes here are committed to `claude-training`. Never `git init` or re-clone inside them, and don't push to their old remotes.

Each project below is independent, with its own `package.json` and `node_modules`. There is no root package or workspace config, so run commands from the project folder.

## Projects

| Folder | What it is | Package manager |
|---|---|---|
| `react-training/practice-one/` | Main project: furniture-store eCommerce app. `api/` = json-server mock backend, `web/furniture-store/` = React SPA. **Has its own `CLAUDE.md` with commands, conventions and rules — follow it when working there.** | pnpm |
| `react-training/react-advanced-examples/` | Vite + React + TS examples for React-advanced topics (Jest tests) | pnpm |
| `react-training/my-example-app/` | Vite + React + TS sandbox with Storybook | pnpm |
| `javascript-training/javascript-project/todo-app/` | Vanilla JS todo app; `npm start` serves it with `python3 -m http.server 5173`, `npm test` runs Jest (`__tests__/`) | npm (`package-lock.json`) |
| `javascript-training/{example,exercise-*,javascript-course,javascript-project/*}` | Plain HTML/CSS/JS pages opened directly in a browser; no build or tests | — |

The Vite apps share the same scripts: `pnpm dev`, `pnpm build` (`tsc -b && vite build`), `pnpm lint`, and, where present, `pnpm test`, `pnpm test:coverage` and `pnpm storybook` (port 6006).

## Running the furniture store

It needs two terminals: the API (`cd react-training/practice-one/api && pnpm start`, port 5001) and the web app (`cd react-training/practice-one/web/furniture-store && pnpm dev`, with `.env` copied from `.env.sample`). The API is `server.js`: json-server over `db.json`, plus custom routes for login/signup, add-to-cart (merges duplicate items and checks stock) and clearing a user's cart.

## Claude Code setup in this repo

- `.claude/skills/commit-message/` — the team commit format: one line, `feat(): …`, `bugfix(): …`, `refactor(): …` or `test(): …` with empty parentheses. Use it for every commit in this repo.
- `react-training/practice-one/web/furniture-store/.claude/settings.json` — a PostToolUse hook that runs that app's Prettier on files Claude writes or edits inside `web/furniture-store/`. It only applies when Claude Code is started from that folder.

## Git workflow

Work happens on branches named like `feat/day-N-exercises` or `fix/<short-description>`, merged through GitLab merge requests. Don't commit directly to `main`.
