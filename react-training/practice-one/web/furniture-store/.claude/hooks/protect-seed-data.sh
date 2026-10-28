#!/bin/bash
# PreToolUse hook (matcher: Write|Edit|MultiEdit|NotebookEdit): block edits to the shared seed data.
# block-forbidden-command covers Bash; this covers Claude's own file tools.
# Exit 0 = continue as normal. Exit 2 = block; stderr is shown to Claude.
# Fails closed: if the input can't be read, the edit is blocked.

block() {
  echo "Blocked by protect-seed-data: $1" >&2
  exit 2
}

command -v jq >/dev/null 2>&1 || block "jq is not installed, so the edit can't be checked."
command -v python3 >/dev/null 2>&1 || block "python3 is not installed, so the edit can't be checked."

# Absolute folder of this script, resolved before any cd below
hook_dir=$(cd "$(dirname "$0")" 2>/dev/null && pwd) \
  || block "the hook's own folder couldn't be found, so the edit can't be checked."

input=$(cat)
jq -e 'type == "object"' <<<"$input" >/dev/null 2>&1 \
  || block "the tool input couldn't be read, so the edit can't be checked."
file=$(jq -r '.tool_input.file_path // .tool_input.notebook_path // .tool_response.filePath // empty' <<<"$input")
[ -z "$file" ] && exit 0

# Compare the target with the real seed file by identity, not by text:
# resolves relative paths, "..", symlinks and hard links, and ignores letter
# case (macOS paths are case-insensitive). The seed file is found relative to
# this script: .claude/hooks -> web/furniture-store -> practice-one/api/db.json.
cwd=$(jq -r '.cwd // empty' <<<"$input")
verdict=$(cd "${cwd:-$PWD}" 2>/dev/null && python3 -I - "$file" "$hook_dir" <<'PY' 2>/dev/null
import os, sys
target = os.path.realpath(sys.argv[1])
seed = os.path.realpath(os.path.join(sys.argv[2], "..", "..", "..", "..", "api", "db.json"))
same = False
if os.path.exists(target) and os.path.exists(seed):
    same = os.path.samefile(target, seed)
if not same:
    same = os.path.normcase(target).lower() == os.path.normcase(seed).lower()
print("block" if same else "allow")
PY
)
case "$verdict" in
  block) block "api/db.json is shared seed data. Test against a copy of the API instead (see the fix-bug-from-report skill)." ;;
  allow) exit 0 ;;
  *) block "the file path couldn't be resolved, so the edit can't be checked." ;;
esac
