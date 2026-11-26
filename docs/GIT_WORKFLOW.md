# Git workflow

Create one work branch from the latest `master` for each issue, and open its PR back into `master`. For a large issue, create smaller sub-issues and use one branch and PR per sub-issue.

| Item | Convention | Example |
| --- | --- | --- |
| Issue | `[<title-key>] <action and outcome>`. Use the matching label. | `[feature] Set up React and Vite and render the 3×3` |
| Branch | `<type>/<issue-number>-<short-kebab-case>` | `feat/3-render-3x3` |
| Commit | `<type>: <short description>` | `feat: render the 3×3 viewer` |
| PR | `[<title-key>] <action and outcome>`. Include `Fixes #<number>` and local review steps in the description. | `[feature] Set up React and Vite and render the 3×3` |

## Type mapping

| Meaning | Title key | Label | Branch and commit type |
| --- | --- | --- | --- |
| Feature | `feature` | `feature` | `feat` |
| Bug | `bug` | `bug` | `fix` |
| Refactor | `refactor` | `refactor` | `refactor` |
| Test | `test` | `test` | `test` |
| Documentation | `docs` | `documentation` | `docs` |
| Chore | `chore` | `chore` | `chore` |
| CI | `ci` | `ci` | `ci` |
