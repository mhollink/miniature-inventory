#!/bin/bash

# The path to your JSON file
CHANGELOG_FILE="CHANGELOG.json"
NEW_VERSION="$1"

# Check if the version was successfully retrieved
if [ -z "$NEW_VERSION" ]; then
  echo "No version provided..."
  exit 1
fi

# Backup the original file
cp "$CHANGELOG_FILE" "${CHANGELOG_FILE}.bak"

# Update the current "main" key with the latest version
sed -i -E "/\"main\"[[:space:]]*:/,/\}/s/\"main\"[[:space:]]*:/\"$NEW_VERSION\":/" "$CHANGELOG_FILE"

# Add a new "main" section at the top of the file
# We use a temporary file to store the changes
TMP_FILE=$(mktemp)
{
  echo "{"
  echo "  \"main\": {},"
  # Append the rest of the existing changelog file, omitting the opening brace
  tail -n +2 "$CHANGELOG_FILE"
} > "$TMP_FILE"

# Overwrite the original file with the updated one
mv "$TMP_FILE" "$CHANGELOG_FILE"

echo "Changelog updated for version: $NEW_VERSION. New \"main\" key was created..."

git add package.json package-lock.json CHANGELOG.json
git commit -m "Update version to v$NEW_VERSION"
git tag "$NEW_VERSION"