export const faces = ['R', 'L', 'U', 'D', 'F', 'B'] as const;
export type CubeFace = (typeof faces)[number];
export type FaceTurn = CubeFace | `${CubeFace}'`;

export const faceNames: Record<CubeFace, string> = {
  R: 'Right', L: 'Left', U: 'Up', D: 'Down', F: 'Front', B: 'Back',
};

export const viewerActions = ['resetView', 'backView', 'rotateFront', 'flipCube'] as const;
export const displayActions = ['animation', 'faceArrows'] as const;
export const puzzleActions = ['scramble', 'resetPuzzle'] as const;
const utilityActions = [...puzzleActions, ...displayActions, ...viewerActions] as const;
export type UtilityAction = (typeof utilityActions)[number];
export type CubeAction = FaceTurn | UtilityAction;
export type Control = { run: () => void; disabled: boolean; checked?: boolean };

export const utilityNames: Record<UtilityAction, string> = {
  scramble: 'Scramble', resetPuzzle: 'Reset', animation: 'Animation', faceArrows: 'Face arrows',
  resetView: 'Reset view', backView: 'Back view', rotateFront: 'Rotate front', flipCube: 'Flip cube',
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
  backView: { key: '8', shift: false },
  rotateFront: { key: '7', shift: false },
  flipCube: { key: '9', shift: false },
  scramble: { key: '1', shift: false },
  resetPuzzle: { key: '2', shift: false },
  animation: { key: '3', shift: false },
  faceArrows: { key: '4', shift: false },
};

const actions = Object.keys(defaultBindings) as CubeAction[];
const legacyStorageKey = 'cube-lab.shortcuts';
const bindingStorageKey = 'cube-lab.shortcuts.v2';

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
  if (isUtilityAction(action)) return utilityNames[action];
  return action.replace("'", '′');
}

export function isUtilityAction(action: CubeAction): action is UtilityAction {
  return utilityActions.some((utilityAction) => utilityAction === action);
}

export function readBindings(): Bindings {
  try {
    const current = localStorage.getItem(bindingStorageKey);
    const raw = current ?? localStorage.getItem(legacyStorageKey);
    if (!raw) return defaultBindings;
    const saved: Partial<Bindings> = JSON.parse(raw);
    const combined = { ...defaultBindings };
    const used = new Set<string>();
    const missing: CubeAction[] = [];
    const shortcutID = ({ key, shift }: Shortcut) => `${shift}:${key}`;
    for (const action of actions) {
      const binding = saved?.[action];
      const oldPuzzleDefault = !current && !binding?.shift
        && ((action === 'scramble' && binding?.key === 'S') || (action === 'resetPuzzle' && binding?.key === 'X'));
      if (binding && typeof binding.key === 'string' && isBindableKey(binding.key)
        && typeof binding.shift === 'boolean' && !oldPuzzleDefault && !used.has(shortcutID(binding))) {
        combined[action] = binding;
        used.add(shortcutID(binding));
      } else {
        missing.push(action);
      }
    }
    // Keep existing custom shortcuts even when a newly added default uses the same key.
    const conflicts: CubeAction[] = [];
    for (const action of missing) {
      const preferred = defaultBindings[action];
      if (used.has(shortcutID(preferred))) conflicts.push(action);
      else used.add(shortcutID(preferred));
    }
    for (const action of conflicts) {
      const key = [...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'].find((key) => !used.has(`false:${key}`));
      if (!key) continue;
      combined[action] = { key, shift: false };
      used.add(shortcutID(combined[action]));
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
