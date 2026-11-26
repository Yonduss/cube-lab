import { useEffect, useEffectEvent, useState } from 'react';
import {
  actionLabel, cameraActions, cameraNames, defaultBindings, faceNames, faces, findAction,
  formatShortcut, shortcutFromEvent, type Bindings, type CubeAction, type FaceTurn,
} from './cubeControls';

export function TurnControls({ bindings, disabled, settingsOpen, onSettings, onBindings, onTurn }: {
  bindings: Bindings;
  disabled: boolean;
  settingsOpen: boolean;
  onSettings: () => void;
  onBindings: (bindings: Bindings) => void;
  onTurn: (move: FaceTurn) => void;
}) {
  const [editingAction, setEditingAction] = useState<CubeAction | null>(null);
  const [message, setMessage] = useState('');

  const captureShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (!editingAction || !settingsOpen || disabled || event.isComposing || event.repeat) return;
    if (event.key === 'Tab' || event.key === 'Escape') {
      setEditingAction(null);
      setMessage('');
      if (event.key === 'Escape') event.preventDefault();
      return;
    }
    if (event.key === 'Shift') return;
    if (event.ctrlKey || event.altKey || event.metaKey) {
      setMessage('Use a key alone or together with Shift.');
      return;
    }

    event.preventDefault();
    const shortcut = shortcutFromEvent(event);
    if (!shortcut) {
      setMessage('Choose a letter, number, symbol, or arrow key.');
      return;
    }
    const inUse = findAction(bindings, shortcut);
    if (inUse && inUse !== editingAction) {
      setMessage(`${formatShortcut(shortcut)} is already assigned to ${actionLabel(inUse)}.`);
      return;
    }

    onBindings({ ...bindings, [editingAction]: shortcut });
    setMessage(`${actionLabel(editingAction)} is now ${formatShortcut(shortcut)}.`);
    setEditingAction(null);
  });

  useEffect(() => {
    if (!settingsOpen || !editingAction) return;
    const listener = (event: KeyboardEvent) => captureShortcut(event);
    window.addEventListener('keydown', listener, true);
    return () => window.removeEventListener('keydown', listener, true);
  }, [editingAction, settingsOpen]);

  function edit(action: CubeAction) {
    setEditingAction(action);
    setMessage('');
  }

  function changeSettings() {
    setEditingAction(null);
    setMessage('');
    onSettings();
  }

  function keycap(action: CubeAction) {
    return <kbd>{editingAction === action ? 'Press a key' : formatShortcut(bindings[action])}</kbd>;
  }

  return (
    <section className="controls" aria-labelledby="controls-title">
      <div className="control-header">
        <h2 id="controls-title">Turn controls</h2>
        <button type="button" disabled={disabled} aria-expanded={settingsOpen} onClick={changeSettings}>
          <span aria-hidden="true">⚙ </span>{settingsOpen ? 'Done' : 'Keyboard settings'}
        </button>
      </div>
      {settingsOpen && (
        <div className="binding-settings">
          <p>Choose a keycap, then press the new shortcut. Press Esc to cancel.</p>
          <p className="binding-message" aria-live="polite">{message}</p>
          <button type="button" disabled={disabled} onClick={() => {
            onBindings(defaultBindings);
            setEditingAction(null);
            setMessage('Default shortcuts restored.');
          }}>Restore defaults</button>
        </div>
      )}
      <div className="turn-grid">
        {faces.map((face) => {
          const inverse = `${face}'` as const;
          return (
            <div className="turn-face" role="group" aria-label={`${faceNames[face]} face`} key={face}>
              <p>{faceNames[face]} face</p>
              <div className="turn-pair">
                <button type="button" disabled={disabled} onClick={() => settingsOpen ? edit(face) : onTurn(face)} aria-label={settingsOpen ? `Edit ${face} shortcut` : `${face}, clockwise`}>
                  <span>{face}</span>{keycap(face)}
                </button>
                <button type="button" disabled={disabled} onClick={() => settingsOpen ? edit(inverse) : onTurn(inverse)} aria-label={settingsOpen ? `Edit ${face} prime shortcut` : `${face} prime, counterclockwise`}>
                  <span>{face}′</span>{keycap(inverse)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {settingsOpen && (
        <div className="turn-pair camera-bindings" role="group" aria-label="Camera shortcuts">
          {cameraActions.map((action) => (
            <button type="button" key={action} disabled={disabled} onClick={() => edit(action)} aria-label={`Edit ${cameraNames[action]} shortcut`}>
              <span>{cameraNames[action]}</span>{keycap(action)}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
