import { Alg, Move } from 'cubing/alg';
import type { KPattern } from 'cubing/kpuzzle';
import { setTwistyDebug, TwistyPlayer } from 'cubing/twisty';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { addFaceHighlight } from './faceHighlight';
import { FaceGuide } from './FaceGuide';
import {
  faceNames, findAction, isUtilityAction, readBindings, saveBindings, shortcutFromEvent,
  type Bindings, type Control, type CubeFace, type UtilityAction,
} from './cubeControls';
import { generateScramble, readPosition, savePosition, type CubeMove } from './cubePosition';
import { ThemePicker } from './ThemePicker';
import { TurnHelp } from './TurnHelp';
import { TurnControls } from './TurnControls';

const defaultView = { cameraLatitude: 35, cameraLongitude: 30, cameraDistance: 6 };
const orbitHintDelay = 3000;
const highlightDuration = 2000;
const turnTimeout = 1200;
const scrambleTimeout = 15000;
const solvedOptions = { ignorePuzzleOrientation: true, ignoreCenterOrientation: true };

export function App({ solvedPattern }: { solvedPattern: KPattern }) {
  const viewer = useRef<HTMLDivElement>(null);
  const player = useRef<TwistyPlayer>(null);
  const rearViewRequested = useRef(false);
  const camera = useRef({ latitude: defaultView.cameraLatitude, longitude: defaultView.cameraLongitude });
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const scrambleRequest = useRef<symbol | null>(null);
  const pendingMove = useRef<CubeMove | null>(null);
  const moveQueue = useRef<CubeMove[]>([]);
  const startAnimatedMove = useRef<((move: CubeMove) => void) | null>(null);
  const [algorithm, setAlgorithm] = useState(readPosition);
  const completedMoves = useRef(algorithm);
  const orbitHintTimer = useRef<number | undefined>(undefined);
  const moveID = useRef(0);
  const [turning, setTurning] = useState(false);
  const [orbiting, setOrbiting] = useState(false);
  const [scrambling, setScrambling] = useState(false);
  const [scrambleError, setScrambleError] = useState(false);
  const [recentMoves, setRecentMoves] = useState<{ id: number; move: CubeMove }[]>([]);
  const [showBack, setShowBack] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [highlightedFace, setHighlightedFace] = useState<CubeFace | null>(null);
  const [atDefaultView, setAtDefaultView] = useState(true);
  const [showOrbitHint, setShowOrbitHint] = useState(true);
  const [bindings, setBindings] = useState(readBindings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [animateTurns, setAnimateTurns] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const showGuide = atDefaultView && showLabels;
  const isHighlighting = highlightedFace !== null;
  const controlsLocked = isHighlighting || scrambling;
  const puzzleBusy = controlsLocked || turning || orbiting || settingsOpen;
  const hasPosition = algorithm.experimentalNumChildAlgNodes() > 0;
  const isSolved = solvedPattern.applyAlg(algorithm).experimentalIsSolved(solvedOptions);

  function recordPosition(next: Alg) {
    completedMoves.current = next;
    setAlgorithm(next);
    savePosition(next);
  }

  useEffect(() => {
    setTwistyDebug({ shareAllNewRenderers: 'always' });
    const cube = new TwistyPlayer({
      puzzle: '3x3x3',
      visualization: '3D',
      background: 'none',
      hintFacelets: 'none',
      controlPanel: 'none',
      viewerLink: 'none',
      experimentalDragInput: 'none',
      experimentalMovePressInput: 'none',
      ...defaultView,
      cameraLatitudeLimit: 90,
      tempoScale: 1.7,
    });
    cube.alg = completedMoves.current;
    cube.timestamp = 'end';
    player.current = cube;
    viewer.current?.appendChild(cube);

    const catchUpMove = cube.experimentalModel.catchUpMove;
    let animationStarted = false;
    let watchdog: number | undefined;

    function recoverTurns() {
      if (!pendingMove.current) return;

      // An interrupted animation must not keep the queue locked or drop accepted inputs.
      const moves = [pendingMove.current, ...moveQueue.current];
      const next = moves.reduce((position, move) => position.concat(move), completedMoves.current);
      pendingMove.current = null;
      moveQueue.current = [];
      animationStarted = false;
      catchUpMove.set({ move: null, amount: 0 });
      cube.alg = next;
      cube.timestamp = 'end';
      recordPosition(next);
      setTurning(false);
    }

    function animateMove(move: CubeMove) {
      pendingMove.current = move;
      animationStarted = false;
      cube.alg = completedMoves.current.concat(move);
      cube.timestamp = 'end';
      watchdog = window.setTimeout(recoverTurns, turnTimeout);
      catchUpMove.set({ move: new Move(move), amount: 0 });
    }

    startAnimatedMove.current = animateMove;
    const onAnimationChange = ({ move }: { move: object | null }) => {
      if (move) {
        animationStarted = true;
      } else if (animationStarted && pendingMove.current) {
        window.clearTimeout(watchdog);
        recordPosition(completedMoves.current.concat(pendingMove.current));
        animationStarted = false;
        pendingMove.current = null;
        const nextMove = moveQueue.current.shift();
        if (nextMove) animateMove(nextMove);
        else setTurning(false);
      }
    };
    catchUpMove.addFreshListener(onAnimationChange);

    return () => {
      window.clearTimeout(orbitHintTimer.current);
      window.clearTimeout(watchdog);
      catchUpMove.removeFreshListener(onAnimationChange);
      startAnimatedMove.current = null;
      rearViewRequested.current = false;
      scrambleRequest.current = null;
      cube.remove();
      player.current = null;
    };
  }, []);

  useEffect(() => {
    const cube = player.current;
    if (!cube || (!showBack && !rearViewRequested.current)) return;

    // Removing the inset through cubing.js also disconnects the main scene's move listener.
    if (!rearViewRequested.current) {
      rearViewRequested.current = true;
      cube.backView = 'top-right';
    }

    let cancelled = false;
    let retry: number | undefined;
    async function updateRearView(attempts: number) {
      if (cancelled || !cube) return;
      const [, rear] = [...await cube.experimentalCurrentVantages()];
      if (cancelled) return;
      if (rear) {
        rear.style.display = showBack ? '' : 'none';
      } else if (attempts > 0) {
        retry = window.setTimeout(() => { void updateRearView(attempts - 1); }, 16);
      }
    }

    void cube.experimentalCurrentThreeJSPuzzleObject().then(
      () => updateRearView(90),
      (error: unknown) => { if (!cancelled) console.error('Could not initialize the rear view.', error); },
    );

    return () => {
      cancelled = true;
      window.clearTimeout(retry);
    };
  }, [showBack]);

  useEffect(() => {
    const cube = player.current;
    if (!cube || !highlightedFace) return;

    let cancelled = false;
    let removeHighlight: (() => void) | undefined;
    function clearHighlight() {
      cancelled = true;
      removeHighlight?.();
      removeHighlight = undefined;
    }
    const timer = window.setTimeout(() => {
      clearHighlight();
      setHighlightedFace(null);
    }, highlightDuration);
    void addFaceHighlight(cube, highlightedFace).then((remove) => {
      if (cancelled) {
        remove();
        return;
      }
      removeHighlight = remove;
    }, (error: unknown) => {
      if (cancelled) return;
      console.error('Could not highlight the face.', error);
      setHighlightedFace(null);
    });

    return () => {
      window.clearTimeout(timer);
      clearHighlight();
    };
  }, [highlightedFace]);

  function noteMovement() {
    setShowOrbitHint(false);
    window.clearTimeout(orbitHintTimer.current);
    orbitHintTimer.current = window.setTimeout(() => setShowOrbitHint(true), orbitHintDelay);
  }

  function turn(move: CubeMove) {
    const cube = player.current;
    if (!cube || highlightedFace || scrambleRequest.current) return;
    noteMovement();
    const entry = { id: ++moveID.current, move };
    setRecentMoves((recent) => [entry, ...recent].slice(0, 3));

    if (pendingMove.current) {
      moveQueue.current.push(move);
      return;
    }

    if (!animateTurns) {
      const next = completedMoves.current.concat(move);
      cube.alg = next;
      recordPosition(next);
      return;
    }

    setTurning(true);
    startAnimatedMove.current?.(move);
  }

  function setView(latitude: number, longitude: number) {
    const cube = player.current;
    if (!cube || highlightedFace || scrambleRequest.current) return;
    noteMovement();
    camera.current = { latitude, longitude };
    cube.cameraLatitude = latitude;
    cube.cameraLongitude = longitude;
    setAtDefaultView(latitude === defaultView.cameraLatitude && longitude === defaultView.cameraLongitude);
  }

  function startOrbit(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || drag.current || highlightedFace || scrambleRequest.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    setOrbiting(true);
  }

  function orbitView(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId || highlightedFace) return;

    const size = Math.min(event.currentTarget.clientWidth, event.currentTarget.clientHeight);
    const degreesPerPixel = 180 / size;
    const latitude = camera.current.latitude + (event.clientY - start.y) * degreesPerPixel;
    const longitude = camera.current.longitude - (event.clientX - start.x) * degreesPerPixel;
    drag.current = { id: start.id, x: event.clientX, y: event.clientY };
    setView(Math.max(-90, Math.min(90, latitude)), longitude);
  }

  function endOrbit(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    setOrbiting(false);
  }

  function resetView() {
    setView(defaultView.cameraLatitude, defaultView.cameraLongitude);
  }

  function toggleBackView() {
    setShowBack((backView) => !backView);
  }

  function canReplacePosition() {
    return !scrambleRequest.current && !pendingMove.current && !drag.current && !highlightedFace && !settingsOpen;
  }

  function replacePosition(cube: TwistyPlayer, next: Alg) {
    moveQueue.current = [];
    cube.alg = next;
    cube.timestamp = 'end';
    setRecentMoves([]);
    recordPosition(next);
  }

  async function scramble() {
    const cube = player.current;
    if (!cube || !canReplacePosition()) return;

    const request = Symbol();
    scrambleRequest.current = request;
    setScrambleError(false);
    setScrambling(true);
    let timeout: number | undefined;

    try {
      const next = await Promise.race([
        generateScramble(),
        new Promise<never>((_, reject) => {
          timeout = window.setTimeout(() => reject(new Error('Scramble generation timed out.')), scrambleTimeout);
        }),
      ]);
      if (scrambleRequest.current !== request) return;
      if (solvedPattern.applyAlg(next).experimentalIsSolved(solvedOptions)) throw new Error('The scramble did not change the solved position.');
      replacePosition(cube, next);
    } catch (error) {
      if (scrambleRequest.current !== request) return;
      console.error('Could not scramble the cube.', error);
      setScrambleError(true);
    } finally {
      window.clearTimeout(timeout);
      if (scrambleRequest.current === request) {
        scrambleRequest.current = null;
        setScrambling(false);
      }
    }
  }

  function resetPuzzle() {
    const cube = player.current;
    if (!cube || !canReplacePosition() || completedMoves.current.experimentalNumChildAlgNodes() === 0) return;

    setScrambleError(false);
    replacePosition(cube, new Alg());
  }

  const controls: Record<UtilityAction, Control> = {
    scramble: { run: () => { void scramble(); }, disabled: puzzleBusy },
    resetPuzzle: { run: resetPuzzle, disabled: puzzleBusy || !hasPosition },
    animation: { run: () => setAnimateTurns((value) => !value), disabled: controlsLocked || turning, checked: animateTurns },
    faceArrows: { run: () => setShowLabels((value) => !value), disabled: !atDefaultView || controlsLocked, checked: showGuide },
    resetView: { run: resetView, disabled: controlsLocked },
    backView: { run: toggleBackView, disabled: controlsLocked, checked: showBack },
    rotateFront: { run: () => turn('y'), disabled: controlsLocked },
    flipCube: { run: () => turn('x2'), disabled: controlsLocked },
  };

  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (controlsLocked || scrambleRequest.current || settingsOpen || event.defaultPrevented) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select, [role="textbox"]'))) return;

    const shortcut = shortcutFromEvent(event);
    const action = shortcut && findAction(bindings, shortcut);
    if (!action) return;
    event.preventDefault();

    if (isUtilityAction(action)) {
      const control = controls[action];
      if (!control.disabled) control.run();
    } else turn(action);
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onShortcut(event);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  function highlightFace(face: CubeFace) {
    if (!turning && !highlightedFace && !drag.current && !scrambleRequest.current) setHighlightedFace(face);
  }

  function updateBindings(next: Bindings) {
    setBindings(next);
    saveBindings(next);
  }

  const positionLabel = highlightedFace
    ? `Highlighting ${faceNames[highlightedFace]}`
    : scrambling ? 'Scrambling…' : turning ? 'Turning…' : isSolved ? 'Solved' : 'Unsolved';

  return (
    <main className="playground">
      <header className="page-header">
        <h1>Cube Lab</h1>
        <div className="header-actions" inert={isHighlighting}>
          <ThemePicker />
          <TurnHelp />
        </div>
      </header>

      <section className="stage" aria-labelledby="puzzle-title">
        <div className="stage-header">
          <h2 id="puzzle-title">3 × 3 × 3</h2>
          <p className="position" role="status">
            {positionLabel}
          </p>
        </div>
        <div className="cube-stage">
          <div
            className="cube-viewer"
            ref={viewer}
            onPointerDown={startOrbit}
            onPointerMove={orbitView}
            onPointerUp={endOrbit}
            onPointerCancel={endOrbit}
            onLostPointerCapture={endOrbit}
          />
          {showGuide && (
            <FaceGuide activeFace={highlightedFace} disabled={turning || controlsLocked} onHighlight={highlightFace} />
          )}
          {recentMoves.length > 0 && (
            <ol className="recent-moves" aria-label="Recent moves, newest first">
              {recentMoves.map(({ id, move }) => (
                <li key={id} aria-label={move === 'x2' ? 'Flip cube' : move === 'y' ? 'Rotate front' : undefined}>
                  <kbd>{move.replace("'", '′')}</kbd>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="viewer-messages">
          <p className="orbit-hint" data-visible={showOrbitHint && !controlsLocked}>Drag or swipe to orbit.</p>
          {scrambleError && <p className="scramble-error" role="alert">Could not scramble the cube. Reload the page to try again.</p>}
        </div>
      </section>

      <TurnControls
        bindings={bindings}
        disabled={controlsLocked}
        settingsOpen={settingsOpen}
        onSettings={() => setSettingsOpen(!settingsOpen)}
        onBindings={updateBindings}
        onTurn={turn}
        controls={controls}
      />
    </main>
  );
}
