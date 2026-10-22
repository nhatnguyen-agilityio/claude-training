#!/bin/bash
# PreToolUse hook (matcher: Write|Edit): block edits to the shared seed data.
# block-forbidden-command covers Bash; this covers Claude's own file tools.
# Exit 0 = continue as normal. Exit 2 = block; stderr is shown to Claude.

input=$(cat)
file=$(jq -r '.tool_input.file_path // empty' <<<"$input")

case "$file" in
  */practice-one/api/db.json)
    echo "Blocked by protect-seed-data: api/db.json is shared seed data. Test against a copy of the API instead (see the fix-bug-from-report skill)." >&2
    exit 2
    ;;
esac

exit 0
