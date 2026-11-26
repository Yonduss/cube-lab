import { cube3x3x3 } from 'cubing/puzzles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

const root = createRoot(document.getElementById('root')!);

root.render(<p className="startup-message" role="status">Loading cube…</p>);

void cube3x3x3.kpuzzle().then(
  (puzzle) => {
    root.render(
      <StrictMode>
        <App solvedPattern={puzzle.defaultPattern()} />
      </StrictMode>,
    );
  },
  (error: unknown) => {
    console.error('Could not load the cube.', error);
    root.render(<p className="startup-message" role="alert">Could not load the cube. Reload to try again.</p>);
  },
);
