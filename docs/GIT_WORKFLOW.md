# Git workflow

Create one work branch from the latest `master` for each issue, and open its PR back into `master`. For a large issue, create smaller sub-issues and use one branch and PR per sub-issue.

| Item | Convention | Example |
| --- | --- | --- |
| Issue | Start with an action verb and name the outcome. | Set up React and Vite and render the 3×3 |
| Branch | `codex/<issue-number>-<short-kebab-case>` | `codex/3-render-3x3` |
| PR | Use an action-oriented title that names the change. Include `Fixes #<number>` and local review steps in the description. | Set up React and Vite and render the 3×3 |
