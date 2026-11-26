# Cube Lab

Cube Lab is a browser-based playground for twisty puzzles. It gives GitHub profile visitors a way to explore the puzzles that shaped how I approach software engineering.

The 3×3 prototype supports camera orbit, all six face turns, and customizable keyboard shortcuts. Scramble, puzzle reset, and solve timing are upcoming MVP features.

## Run locally

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To check the production build, run `npm run build` and `npm run preview`.

## Controls

- Press `R`, `L`, `U`, `D`, `F`, or `B` for a clockwise quarter turn. Hold `Shift` with the same letter for the inverse. The **Turn controls** panel includes touch buttons and their current keycaps.
- Press `0` to reset the camera, `9` to look underneath, and `8` to toggle the rear view. These actions leave the puzzle pattern unchanged.
- Open **Keyboard settings** to select a shortcut, press a new key, or restore the defaults. Valid changes are saved for the browser.

## Project documents

- [Project plan](docs/PROJECT_PLAN.md) covers the 3×3 MVP, puzzle expansion, and the GitHub profile concept.
- [Work log](docs/WORK_LOG.md) records decisions, verification, and the next task.
- [Git workflow](docs/GIT_WORKFLOW.md) records the issue, branch, and pull request naming conventions.
- [References](docs/REFERENCES.md) collects library docs, interaction examples, and publishing sources.
- [Deployment guide](docs/DEPLOYMENT.md) describes the planned GitHub Pages setup and release checks.
