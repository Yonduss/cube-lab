# Work log

Record meaningful changes and decisions after each work session. Add issue, PR, or commit links when available. Under verification, record what ran and the observed result.

## Next tasks

- [ ] Run the full 3×3 MVP checklist before release.
- [ ] Write the personal 3×3 solve guide. Verify one documented case on a physical cube and in Cube Lab, then link the guide from the project README.
- [ ] Add puzzle selection and run the switching checks for every exposed puzzle.
- [ ] Preview the production build locally, deploy to GitHub Pages, and record the verified URL and workflow run.
- [ ] Capture a cube preview and update the GitHub profile README with the public link.
- [ ] Prototype **Enable tilt controls** and **Rotate View** on the 3×3 for the second Pages release. Verify calibration, one action per tilt, and permission handling on real phones.
- [ ] Prototype the **Turn Face** mode with explicit face selection. Include it in the tilt release if the face-turn and timer checks pass.
- [ ] Optional after the mobile tilt release. Prototype desktop webcam **Rotate View** on the 3×3 and verify the gesture and camera controls.

See the [project plan](PROJECT_PLAN.md) for acceptance criteria and the [deployment guide](DEPLOYMENT.md) for publishing steps.

## Entries

1. **Project planning**
   - Defined the 3×3 MVP, puzzle expansion, profile copy, references, and deployment procedure. Checked the TypeScript starter and upstream references.
   - date: 2026-11-21
2. **Personal solve guide and repository review**
   - Added a solve guide milestone between the MVP and puzzle selection. Reviewed local Git setup and identified WebStorm settings to review before the first push.
   - date: 2026-11-21
3. **Mobile tilt release planning**
   - Targeted the second Pages release for 3×3 tilt controls. Defined the mode behavior and real-device release checks.
   - date: 2026-11-21
4. **Optional webcam controls**
   - Planned desktop hand tracking after the mobile tilt release, starting with one camera gesture.
   - date: 2026-11-21
