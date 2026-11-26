import { faceNames, type CubeFace } from './cubeControls';

export const hiddenFaces: ReadonlySet<CubeFace> = new Set(['L', 'B', 'D']);

export function FaceGuide({ activeFace, disabled, onHighlight }: {
  activeFace: CubeFace | null;
  disabled: boolean;
  onHighlight: (face: CubeFace) => void;
}) {
  return (
    <div
      className="face-guide"
      role="group"
      aria-label="Face directions"
      data-peeking={activeFace !== null && hiddenFaces.has(activeFace)}
    >
      {faces.map(([letter, arrow]) => (
        <span className={`face-marker face-marker-${letter.toLowerCase()}`} key={letter}>
          <button
            type="button"
            className={hiddenFaces.has(letter) ? 'face-marker-hidden' : undefined}
            aria-label={`Highlight ${faceNames[letter]} face (${letter})`}
            aria-disabled={disabled}
            tabIndex={disabled && activeFace !== letter ? -1 : undefined}
            data-active={activeFace === letter}
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
  ['U', '↓'], ['F', '→'], ['R', '←'], ['L', '↘'], ['B', '↙'], ['D', '↑'],
] as const;
