import { Alg } from 'cubing/alg';
import type { KPattern } from 'cubing/kpuzzle';
import { TwistyPlayer } from 'cubing/twisty';
import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';

type RightTurn = 'R' | "R'";

const defaultView = { cameraLatitude: 35, cameraLongitude: 30, cameraDistance: 6 };

export function App({ solvedPattern }: { solvedPattern: KPattern }) {
  const viewer = useRef<HTMLDivElement>(null);
  const player = useRef<TwistyPlayer>(null);
  const camera = useRef({ latitude: defaultView.cameraLatitude, longitude: defaultView.cameraLongitude });
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const pendingMove = useRef<RightTurn | null>(null);
  const [algorithm, setAlgorithm] = useState(() => new Alg());
  const [turning, setTurning] = useState(false);
  const [showBack, setShowBack] = useState(false);
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
        pendingMove.current = null;
        setAlgorithm((current) => current.concat(completedMove));
        setTurning(false);
      }
    };
    catchUpMove.addFreshListener(onAnimationChange);

    return () => {
      catchUpMove.removeFreshListener(onAnimationChange);
      cube.remove();
      player.current = null;
    };
  }, []);

  function turn(move: RightTurn) {
    const cube = player.current;
    if (!cube || pendingMove.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const next = algorithm.concat(move);
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
    if (!cube) return;
    camera.current = { latitude, longitude };
    cube.cameraLatitude = latitude;
    cube.cameraLongitude = longitude;
  }

  function startOrbit(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || drag.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function orbitView(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;

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

  function toggleBackView() {
    if (!player.current) return;
    const next = !showBack;
    player.current.backView = next ? 'top-right' : 'none';
    setShowBack(next);
  }

  return (
    <main className="playground">
      <h1>Cube Lab</h1>

      <section className="stage" aria-labelledby="puzzle-title">
        <div className="stage-header">
          <h2 id="puzzle-title">3 × 3 × 3</h2>
          <p className="position" role="status">
            {turning ? 'Turning…' : isSolved ? 'Solved' : 'Unsolved'}
          </p>
        </div>
        <div
          className="cube-viewer"
          ref={viewer}
          onPointerDown={startOrbit}
          onPointerMove={orbitView}
          onLostPointerCapture={endOrbit}
        />
        <div className="view-controls">
          <p>Drag or swipe to orbit.</p>
          <div className="buttons" role="group" aria-label="Camera controls">
            <button type="button" onClick={() => setView(defaultView.cameraLatitude, defaultView.cameraLongitude)}>Reset view</button>
            <button type="button" onClick={() => setView(-80, camera.current.longitude)}>View bottom</button>
            <button type="button" onClick={toggleBackView} aria-pressed={showBack}>Back view</button>
          </div>
        </div>
      </section>

      <section className="controls" aria-labelledby="controls-title">
        <div>
          <h2 id="controls-title">Right face</h2>
          <p>R and R′ turn the same face from any camera angle.</p>
        </div>
        <div className="buttons">
          <button type="button" disabled={turning} onClick={() => turn('R')} aria-label="R, clockwise">R</button>
          <button type="button" disabled={turning} onClick={() => turn("R'")} aria-label="R prime, counterclockwise">R′</button>
        </div>
      </section>
    </main>
  );
}
