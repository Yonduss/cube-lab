import { Alg } from 'cubing/alg';
import type { KPattern } from 'cubing/kpuzzle';
import { TwistyPlayer } from 'cubing/twisty';
import { useEffect, useRef, useState } from 'react';

export function App({ solvedPattern }: { solvedPattern: KPattern }) {
  const viewer = useRef<HTMLDivElement>(null);
  const player = useRef<TwistyPlayer>(null);
  const [algorithm, setAlgorithm] = useState(() => new Alg());
  const isSolved = solvedPattern.applyAlg(algorithm).isIdentical(solvedPattern);

  useEffect(() => {
    const cube = new TwistyPlayer({
      puzzle: '3x3x3',
      visualization: '3D',
      background: 'none',
      hintFacelets: 'none',
      controlPanel: 'none',
      viewerLink: 'none',
      experimentalMovePressInput: 'none',
    });
    cube.timestamp = 'end';
    player.current = cube;
    viewer.current?.appendChild(cube);

    return () => {
      cube.remove();
      player.current = null;
    };
  }, []);

  useEffect(() => {
    if (player.current) player.current.alg = algorithm;
  }, [algorithm]);

  function turn(move: 'R' | "R'") {
    setAlgorithm((current) => current.concat(move));
  }

  return (
    <main className="playground">
      <h1>Cube Lab</h1>

      <section className="stage" aria-labelledby="puzzle-title">
        <div className="stage-header">
          <h2 id="puzzle-title">3 × 3 × 3</h2>
          <p className="position" role="status">{isSolved ? 'Solved' : 'Unsolved'}</p>
        </div>
        <div className="cube-viewer" ref={viewer} />
        <p className="orbit-help">Drag or swipe to orbit.</p>
      </section>

      <section className="controls" aria-labelledby="controls-title">
        <div>
          <h2 id="controls-title">Right face</h2>
          <p>Try R, then R′ to undo the turn.</p>
        </div>
        <div className="buttons">
          <button type="button" onClick={() => turn('R')} aria-label="R, clockwise">R</button>
          <button type="button" onClick={() => turn("R'")} aria-label="R prime, counterclockwise">R′</button>
        </div>
      </section>
    </main>
  );
}
