import { useLayoutEffect, useState } from 'react';

const storageKey = 'cube-lab.theme';
const themes = ['system', 'light', 'dark'] as const;
type Theme = (typeof themes)[number];

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Theme changes still work for the current page when storage is unavailable.
  }
  return 'system';
}

export function ThemePicker() {
  const [theme, setTheme] = useState(readTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function selectTheme(next: Theme) {
    setTheme(next);
    try {
      if (next === 'system') localStorage.removeItem(storageKey);
      else localStorage.setItem(storageKey, next);
    } catch {
      // The active theme can still be changed without saving it.
    }
  }

  return (
    <div className="theme-picker" role="group" aria-label="Color theme">
      {themes.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={theme === option}
          onClick={() => selectTheme(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
