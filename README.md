# Cube Lab

Cube Lab is a browser-based playground for twisty puzzles. It gives GitHub profile visitors a way to explore the puzzles that shaped how I approach software engineering.

The first prototype renders a 3×3 cube with camera orbit and two right-face turns. The playable MVP adds the full move controls, scramble, reset, and timing.

## Run locally

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To check the production build, run `npm run build` and `npm run preview`.

## Project documents

- [Project plan](docs/PROJECT_PLAN.md) covers the 3×3 MVP, puzzle expansion, and the GitHub profile concept.
- [Work log](docs/WORK_LOG.md) records decisions, verification, and the next task.
- [Git workflow](docs/GIT_WORKFLOW.md) records the issue, branch, and pull request naming conventions.
- [References](docs/REFERENCES.md) collects library docs, interaction examples, and publishing sources.
- [Deployment guide](docs/DEPLOYMENT.md) describes the planned GitHub Pages setup and release checks.
