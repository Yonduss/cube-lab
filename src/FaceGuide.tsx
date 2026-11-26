export function FaceGuide() {
  return (
    <div className="face-guide" role="group" aria-label="Face directions">
      {faces.map(({ name, letter, arrow, hidden }) => (
        <span className={`face-marker face-marker-${letter.toLowerCase()}`} key={letter}>
          <abbr
            className={hidden ? 'face-marker-hidden' : undefined}
            aria-label={`${name} (${letter})${hidden ? ', out of sight' : ''}`}
          >
            {letter}
          </abbr>
          <span aria-hidden="true">{arrow}</span>
        </span>
      ))}
    </div>
  );
}

const faces = [
  { name: 'Up', letter: 'U', arrow: '↓' },
  { name: 'Front', letter: 'F', arrow: '→' },
  { name: 'Right', letter: 'R', arrow: '←' },
  { name: 'Left', letter: 'L', arrow: '↘', hidden: true },
  { name: 'Back', letter: 'B', arrow: '↙', hidden: true },
  { name: 'Down', letter: 'D', arrow: '↑', hidden: true },
];
