# Cube Lab project plan

## Goal

Build an interactive twisty-puzzle playground that connects a personal interest in cubing with how I approach software engineering. A visitor can open the playground from my GitHub profile, scramble the default 3×3 cube, and solve it on a desktop or phone.

The separate project repository will hold the source and host the app on GitHub Pages. The profile repository will hold the introduction and a linked cube preview. GitHub strips script tags when rendering a README, so the interactive experience starts on the project site. [GitHub Markdown rendering pipeline](https://github.com/github/markup#github-markup)

All UI copy and project documentation will be in English. Gameplay runs in the browser with no backend or account system.

## Milestones

| Milestone | Work | Completion criteria |
| --- | --- | --- |
| 0. Planning | Define scope, references, work log, and the deployment procedure. | The first implementation task has a clear scope and acceptance criteria. |
| 1. Playable 3×3 | Render one puzzle. Add orbit, turns, Scramble, Reset, timing, and solved detection. | A visitor can complete a timed solve with keyboard controls or touch buttons. The MVP checklist passes locally. |
| 2. Personal 3×3 solve guide | Document how I solve the 3×3, including the move sequence I found by experimenting. | A reader can reproduce a documented example from its starting position in Cube Lab. |
| 3. Puzzle selection | Add 2×2, 4×4, 5×5, Pyraminx, and Megaminx incrementally. Make 3×3 the default and expose a selector. | Every exposed puzzle passes the switching and gameplay checks locally. |
| 4. First GitHub Pages release and profile | Verify the production build locally, publish touch and keyboard gameplay, then link a cube preview from the profile README. | The live URL opens publicly, gameplay passes a smoke test, and the profile preview opens the deployed site. Record the verified release steps. |
| 5. Mobile tilt controls | Prototype **Rotate View** for the 3×3, then try **Turn Face**. Target the second GitHub Pages release for the first verified tilt mode. | Publish **Rotate View** once it passes the real-device checks. Include **Turn Face** when it also passes its checks. |
| 6. Webcam hand controls (optional) | After the mobile tilt release, prototype desktop webcam gestures for **Rotate View** on the 3×3. | A deliberate gesture rotates the view once, and mouse and keyboard remain usable with the camera off or unavailable. |

Mirror Cube is a follow-up candidate. Confirm whether the selected renderer can represent pieces with different dimensions and preserve their solved shape. If custom geometry is needed, evaluate Three.js separately. Solve history, per-puzzle personal bests, and average of five (Ao5) are follow-up features. When records are added, store them in `localStorage` by puzzle and check that play still works when storage is unavailable.

## 3×3 MVP

| Feature | Expected behavior |
| --- | --- |
| View | Open with a solved 3×3 or restore the last completed position saved in the browser. Drag with a mouse or swipe on the viewer to orbit the camera. Camera movement leaves the puzzle and timer state alone. |
| Turns | Use `R`, `L`, `U`, `D`, `F`, and `B` for quarter turns and `Shift` with the same keys for inverse turns. Provide on-screen controls for both directions so touch users can solve the cube. Show a short control guide. |
| Scramble | Use the cubing.js random-state scrambler for event `333`. Apply the sequence to the solved position. Scrambling again replaces the current sequence and starts a fresh attempt. The timer milestone adds the timing state. |
| Timer | Start on the first accepted face turn after a scramble. Stop when an accepted move completes the solve. Display the final time until Reset or Scramble. Free play from the initial solved position stays untimed. |
| Reset | Restore the solved puzzle and clear the current attempt. Disable Reset while a scramble, turn, drag, or face highlight is active. Keep the state and camera controls independent. |

Direct face dragging is a stretch interaction after keyboard and touch buttons work. If it is added, route its turns through the same state update as other inputs and make the difference between camera orbit and puzzle turns clear.

A future practice mode could unlock Reset after the player completes one face. Define whether that means nine matching stickers or a correctly placed first layer. Check how to handle scrambles that already meet the condition.

### Local acceptance checks

- [ ] Open the app on desktop and at a phone-sized viewport. The cube, timer, Scramble, Reset, and turn controls are usable without horizontal scrolling.
- [ ] Orbit the cube before and after scrambling. The timer stays idle and the puzzle position stays the same.
- [ ] Apply `R` then `R'`, and separately apply four `R` turns. Each sequence returns a solved cube to its starting position.
- [ ] Use a known scramble and its inverse to verify timer start, solved detection, and timer stop. Use a single-turn test scramble to check a solve on the first accepted move.
- [ ] Try rapid input, Reset during an animation, and Reset while the scramble is generating. Check that disabled actions leave the active operation unchanged. Verify that a new scramble and Reset leave the display and the saved position in agreement.
- [ ] Verify that unrelated keys and shortcuts pressed while typing in an editable field leave the puzzle alone.

## Mobile tilt controls

Plan the first tilt release as a follow-up to the initial GitHub Pages launch. Start with the 3×3 so the first tests can focus on calibration, reliable gestures, and how face turns affect the timer. When both modes are available, show **Rotate View** and **Turn Face** as an exclusive two-button selector. Keep swipe and on-screen turns available in both modes.

| Control | Proposed behavior |
| --- | --- |
| **Enable tilt controls** | Tilt starts off. Request orientation permission from the button when the browser requires it. On enable, capture the phone's current posture as neutral and start in **Rotate View**. Provide **Disable tilt controls** and a way to recalibrate. |
| **Rotate View** | An intentional tilt up, down, left, or right moves the camera around the cube by 90°. The puzzle position and timer stay the same. |
| **Turn Face** | Use a face picker labeled `U`, `D`, `L`, `R`, `F`, and `B` and highlight the selected face. Prototype left and right tilts as opposite quarter turns, with direction defined as seen from outside that face. Enable tilt turns once a face is selected. Send each accepted turn through the same move and timer logic as touch and keyboard turns. |

Show the active mode and selected face. Ignore small movements and accept one action per tilt. Require a return near neutral before accepting another action or arming a newly selected mode, so switching while the phone is tilted cannot trigger a move. [W3C Device Orientation and Motion](https://www.w3.org/TR/orientation-event/#deviceorientation) · [WebKit permission behavior](https://bugs.webkit.org/show_bug.cgi?id=201676)

### Mobile release checks

- [ ] On actual devices over HTTPS, verify enable, disable, and recalibration in iOS Safari and Android Chrome. Check that swipe and on-screen turns work if permission is denied or sensor data is unavailable.
- [ ] In **Rotate View**, verify one camera step per deliberate tilt, no repeats while held, and no change to the puzzle position or timer.
- [ ] In **Turn Face**, verify a selected face turns once, the inverse gesture restores it, and an accepted face turn starts the timer after a scramble. Verify no face turn occurs while selecting a mode or a face.

## Optional webcam hand controls

Add an **Enable hand controls** button that requests camera access on desktop. Use `getUserMedia()` for video and MediaPipe Hand Landmarker for tracking in the browser. Process frames locally and stop the camera stream when the user disables hand controls. The prototype fits the existing static GitHub Pages deployment. [MediaPipe web guide](https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker?tab=Web) · [Browser camera API](https://www.w3.org/TR/mediacapture-streams/#dom-mediadevices-getusermedia)

Start with one gesture on the 3×3. Pinch the thumb and index finger together, then move the hand left or right to rotate the camera by 90° using the same action as mobile **Rotate View**. Release the pinch before issuing another command. If this feels reliable, consider adding **Turn Face** with explicit face selection in a later iteration.

- [ ] Verify on a desktop browser over HTTPS that a deliberate gesture rotates the view once and leaves the puzzle position and timer unchanged.
- [ ] Verify that simply moving a hand into or out of view and returning it to its starting position with fingers apart produce no turns.
- [ ] Verify that mouse and keyboard work when permission is denied, a webcam is unavailable, or the camera is disabled. Confirm the camera stream stops when disabled.

## Personal 3×3 solve guide

After the playable 3×3 passes its local checks, create `docs/3X3_SOLVE_GUIDE.md` and link it from the project README. Start with an overview of the stages I use, then document the case I explored in enough detail for someone else to try it. Add more cases as they are verified. A replay in the app can follow once the written example is reproducible.

For each case, record the goal, the cube orientation and starting pattern or setup sequence, the moves in standard notation, and the expected result. Include the approach I used before, what I changed, and which pieces the new sequence moves or preserves. If I find a published match, link to it and describe how I arrived at the sequence independently. [WCA move notation](https://www.worldcubeassociation.org/regulations/#article-12-notation)

Replay the setup and moves on a physical cube and in Cube Lab. Check both the intended result and the pieces that should stay in place. A verified example is enough to move on to puzzle selection.

## Puzzle switching checks

- [ ] Select each supported puzzle from the default 3×3 and switch back. The selected puzzle opens solved with a cleared timer and controls that match its move notation.
- [ ] For each puzzle, verify scramble generation, a legal move and its inverse, and solved detection with a known sequence.
- [ ] Switch puzzles during a timed attempt or while a move or scramble is pending. The previous puzzle's pending work cannot alter the new puzzle or its timer.

## Technical approach

Use React and TypeScript for the UI and Vite for development and the static build. Start with plain CSS for the layout and revisit Tailwind CSS if styling needs grow. Evaluate `cubing.js` in the first milestone for rendering, move notation, puzzle patterns, and scramble generation. Keep the version in the lockfile once the prototype has verified the APIs it uses.

Use one authoritative puzzle position for legal moves and solved detection. Keep camera controls and rendering separate from puzzle moves. Send keyboard and on-screen turns through one move path, and derive timer transitions from accepted player moves. Scramble and Reset should replace the current attempt, including work queued for it.

Start with a small integration check. Render a 3×3 with `TwistyPlayer`, apply one known move and its inverse, and confirm the view and tracked position agree. Verify stable APIs for the chosen version before relying on them. If the player’s gestures cannot report moves reliably, use keyboard and on-screen turns for the MVP while keeping drag for camera orbit. Add puzzle-specific configuration when the second puzzle is introduced.

## GitHub profile concept

**Working project name** · Cube Lab  
**Suggested profile headline** · Think. Turn. Solve.  
**Suggested tagline** · Every problem has a pattern.

> I learned to solve the 3×3 with standard algorithms. While experimenting with my usual approach, I found a different sequence that worked for a case I already knew how to solve. I bring the same curiosity to software engineering.

Place a short looping preview recorded from Cube Lab below the headline. Link the image and an explicit **Play Cube Lab** link to the deployed project. Include descriptive alt text so the preview has a text equivalent. Verify the image and link on the actual GitHub profile after deployment. [GitHub profile README guide](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme) · [GitHub Markdown image syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images)

## Solo development workflow

Use the work log for day-to-day tracking. Create a GitHub issue when a milestone, bug, or investigation needs its own acceptance criteria or a place to capture decisions. Use a self-reviewed PR for changes worth showing in the portfolio, such as the playable MVP, puzzle switching, or publishing setup. Small documentation and copy edits can go in ordinary commits. Link a PR to its issue when one exists.

For AI-assisted development, ask for one observable behavior at a time in English. Include the expected interaction and a short acceptance check. Review the diff, ask for a plain-English explanation of unfamiliar TypeScript where needed, and run the indicated check locally before logging a task as complete.
