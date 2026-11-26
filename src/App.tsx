import { Move, type Alg } from 'cubing/alg';
import type { KPattern } from 'cubing/kpuzzle';
import { setTwistyDebug, TwistyPlayer } from 'cubing/twisty';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { addFaceHighlight } from './faceHighlight';
import { FaceGuide } from './FaceGuide';
import { faceNames, findAction, formatShortcut, isViewerAction, readBindings, saveBindings, shortcutFromEvent, viewerActions, viewerNames, type Bindings, type CubeFace, type ViewerAction } from './cubeControls';
import { readPosition, savePosition, type CubeMove } from './cubePosition';
import { ThemePicker } from './ThemePicker';
import { TurnHelp } from './TurnHelp';
import { TurnControls } from './TurnControls';

const defaultView = { cameraLatitude: 35, cameraLongitude: 30, cameraDistance: 6 };
const orbitHintDelay = 3000;
const highlightDuration = 2000;
const turnTimeout = 1200;

export function App({ solvedPattern }: { solvedPattern: KPattern }) {
  const viewer = useRef<HTMLDivElement>(null);
  const player = useRef<TwistyPlayer>(null);
  const rearViewRequested = useRef(false);
  const camera = useRef({ latitude: defaultView.cameraLatitude, longitude: defaultView.cameraLongitude });
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const pendingMove = useRef<CubeMove | null>(null);
  const moveQueue = useRef<CubeMove[]>([]);
  const startAnimatedMove = useRef<((move: CubeMove) => void) | null>(null);
  const [algorithm, setAlgorithm] = useState(readPosition);
  const completedMoves = useRef(algorithm);
  const orbitHintTimer = useRef<number | undefined>(undefined);
  const moveID = useRef(0);
  const [turning, setTurning] = useState(false);
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
  const isSolved = solvedPattern.applyAlg(algorithm).experimentalIsSolved({
    ignorePuzzleOrientation: true,
    ignoreCenterOrientation: true,
  });

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
    if (!cube || highlightedFace) return;
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
    if (!cube || highlightedFace) return;
    noteMovement();
    camera.current = { latitude, longitude };
    cube.cameraLatitude = latitude;
    cube.cameraLongitude = longitude;
    setAtDefaultView(latitude === defaultView.cameraLatitude && longitude === defaultView.cameraLongitude);
  }

  function startOrbit(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || drag.current || highlightedFace) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
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
    if (drag.current?.id === event.pointerId) drag.current = null;
  }

  function resetView() {
    setView(defaultView.cameraLatitude, defaultView.cameraLongitude);
  }

  function toggleBackView() {
    setShowBack((backView) => !backView);
  }

  const viewerCommands: Record<ViewerAction, () => void> = {
    resetView, backView: toggleBackView, rotateFront: () => turn('y'), flipCube: () => turn('x2'),
  };

  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (isHighlighting || settingsOpen || event.defaultPrevented) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select, [role="textbox"]'))) return;

    const shortcut = shortcutFromEvent(event);
    const action = shortcut && findAction(bindings, shortcut);
    if (!action) return;
    event.preventDefault();

    if (isViewerAction(action)) viewerCommands[action]();
    else turn(action);
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onShortcut(event);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  function highlightFace(face: CubeFace) {
    if (!turning && !highlightedFace && !drag.current) setHighlightedFace(face);
  }

  function updateBindings(next: Bindings) {
    setBindings(next);
    saveBindings(next);
  }

  const positionLabel = highlightedFace
    ? `Highlighting ${faceNames[highlightedFace]}`
    : turning ? 'Turning…' : isSolved ? 'Solved' : 'Unsolved';

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
            onLostPointerCapture={endOrbit}
          />
          {showGuide && (
            <FaceGuide activeFace={highlightedFace} disabled={turning || isHighlighting} onHighlight={highlightFace} />
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
        <div className="view-controls">
          <p className="orbit-hint" data-visible={showOrbitHint && !isHighlighting}>Drag or swipe to orbit.</p>
          <div className="buttons viewer-switch-row" role="group" aria-label="Display controls">
            <ViewerSwitch label="Animation" checked={animateTurns} disabled={isHighlighting || turning} onToggle={() => setAnimateTurns(!animateTurns)} />
            <ViewerSwitch
              label="Face arrows"
              checked={showGuide}
              disabled={!atDefaultView || isHighlighting}
              onToggle={() => setShowLabels(!showLabels)}
            />
          </div>
          <div className="buttons" role="group" aria-label="View and orientation controls">
            {viewerActions.map((action) => (
              <button
                key={action}
                type="button"
                disabled={isHighlighting}
                title={formatShortcut(bindings[action])}
                onClick={viewerCommands[action]}
                aria-pressed={action === 'backView' ? showBack : undefined}
              >
                {viewerNames[action]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <TurnControls
        bindings={bindings}
        disabled={isHighlighting}
        settingsOpen={settingsOpen}
        onSettings={() => setSettingsOpen(!settingsOpen)}
        onBindings={updateBindings}
        onTurn={turn}
        onViewerAction={(action) => viewerCommands[action]()}
        backView={showBack}
      />
    </main>
  );
}

function ViewerSwitch({ label, checked, disabled, onToggle }: {
  label: string;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button className="viewer-switch" type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={onToggle}>
      {label}<span className="switch-track" aria-hidden="true" />
    </button>
  );
}
