#!/bin/bash
# Stop hook: show a macOS notification when Claude finishes its turn.
# Never blocks: always exits 0, even if the notification can't be shown.

input=$(cat)
cwd=$(jq -r '.cwd // empty' <<<"$input" 2>/dev/null)
folder=$(basename "${cwd:-$PWD}")

# Skip the notification when Claude is continuing because another Stop hook asked it to.
[ "$(jq -r '.stop_hook_active // false' <<<"$input" 2>/dev/null)" = "true" ] && exit 0

osascript -e "display notification \"Finished in ${folder}. Your turn.\" with title \"Claude Code\" sound name \"Glass\"" >/dev/null 2>&1

exit 0
