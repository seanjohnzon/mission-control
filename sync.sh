#!/bin/bash
set -e
cd "/Users/minicihan/Cursor Projects/mission-control"

# Always pull first — remote is truth source
git pull --rebase origin main

# Only commit+push if there are changes
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "🔄 Auto-sync: $(date '+%Y-%m-%d %H:%M')"
  git push origin main
  echo "✅ Changes pushed to origin/main"
else
  echo "✅ No changes to sync"
fi
