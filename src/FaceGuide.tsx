import { faceNames, type CubeFace } from './cubeControls';

const hiddenFaces = new Set<CubeFace>(['L', 'B', 'D']);

// The cubing.js 3×3 center orbit uses the order U, L, F, R, B, D.
const centerColors = ['white', 'orange', 'green', 'red', 'blue', 'yellow'];

export function FaceGuide({ activeFace, centers, disabled, onHighlight }: {
  activeFace: CubeFace | null;
  centers: number[];
  disabled: boolean;
  onHighlight: (face: CubeFace) => void;
}) {
  return (
    <div className="face-guide" role="group" aria-label="Face directions">
      {faces.map(([letter, arrow, center]) => (
        <span className={`face-marker face-marker-${letter.toLowerCase()}`} key={letter}>
          <button
            type="button"
            className={hiddenFaces.has(letter) ? 'face-marker-hidden' : undefined}
            aria-label={`Highlight ${faceNames[letter]} face (${letter})`}
            aria-disabled={disabled}
            tabIndex={disabled && activeFace !== letter ? -1 : undefined}
            data-active={activeFace === letter}
            data-color={centerColors[centers[center]]}
            onClick={() => { if (!disabled) onHighlight(letter); }}
          >
            {letter}
          </button>
          <span aria-hidden="true">{arrow}</span>
        </span>
      ))}
    </div>
  );
}

const faces = [
  ['U', '↓', 0], ['F', '→', 2], ['R', '←', 3], ['L', '↘', 1], ['B', '↙', 4], ['D', '↑', 5],
] as const;
