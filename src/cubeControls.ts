export const faces = ['R', 'L', 'U', 'D', 'F', 'B'] as const;
export type CubeFace = (typeof faces)[number];
export type FaceTurn = CubeFace | `${CubeFace}'`;

export const faceNames: Record<CubeFace, string> = {
  R: 'Right', L: 'Left', U: 'Up', D: 'Down', F: 'Front', B: 'Back',
};

export const cameraActions = ['resetView', 'viewBottom', 'backView'] as const;
export type CameraAction = (typeof cameraActions)[number];
export type CubeAction = FaceTurn | CameraAction;

export const cameraNames: Record<CameraAction, string> = {
  resetView: 'Reset view', viewBottom: 'View bottom', backView: 'Back view',
};

export type Shortcut = { key: string; shift: boolean };
export type Bindings = Record<CubeAction, Shortcut>;

export const defaultBindings: Bindings = {
  R: { key: 'R', shift: false }, "R'": { key: 'R', shift: true },
  L: { key: 'L', shift: false }, "L'": { key: 'L', shift: true },
  U: { key: 'U', shift: false }, "U'": { key: 'U', shift: true },
  D: { key: 'D', shift: false }, "D'": { key: 'D', shift: true },
  F: { key: 'F', shift: false }, "F'": { key: 'F', shift: true },
  B: { key: 'B', shift: false }, "B'": { key: 'B', shift: true },
  resetView: { key: '0', shift: false },
  viewBottom: { key: '9', shift: false },
  backView: { key: '8', shift: false },
};

export function shortcutFromEvent(event: KeyboardEvent): Shortcut | null {
  if (event.ctrlKey || event.altKey || event.metaKey || event.isComposing || event.repeat) return null;

  const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
  if (key === ' ' || (key.length !== 1 && !key.startsWith('Arrow'))) return null;

  return { key, shift: event.shiftKey };
}

export function findAction(bindings: Bindings, shortcut: Shortcut) {
  const actions = Object.keys(defaultBindings) as CubeAction[];
  return actions.find((action) => {
    const binding = bindings[action];
    return binding.key === shortcut.key && binding.shift === shortcut.shift;
  });
}

export function formatShortcut({ key, shift }: Shortcut) {
  const label = key.startsWith('Arrow') ? key.replace('Arrow', 'Arrow ') : key;
  return shift ? `Shift + ${label}` : label;
}
