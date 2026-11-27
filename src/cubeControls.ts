export const faces = ['R', 'L', 'U', 'D', 'F', 'B'] as const;
export type CubeFace = (typeof faces)[number];
export type FaceTurn = CubeFace | `${CubeFace}'`;

export const faceNames: Record<CubeFace, string> = {
  R: 'Right', L: 'Left', U: 'Up', D: 'Down', F: 'Front', B: 'Back',
};

export const viewerActions = ['resetView', 'backView', 'rotateFront', 'flipCube'] as const;
export type ViewerAction = (typeof viewerActions)[number];
export const puzzleActions = ['scramble', 'resetPuzzle'] as const;
export type PuzzleAction = (typeof puzzleActions)[number];
export type CubeAction = FaceTurn | ViewerAction | PuzzleAction;

export const viewerNames: Record<ViewerAction, string> = {
  resetView: 'Reset view', backView: 'Back view', rotateFront: 'Rotate front', flipCube: 'Flip cube',
};

export const puzzleNames: Record<PuzzleAction, string> = { scramble: 'Scramble', resetPuzzle: 'Reset' };

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
  backView: { key: '8', shift: false },
  rotateFront: { key: '7', shift: false },
  flipCube: { key: '9', shift: false },
  scramble: { key: 'S', shift: false },
  resetPuzzle: { key: 'X', shift: false },
};

const actions = Object.keys(defaultBindings) as CubeAction[];
const bindingStorageKey = 'cube-lab.shortcuts';

function isBindableKey(key: string) {
  return (key.length === 1 && key !== ' ') || /^Arrow(Up|Down|Left|Right)$/.test(key);
}

export function shortcutFromEvent(event: KeyboardEvent): Shortcut | null {
  if (event.ctrlKey || event.altKey || event.metaKey || event.isComposing || event.repeat) return null;

  const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
  if (!isBindableKey(key)) return null;

  return { key, shift: event.shiftKey };
}

export function findAction(bindings: Bindings, shortcut: Shortcut) {
  return actions.find((action) => {
    const binding = bindings[action];
    return binding.key === shortcut.key && binding.shift === shortcut.shift;
  });
}

export function actionLabel(action: CubeAction) {
  if (isViewerAction(action)) return viewerNames[action];
  if (isPuzzleAction(action)) return puzzleNames[action];
  return action.replace("'", '′');
}

export function isPuzzleAction(action: CubeAction): action is PuzzleAction {
  return action === 'scramble' || action === 'resetPuzzle';
}

export function isViewerAction(action: CubeAction): action is ViewerAction {
  return viewerActions.some((viewerAction) => viewerAction === action);
}

export function readBindings(): Bindings {
  try {
    const raw = localStorage.getItem(bindingStorageKey);
    if (!raw) return defaultBindings;
    const saved: Partial<Bindings> = JSON.parse(raw);
    const combined = { ...defaultBindings };
    const used = new Set<string>();
    const missing: CubeAction[] = [];
    const shortcutID = ({ key, shift }: Shortcut) => `${shift}:${key}`;
    for (const action of actions) {
      const binding = saved?.[action];
      if (binding && typeof binding.key === 'string' && isBindableKey(binding.key)
        && typeof binding.shift === 'boolean' && !used.has(shortcutID(binding))) {
        combined[action] = binding;
        used.add(shortcutID(binding));
      } else {
        missing.push(action);
      }
    }
    // Keep existing custom shortcuts even when a newly added default uses the same key.
    for (const action of missing) {
      const preferred = defaultBindings[action];
      const replacement = [...'7654321098ABCDEFGHIJKLMNOPQRSTUVWXYZ'].find((key) => !used.has(`false:${key}`));
      const binding = used.has(shortcutID(preferred)) && replacement ? { key: replacement, shift: false } : preferred;
      combined[action] = binding;
      used.add(shortcutID(binding));
    }
    return combined;
  } catch {
    // Keep the default controls if storage is blocked or invalid.
  }
  return defaultBindings;
}

export function saveBindings(bindings: Bindings) {
  try {
    localStorage.setItem(bindingStorageKey, JSON.stringify(bindings));
  } catch {
    // The current session can still use the new shortcuts.
  }
}

export function formatShortcut({ key, shift }: Shortcut) {
  const label = key.startsWith('Arrow') ? key.replace('Arrow', 'Arrow ') : key;
  return shift ? `Shift + ${label}` : label;
}
