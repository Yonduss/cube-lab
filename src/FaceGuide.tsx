export function FaceGuide() {
  return (
    <div className="face-guide" role="group" aria-label="Face directions">
      <div className="face-guide-angle" role="group" aria-label="Default angle">
        <FaceMarker face="Up" letter="U" direction="above" />
        <FaceMarker face="Front" letter="F" direction="left" />
        <FaceMarker face="Right" letter="R" direction="right" />
      </div>
      <div className="face-guide-angle face-guide-opposite" role="group" aria-label="Opposite angle">
        <FaceMarker face="Back" letter="B" direction="left" />
        <FaceMarker face="Left" letter="L" direction="right" />
        <FaceMarker face="Down" letter="D" direction="below" />
      </div>
    </div>
  );
}

const arrows = { above: '↓', below: '↑', left: '→', right: '←' };

function FaceMarker({ face, letter, direction }: {
  face: string;
  letter: string;
  direction: keyof typeof arrows;
}) {
  return (
    <span className={`face-marker face-marker-${direction}`} title={`${face} (${letter})`}>
      <abbr aria-label={`${face} (${letter})`}>{letter}</abbr>
      <span aria-hidden="true">{arrows[direction]}</span>
    </span>
  );
}
