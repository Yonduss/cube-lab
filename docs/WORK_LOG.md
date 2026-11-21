# Work log

Record meaningful changes and decisions after each work session. Add issue, PR, or commit links when available. Under verification, record what ran and the observed result.

## Next tasks

- [ ] Convert the existing TypeScript starter into a React and Vite browser entry point.
- [ ] Verify `cubing.js` integration with a 3×3, one known turn, its inverse, and a matching tracked position.
- [ ] Complete the 3×3 controls, scramble, reset, and timer. Run the local MVP checks.
- [ ] Write the personal 3×3 solve guide. Verify one documented case on a physical cube and in Cube Lab, then link the guide from the project README.
- [ ] Add puzzle selection and run the switching checks for every exposed puzzle.
- [ ] Preview the production build locally, deploy to GitHub Pages, and record the verified URL and workflow run.
- [ ] Capture a cube preview and update the GitHub profile README with the public link.
- [ ] Prototype **Enable tilt controls** and **Rotate View** on the 3×3 for the second Pages release. Verify calibration, one action per tilt, and permission handling on real phones.
- [ ] Prototype the **Turn Face** mode with explicit face selection. Include it in the tilt release if the face-turn and timer checks pass.
- [ ] Optional after the mobile tilt release. Prototype desktop webcam **Rotate View** on the 3×3 and verify the gesture and camera controls.

See the [project plan](PROJECT_PLAN.md) for acceptance criteria and the [deployment guide](DEPLOYMENT.md) for publishing steps.

## 2026-11-21 · Project planning

- **Completed** · Documented the MVP, expansion milestones, profile concept, reference sources, and deployment procedure.
- **Decisions** · Start with one playable 3×3. Use Cube Lab and Think. Turn. Solve. as working copy. Evaluate React, Vite, and `cubing.js` in the first implementation session.
- **Verification** · Inspected the local TypeScript starter and checked the upstream documentation and project references. Gameplay and deployment checks are pending implementation.
- **Next** · Render a 3×3 and verify a turn and its inverse before adding the timer.

## 2026-11-21 · Personal solve guide and repository review

- **Completed** · Updated the profile copy and added a milestone for documenting a personally discovered 3×3 move sequence.
- **Decisions** · Write and verify one example after the playable 3×3, then move on to puzzle selection. Keep the guide with the app and project docs.
- **Verification** · Confirmed that local Git is initialized and that the first commit and remote are pending. Identified WebStorm settings among the files to review before sharing.

## 2026-11-21 · Mobile tilt release planning

- **Completed** · Added the post-launch tilt milestone, mode behavior, and real-device release checks.
- **Decisions** · Target the second Pages release for 3×3 tilt controls. Start with camera rotation and ship face turns when their gesture and timer behavior are verified.
- **Verification** · Real-device checks are pending implementation.

## 2026-11-21 · Optional webcam controls

- **Completed** · Added an optional post-tilt milestone for desktop webcam controls.
- **Decisions** · Use browser-based hand tracking, start with a single camera gesture, and evaluate face turns after the prototype.
- **Verification** · Webcam checks are pending implementation.

## Entry template

```markdown
## YYYY-MM-DD · Session title

- **Completed** · What changed and any issue, PR, or commit link.
- **Decisions** · What was chosen and why.
- **Verification** · Command or manual check, result, and any pending checks.
- **Next** · The next task or current blocker.
```
