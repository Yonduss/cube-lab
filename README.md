# Cube Lab

Cube Lab is a browser-based playground for twisty puzzles. It gives GitHub profile visitors a way to explore the puzzles that shaped how I approach software engineering.

The 3×3 prototype supports camera orbit, all six face turns, random-state scrambles, puzzle reset, and customizable keyboard shortcuts. Solve timing is an upcoming MVP feature.

## Run locally

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To check the production build, run `npm run build` and `npm run preview`.

### Vite warning about `search-worker-entry.js`

When you first use **Scramble** after opening the app, Vite can report that `node_modules/.vite/deps/search-worker-entry.js` does not exist. Vite's development optimizer gives the worker a filename with a hash. In Chromium, the first request returned `404` and cubing.js loaded the worker successfully from the alternate path.

- If the scramble completes and face turns work again, you can continue using the development server with the current configuration. The warning's `optimizeDeps.exclude` suggestion is optional in this case.
- If the app shows **Could not scramble the cube**, reload the page and try once more. If the problem persists, check the browser's Network panel for the other `search-worker-entry` requests and record their status codes.

The production build bundles the worker separately. To check it at the GitHub Pages project path, run `npm run build -- --base=/cube-lab/` and `npm run preview -- --base=/cube-lab/`. Open the preview under `/cube-lab/` and try **Scramble** from Turn controls.

## Controls

- Press `R`, `L`, `U`, `D`, `F`, or `B` for a clockwise quarter turn. Hold `Shift` with the same letter for the inverse. The **Turn controls** panel includes touch buttons and their current keycaps.
- Press `0` to reset the camera or `8` to toggle the rear view.
- Press `7` for **Rotate front** or `9` for **Flip cube**. Subsequent face turns use the new orientation, and the camera stays in place. The three most recent moves appear in the viewer.
- Press `1` for **Scramble**, `2` for **Reset**, `3` for **Animation**, or `4` for **Face arrows**. Reset is available when there is a position to clear and the cube is idle. Face arrows are available in the default view.
- Open **Keyboard settings**, select a keycap, and press a new shortcut. Use **Save** to apply changes or **Cancel** to keep the last saved shortcuts. **Restore defaults** loads the defaults for review before saving.
- The 3×3 position and saved shortcuts persist in the browser for the same site and profile.

## Project documents

- [Project plan](docs/PROJECT_PLAN.md) covers the 3×3 MVP, puzzle expansion, and the GitHub profile concept.
- [Work log](docs/WORK_LOG.md) records decisions, verification, and the next task.
- [Learning notes](docs/LEARNING.md) collect questions and experiments to revisit while building Cube Lab.
- [Git workflow](docs/GIT_WORKFLOW.md) records the issue, branch, and pull request naming conventions.
- [References](docs/REFERENCES.md) collects library docs, interaction examples, and publishing sources.
- [Deployment guide](docs/DEPLOYMENT.md) describes the planned GitHub Pages setup and release checks.
