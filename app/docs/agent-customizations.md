# Agent Customizations

The workspace includes a `PreToolUse` hook at `.github/hooks/documentation-before-push.json`.
It blocks agent-issued `git push` commands unless the latest commit includes documentation,
such as a Markdown file, `README`, `CHANGELOG`, `CONTRIBUTING`, or a file under `docs/`.

When a push is blocked, update the relevant documentation, commit that update, and retry the push.