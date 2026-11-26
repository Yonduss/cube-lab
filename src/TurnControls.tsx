import { faceNames, faces, formatShortcut, type Bindings, type FaceTurn } from './cubeControls';

export function TurnControls({ bindings, disabled, onTurn }: {
  bindings: Bindings;
  disabled: boolean;
  onTurn: (move: FaceTurn) => void;
}) {
  return (
    <section className="controls" aria-labelledby="controls-title">
      <h2 id="controls-title">Turn controls</h2>
      <div className="turn-grid">
        {faces.map((face) => {
          const inverse = `${face}'` as const;
          return (
            <div className="turn-face" role="group" aria-label={`${faceNames[face]} face`} key={face}>
              <p>{faceNames[face]} face</p>
              <div className="turn-pair">
                <button type="button" disabled={disabled} onClick={() => onTurn(face)} aria-label={`${face}, clockwise`}>
                  <span>{face}</span><kbd>{formatShortcut(bindings[face])}</kbd>
                </button>
                <button type="button" disabled={disabled} onClick={() => onTurn(inverse)} aria-label={`${face} prime, counterclockwise`}>
                  <span>{face}′</span><kbd>{formatShortcut(bindings[inverse])}</kbd>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
