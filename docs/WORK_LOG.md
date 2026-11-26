# Work log

Record meaningful changes and decisions after each work session. Add issue, PR, or commit links when available. Under verification, record what ran and the observed result.

## Next tasks

- [ ] Complete the 3×3 controls, scramble, reset, and timer. Run the local MVP checks.
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
