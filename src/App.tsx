import { Alg } from 'cubing/alg';
import type { KPattern } from 'cubing/kpuzzle';
import { TwistyPlayer } from 'cubing/twisty';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { addFaceHighlight } from './faceHighlight';
import { FaceGuide } from './FaceGuide';
import { faceNames, findAction, formatShortcut, readBindings, saveBindings, shortcutFromEvent, type Bindings, type CubeFace, type FaceTurn } from './cubeControls';
import { ThemePicker } from './ThemePicker';
import { TurnHelp } from './TurnHelp';
import { TurnControls } from './TurnControls';

const defaultView = { cameraLatitude: 35, cameraLongitude: 30, cameraDistance: 6 };
const orbitHintDelay = 3000;
const highlightDuration = 750;

export function App({ solvedPattern }: { solvedPattern: KPattern }) {
  const viewer = useRef<HTMLDivElement>(null);
  const player = useRef<TwistyPlayer>(null);
  const camera = useRef({ latitude: defaultView.cameraLatitude, longitude: defaultView.cameraLongitude });
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const pendingMove = useRef<FaceTurn | null>(null);
  const moveQueue = useRef<FaceTurn[]>([]);
  const completedMoves = useRef(new Alg());
  const orbitHintTimer = useRef<number | undefined>(undefined);
  const [algorithm, setAlgorithm] = useState(() => new Alg());
  const [turning, setTurning] = useState(false);
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
  const isSolved = solvedPattern.applyAlg(algorithm).isIdentical(solvedPattern);

  useEffect(() => {
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
    cube.timestamp = 'end';
    player.current = cube;
    viewer.current?.appendChild(cube);

    const catchUpMove = cube.experimentalModel.catchUpMove;
    let animationStarted = false;
    const onAnimationChange = ({ move }: { move: object | null }) => {
      if (move) {
        animationStarted = true;
      } else if (animationStarted && pendingMove.current) {
        const completedMove = pendingMove.current;
        animationStarted = false;
        completedMoves.current = completedMoves.current.concat(completedMove);
        setAlgorithm(completedMoves.current);
        const nextMove = moveQueue.current.shift();
        pendingMove.current = nextMove ?? null;
        if (nextMove) cube.experimentalAddMove(nextMove, { cancel: false });
        else setTurning(false);
      }
    };
    catchUpMove.addFreshListener(onAnimationChange);

    return () => {
      window.clearTimeout(orbitHintTimer.current);
      catchUpMove.removeFreshListener(onAnimationChange);
      cube.remove();
      player.current = null;
    };
  }, []);

  useEffect(() => {
    const cube = player.current;
    if (!cube) return;
    cube.backView = showBack ? 'top-right' : 'none';
  }, [showBack]);

  useEffect(() => {
    const cube = player.current;
    if (!cube || !highlightedFace) return;

    let cancelled = false;
    let removeHighlight: (() => void) | undefined;
    // Keep controls usable even if the renderer cannot initialize the highlight.
    let timer = window.setTimeout(() => setHighlightedFace(null), 2500);
    void addFaceHighlight(cube, highlightedFace).then((remove) => {
      if (cancelled) {
        remove();
        return;
      }
      removeHighlight = remove;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setHighlightedFace(null), highlightDuration);
    }, (error: unknown) => {
      if (cancelled) return;
      console.error('Could not highlight the face.', error);
      setHighlightedFace(null);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      removeHighlight?.();
    };
  }, [highlightedFace]);

  function noteMovement() {
    setShowOrbitHint(false);
    window.clearTimeout(orbitHintTimer.current);
    orbitHintTimer.current = window.setTimeout(() => setShowOrbitHint(true), orbitHintDelay);
  }

  function turn(move: FaceTurn) {
    const cube = player.current;
    if (!cube || highlightedFace) return;
    noteMovement();

    if (pendingMove.current) {
      moveQueue.current.push(move);
      return;
    }

    if (!animateTurns) {
      const next = completedMoves.current.concat(move);
      completedMoves.current = next;
      cube.alg = next;
      setAlgorithm(next);
      return;
    }

    pendingMove.current = move;
    setTurning(true);
    cube.experimentalAddMove(move, { cancel: false });
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

  function viewBottom() {
    setView(-80, camera.current.longitude);
  }

  function toggleBackView() {
    setShowBack((backView) => !backView);
  }

  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (isHighlighting || settingsOpen || event.defaultPrevented) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select, [role="textbox"]'))) return;

    const shortcut = shortcutFromEvent(event);
    const action = shortcut && findAction(bindings, shortcut);
    if (!action) return;
    event.preventDefault();

    if (action === 'resetView') resetView();
    else if (action === 'viewBottom') viewBottom();
    else if (action === 'backView') toggleBackView();
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
        </div>
        <div className="view-controls">
          <p className="orbit-hint" data-visible={showOrbitHint && !isHighlighting}>Drag or swipe to orbit.</p>
          <div className="buttons" role="group" aria-label="Viewer controls">
            <ViewerSwitch label="Animation" checked={animateTurns} disabled={isHighlighting || turning} onToggle={() => setAnimateTurns(!animateTurns)} />
            <button type="button" disabled={isHighlighting} title={formatShortcut(bindings.resetView)} onClick={resetView}>Reset view</button>
            <button type="button" disabled={isHighlighting} title={formatShortcut(bindings.viewBottom)} onClick={viewBottom}>View bottom</button>
            <button type="button" disabled={isHighlighting} title={formatShortcut(bindings.backView)} onClick={toggleBackView} aria-pressed={showBack}>Back view</button>
            <ViewerSwitch
              label="Face arrows"
              checked={showGuide}
              disabled={!atDefaultView || isHighlighting}
              onToggle={() => setShowLabels(!showLabels)}
            />
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
