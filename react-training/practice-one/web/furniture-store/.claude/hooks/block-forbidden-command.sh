#!/bin/bash
# PreToolUse hook (matcher: Bash): block commands this repo forbids.
# Exit 0 = let Claude Code continue as normal. Exit 2 = block; stderr is shown to Claude.

input=$(cat)
cmd=$(jq -r '.tool_input.command // empty' <<<"$input")
cwd=$(jq -r '.cwd // empty' <<<"$input")

block() {
  echo "Blocked by block-forbidden-command: $1" >&2
  exit 2
}

# 1. npm / yarn installs in the pnpm projects under react-training/
#    (javascript-training/todo-app uses npm, so it stays allowed there).
if [[ "$cwd $cmd" == *react-training* ]] &&
  grep -Eq '(^|[;&|[:space:]])(npm[[:space:]]+(install|i|ci|add|uninstall|remove)|yarn)([[:space:]]|$)' <<<"$cmd"; then
  block "react-training projects use pnpm only. Use pnpm instead of npm/yarn."
fi

# 2. Pushing to main/dev, or force-pushing anywhere.
if grep -Eq 'git[[:space:]]+push' <<<"$cmd"; then
  grep -Eq '(^|[[:space:]:])(main|dev)([[:space:]]|$)' <<<"$cmd" &&
    block "never push to main/dev directly. Push a feat/ or fix/ branch and open a merge request."
  grep -Eq '[[:space:]](-f|--force|--force-with-lease)([[:space:]]|=|$)' <<<"$cmd" &&
    block "force-push rewrites shared history. Ask the user to do it themselves if it's really needed."
fi

# 3. New git repos inside the copied projects (their .git folders were removed on purpose).
grep -Eq 'git[[:space:]]+(init|clone)' <<<"$cmd" &&
  block "this repo's only git repo is the root. Don't git init or clone inside it."

# 4. Resetting or rewriting the shared seed data.
grep -Eq '(git[[:space:]]+(checkout|restore)[^;&|]*db\.json|>[[:space:]]*[^;&|]*db\.json)' <<<"$cmd" &&
  block "api/db.json is shared seed data. Don't reset or rewrite it."

# 5. Recursive force-deletes of home or root.
grep -Eq 'rm[[:space:]]+-[a-zA-Z]*(rf|fr)[a-zA-Z]*[[:space:]]+(/|~|\$HOME)([[:space:]]|/?$)' <<<"$cmd" &&
  block "refusing to recursively delete / or the home folder."

exit 0
