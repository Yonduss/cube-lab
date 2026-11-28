import { useEffect, useState, type CSSProperties } from 'react';

export type SolveAttempt =
  | { phase: 'idle' | 'ready' }
  | { phase: 'running'; startedAt: number; turns: number }
  | { phase: 'finished'; elapsed: number; turns: number };

export function formatTurns(turns: number) {
  return `${turns} ${turns === 1 ? 'turn' : 'turns'}`;
}

function formatTime(elapsed: number) {
  const total = Math.floor(elapsed / 10);
  return [Math.floor(total / 360000), Math.floor(total / 6000) % 60, Math.floor(total / 100) % 60]
    .map((value) => String(value).padStart(2, '0')).join(':')
    + '.' + String(total % 100).padStart(2, '0');
}

export function SolveTimer({ attempt }: { attempt: SolveAttempt }) {
  const [sample, setSample] = useState<{ start: number; elapsed: number }>();
  const startedAt = attempt.phase === 'running' ? attempt.startedAt : null;

  useEffect(() => {
    if (startedAt === null) return;
    const start = startedAt;
    let frame: number;
    function update() {
      setSample({ start, elapsed: performance.now() - start });
      frame = requestAnimationFrame(update);
    }
    update();
    return () => cancelAnimationFrame(frame);
  }, [startedAt]);

  const elapsed = attempt.phase === 'finished' ? attempt.elapsed : sample?.start === startedAt ? sample.elapsed : 0;
  const label = attempt.phase === 'ready' ? 'First turn starts the timer'
    : attempt.phase === 'finished' ? 'Congratulations!'
    : attempt.phase === 'running' ? 'Solving' : 'Scramble to start a timed solve';
  const time = formatTime(elapsed);

  return (
    <div className="solve-timer" data-phase={attempt.phase}>
      <span className="solve-time" role="timer" aria-label="Solve time">{time}</span>
      <p className="solve-timer-label" aria-live="polite">
        {label}{attempt.phase === 'finished' && (
          <> <span className="sr-only">Final time {time}.</span> Solved in {formatTurns(attempt.turns)}.</>
        )}
      </p>
    </div>
  );
}

export function SolveConfetti() {
  return (
    <div className="solve-confetti" aria-hidden="true">
      {Array.from({ length: 24 }, (_, index) => (
        <span key={index} style={{ '--piece': index } as CSSProperties} />
      ))}
    </div>
  );
}
