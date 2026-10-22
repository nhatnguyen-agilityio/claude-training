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

input=$(cat)
jq -e 'type == "object"' <<<"$input" >/dev/null 2>&1 \
  || block "the tool input couldn't be read, so the edit can't be checked."
file=$(jq -r '.tool_input.file_path // .tool_input.notebook_path // .tool_response.filePath // empty' <<<"$input")
[ -z "$file" ] && exit 0

# Resolve relative paths, "..", "." and symlinks before comparing,
# so "web/furniture-store/../../api/db.json" can't slip through.
cwd=$(jq -r '.cwd // empty' <<<"$input" 2>/dev/null)
real=$(cd "${cwd:-$PWD}" 2>/dev/null && python3 -I -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "$file" 2>/dev/null) \
  || block "the file path couldn't be resolved, so the edit can't be checked."

case "$real" in
  */practice-one/api/db.json)
    block "api/db.json is shared seed data. Test against a copy of the API instead (see the fix-bug-from-report skill)."
    ;;
esac

exit 0
