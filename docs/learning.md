# Cube Lab learning notes

Use this file to study the project while it is in progress. Write a prediction before each experiment. Record the result. Explain the result in your own words. Put unresolved questions next to the experiment that raised them.

For experiments, use short instructions and one action per step. Use the same term for the same concept. These instructions follow writing principles from [ASD-STE100](https://www.asd-ste100.org/STE_faq.html).

## Why can the cube look stuck when the puzzle state changes?

**Study:** Rendering, model state, and the animation completion signal. [PR #22](https://github.com/Yonduss/cube-lab/pull/22)

1. Turn on **Back view**.
2. Turn off **Back view**.
3. Press `R`.
4. Compare the rendered cube with the move sequence.
5. Read how the app hides the rear view in [App.tsx](../src/App.tsx).

Explain what a timeout can recover when an animation stalls. Explain why a timeout cannot reconnect a scene after its listener is gone.

## Why can a camera move and a cube move look similar?

**Study:** Camera coordinates, legal cube moves, and puzzle orientation. [PR #21](https://github.com/Yonduss/cube-lab/pull/21) · [PR #22](https://github.com/Yonduss/cube-lab/pull/22)

1. Drag the cube to orbit the camera.
2. Reset the camera.
3. Flip the cube with `9`.
4. Predict which pieces `U` will move.
5. Press `U`.

Write down which actions changed the camera and which changed the puzzle position. Explain why a whole-cube rotation can leave the puzzle solved.

## How does a scramble become the current puzzle position?

**Study:** Random-state generation, dynamic imports, and interaction guards. [Issue #5](https://github.com/Yonduss/cube-lab/issues/5) · [cubing.js scramble guide](https://js.cubing.net/cubing/scramble/)

1. Open the Network panel in browser developer tools.
2. Reload the app.
3. Check which files load before the first scramble.
4. Press `S`.
5. Check which files load after the request.

Predict what happens when the source takes several seconds to load. Try `X` during that delay. Explain why a disabled button and a guard in the shared handler cover different input paths.

Repeat the experiment in the production preview at `/cube-lab/`. Find the worker script in the Network panel. Read [vite.config.ts](../vite.config.ts) and explain why the worker needs a build separate from the code that runs in the page.

## What must the app save to restore an interrupted session?

**Study:** Versioned browser data, serialization, and state recovery. [cubePosition.ts](../src/cubePosition.ts)

1. Scramble the cube.
2. Make one completed face turn.
3. Inspect the saved value in `localStorage`.
4. Reload the page.
5. Compare the restored cube with the position before the reload.
6. Reset the puzzle.
7. Inspect the saved value again.

Explain why the app saves completed moves. Measure a short session and a long session before deciding whether the saved format needs to change.

## How can the app tell that one face or the full puzzle is solved?

**Study next:** Stickers, piece positions, and state transitions. [Issue #6](https://github.com/Yonduss/cube-lab/issues/6)

Compare one face with nine matching stickers, a correctly placed first layer, and a fully solved cube. Decide which condition a practice mode would use to unlock Reset. Check whether a new scramble can already meet that condition. For the timer, identify the event that distinguishes a player solve from a reset or a restored solved position.
