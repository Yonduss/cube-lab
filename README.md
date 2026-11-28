# Cube Lab

Cube Lab is a browser-based playground for twisty puzzles. It gives GitHub profile visitors a way to explore the puzzles that shaped how I approach software engineering.

The 3×3 playground supports camera orbit, all six face turns, random-state scrambles, timed solves, puzzle reset, and customizable keyboard shortcuts.

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

Use the buttons in **Turn controls** or press the shortcut shown on each keycap. Turn directions are as seen when looking straight at the selected face.

| Action | Default shortcuts |
| --- | --- |
| Clockwise quarter turn | `R`, `L`, `U`, `D`, `F`, or `B` |
| Counterclockwise quarter turn | `Shift` + the face letter. For example, `Shift + R` performs **R′**. |
| Scramble or Reset | `1` to scramble, `2` to reset |
| Animation or Face arrows | `3` to toggle animation, `4` to toggle face arrows in the default view |
| Camera | `0` to reset the view, `8` to toggle the rear view |
| Cube orientation | `7` to rotate the front, `9` to flip the cube |

Drag or swipe the cube to orbit the camera. In the default view, each face label shows the color of its center sticker. Select a label to highlight that layer. Rotate front and Flip cube change which face the move letters refer to. The viewer shows the three most recent moves.

To change a shortcut, open **Keyboard settings**, select a keycap, and press a new shortcut. Use **Save** to apply changes or **Cancel** to discard them. **Restore defaults** loads the default assignments for review before saving.

## Timed solves

1. Select **Scramble** or press its shortcut. The timer shows `00:00:00.00` while you inspect the cube.
2. Make a face turn to start the timer. Camera movement and whole-cube reorientation leave it waiting.
3. Solve the cube with face turns. During the timed solve, the number below the recent moves counts each applied quarter turn. Camera movement and whole-cube reorientation leave the count unchanged.
4. When you solve the cube, the final time and turn count stay in the result until the next successful scramble or Reset. When the system allows motion, confetti plays once and the cube controls pause until it finishes.

**Reset** restores the cube and clears the timer. To start another timed solve, scramble again. Free play and positions restored after a reload are untimed. The browser saves your last completed cube position and shortcuts.

## Project documents

- [Project plan](docs/PROJECT_PLAN.md) covers the 3×3 MVP, puzzle expansion, and the GitHub profile concept.
- [Work log](docs/WORK_LOG.md) records decisions, verification, and the next task.
- [Learning notes](docs/LEARNING.md) collect questions and experiments to revisit while building Cube Lab.
- [Git workflow](docs/GIT_WORKFLOW.md) records the issue, branch, and pull request naming conventions.
- [References](docs/REFERENCES.md) collects library docs, interaction examples, and publishing sources.
- [Deployment guide](docs/DEPLOYMENT.md) describes the planned GitHub Pages setup and release checks.
