import { useEffect, useEffectEvent, useState } from 'react';
import {
  actionLabel, cameraActions, cameraNames, defaultBindings, faceNames, faces, findAction,
  formatShortcut, shortcutFromEvent, type Bindings, type CameraAction, type CubeAction,
} from './cubeControls';
import type { CubeMove } from './cubePosition';

export function TurnControls({ bindings, disabled, settingsOpen, onSettings, onBindings, onTurn, onCamera, backView }: {
  bindings: Bindings;
  disabled: boolean;
  settingsOpen: boolean;
  onSettings: () => void;
  onBindings: (bindings: Bindings) => void;
  onTurn: (move: CubeMove) => void;
  onCamera: (action: CameraAction) => void;
  backView: boolean;
}) {
  const [draft, setDraft] = useState<Bindings | null>(null);
  const [editingAction, setEditingAction] = useState<CubeAction | null>(null);
  const [message, setMessage] = useState('');
  const shownBindings = draft ?? bindings;

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
    const inUse = findAction(shownBindings, shortcut);
    if (inUse && inUse !== editingAction) {
      setMessage(`${formatShortcut(shortcut)} is already assigned to ${actionLabel(inUse)}.`);
      return;
    }

    setDraft({ ...shownBindings, [editingAction]: shortcut });
    setMessage(`${actionLabel(editingAction)} is set to ${formatShortcut(shortcut)}. Save to apply.`);
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

  function closeSettings() {
    setDraft(null);
    setEditingAction(null);
    setMessage('');
    onSettings();
  }

  function keycap(action: CubeAction) {
    return <kbd data-capturing={editingAction === action}>{formatShortcut(shownBindings[action])}</kbd>;
  }

  return (
    <section className="controls" aria-labelledby="controls-title">
      <div className="control-header">
        <h2 id="controls-title">Turn controls</h2>
        {settingsOpen ? (
          <div className="buttons" role="group" aria-label="Keyboard settings actions">
            <button type="button" disabled={disabled} onClick={() => {
              setDraft(defaultBindings);
              setEditingAction(null);
              setMessage('Default shortcuts loaded. Save to apply.');
            }}>Restore defaults</button>
            <button type="button" disabled={disabled} onClick={closeSettings}>Cancel</button>
            <button type="button" disabled={disabled} onClick={() => {
              onBindings(shownBindings);
              closeSettings();
            }}>Save</button>
          </div>
        ) : (
          <button type="button" disabled={disabled} onClick={() => { setDraft(bindings); onSettings(); }}>
            <span aria-hidden="true">⚙ </span>Keyboard settings
          </button>
        )}
      </div>
      {settingsOpen && (
        <div className="binding-settings">
          <p>Choose a keycap, then press the new shortcut. Press Esc to cancel.</p>
          <p className="binding-message" aria-live="polite">
            {message || (editingAction ? `Press a key for ${actionLabel(editingAction)}.` : '')}
          </p>
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
      <div className="camera-bindings">
        <h3>Camera shortcuts</h3>
        <div className="turn-pair" role="group" aria-label="Camera shortcuts">
          {cameraActions.map((action) => (
            <button
              type="button"
              key={action}
              disabled={disabled}
              onClick={() => settingsOpen ? edit(action) : onCamera(action)}
              aria-label={settingsOpen ? `Edit ${cameraNames[action]} shortcut` : `${cameraNames[action]} shortcut`}
              aria-pressed={!settingsOpen && action === 'backView' ? backView : undefined}
            >
              <span>{cameraNames[action]}</span>{keycap(action)}
            </button>
          ))}
        </div>
      </div>
      {!settingsOpen && (
        <div className="camera-bindings">
          <h3>Cube orientation</h3>
          <div className="buttons" role="group" aria-label="Cube orientation">
            <button type="button" disabled={disabled} onClick={() => onTurn('y')} title="Rotate the cube around its top and bottom">Rotate front</button>
            <button type="button" disabled={disabled} onClick={() => onTurn('x2')} title="Turn the cube upside down">Flip cube</button>
          </div>
        </div>
      )}
    </section>
  );
}