5. **React and Vite setup and 3×3 viewer**
   - Added the 3×3 prototype and the [Git workflow](GIT_WORKFLOW.md) for [issue #3](https://github.com/Yonduss/cube-lab/issues/3).
   - Verified a clean `npm ci`, the production build, and mouse orbit, emulated touch orbit, and `R` / `R′` in Chromium on both development and production builds.
   - date: 2026-11-26
6. **3×3 viewer review changes**
   - Added the favicon, system light and dark themes, bottom and rear views, a camera reset, and animated right-face turns.
   - Updated the Git naming conventions and used `feat/3-render-3x3` for the issue #3 review.
   - Verified the favicon, theme changes, camera controls, and turns with mouse and emulated touch in Chromium. Checked reduced motion.
   - date: 2026-11-26
7. **Theme and face notation review**
   - Added persistent theme choices, visible turn directions, and an arrow to the front face in the default view.
   - Verified theme persistence and the front marker with mouse and emulated touch. Recorded customizable keys and camera shortcuts in [issue #4](https://github.com/Yonduss/cube-lab/issues/4).
   - date: 2026-11-26
8. **Face arrows and turn preferences**
   - Placed all six arrows outside the cube silhouettes across the default and opposite angles. Added a face-arrow toggle, brief turn help, and an in-page animation toggle.
   - Verified the six labels, orbit, hover and tap help, and both animated and instant turns in desktop and touch emulation.
   - date: 2026-11-26
9. **Single-cube viewer layout**
   - Kept all six arrows around a single cube in the default view. Dashed labels mark hidden faces, and the rear preview is controlled separately.
   - Centered the orbit hint, restored it after three seconds of inactivity, grouped the viewer buttons below it, and moved turn help next to the theme controls.
   - date: 2026-11-26
10. **Face arrow states and face highlighting**
    - Made the face-arrow button show On, Off, or Reset view first. Face letters briefly tint their nine stickers, reveal hidden faces, and lock interaction until the original view returns.
    - Verified all six faces and the restored puzzle position with mouse, keyboard, and emulated touch.
    - date: 2026-11-26
11. **Six-face controls and keyboard settings**
    - Added face turns and default shortcuts in one commit, then customizable bindings with conflict checks and browser persistence in a separate commit for [issue #4](https://github.com/Yonduss/cube-lab/issues/4).
    - Spaced the turn help away from its button, replaced changing labels with switches, and used a translucent outline around the selected layer while keeping the camera still.
    - Verified all six turns and inverses, four fast animated turns, key persistence, conflicting bindings, camera controls, and unchanged sticker colors during layer highlighting in desktop and touch-emulated Chromium.
    - date: 2026-11-26
12. **Control layout, orientation, and position recovery**
    - Improved light-mode layer contrast and separated display switches from camera controls. Exposed camera keycaps in the normal Turn controls panel.
    - Added draft keyboard settings with Save and Cancel, whole-cube orientation controls, and local restoration of the last completed 3×3 position.
    - date: 2026-11-26
13. **Viewer rendering and input recovery**
    - Moved the orientation controls into the viewer, added numeric shortcuts, and showed the three most recent puzzle moves.
    - Fixed the missing redraw when a face highlight expires and kept the main scene connected when hiding the rear preview. Added recovery for turns that miss their animation completion signal.
    - date: 2026-11-26
14. **Random-state scramble and puzzle reset**
   - Added Scramble, Reset, and editable shortcuts for [issue #5](https://github.com/Yonduss/cube-lab/issues/5). Both actions wait until the cube is idle. The saved position updates after each action completes.
   - Fixed production worker startup with a separate Vite worker build. Checked that scramble assets load on demand.
   - Verified development and production previews in Chromium with desktop and emulated touch input. Checked `/cube-lab/`, input locks, shortcut conflicts and persistence, position restoration, and a failed scramble load.
   - Started the [learning notes](LEARNING.md) with experiments from past and upcoming work.
   - date: 2026-11-27
15. **Puzzle button placement and numeric shortcuts**
   - Grouped Scramble and Reset with Animation and Face arrows below the cube. Moved the key labels to hover help in the viewer. Kept clickable keycaps in Turn controls and made the two display switches configurable.
   - Assigned the four actions the default keys 1–4. Kept the earlier numeric view shortcuts and existing custom assignments.
   - Verified both control locations, the desktop and mobile row layouts, toggle availability after orbiting, and shortcut migration in the `/cube-lab/` preview.
   - date: 2026-11-27
16. **Simpler cube viewer**
   - Removed the duplicate buttons below the cube. Kept the orbit hint, face guide, recent moves, and messages in the viewer.
   - Verified the Turn controls panel, keyboard shortcuts, and position restoration in the production preview with desktop and emulated touch input.
   - date: 2026-11-27
17. **Timed 3×3 solves**
   - Added a timer that starts with the first face turn after Scramble. The solving face turn records the time and shows a reduced-motion-aware celebration.
   - Checked one-move and multi-move solves, reset, reload, and interrupted animation recovery. Verified a full random scramble and inverse on desktop and emulated touch in the `/cube-lab/` preview.
   - Updated the README and appended a plain-English explanation of the timer to the learning notes.
   - date: 2026-11-28
18. **Solve feedback and face guide review**
   - Lowered the U arrow, matched face labels to the current center stickers, and showed the number of applied face turns below recent moves and in the solve result.
   - Widened the optional confetti animation across the cube and verified its visibility. Checked face colors after reorientation and turn counts with keyboard, emulated touch, and interrupted animation recovery.
   - date: 2026-11-28
19. **Simpler timed solve display**
   - Removed the visible puzzle status badge and the running timer caption. Kept scramble progress near the timer and a plain turn count during active attempts.
   - Matched face labels to the 3D sticker palette. Paused puzzle input during confetti and discarded moves queued beyond the solving turn.
   - Verified the input lock and release, queued solve recovery, reduced motion, and full production solves with desktop and emulated touch input.
   - date: 2026-11-28
