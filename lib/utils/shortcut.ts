export interface ShortcutDef {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: string;
}

function normalizeKey(event: KeyboardEvent): string {
  const key = event.key;
  const map: Record<string, string> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    '[': '[',
    ']': ']',
  };
  return map[key] ?? key.toLowerCase();
}

export function matchShortcut(event: KeyboardEvent, def: ShortcutDef): boolean {
  const hasCtrl = def.ctrl ?? false;
  const hasShift = def.shift ?? false;
  const hasAlt = def.alt ?? false;
  if (event.ctrlKey !== hasCtrl) return false;
  if (event.shiftKey !== hasShift) return false;
  if (event.altKey !== hasAlt) return false;
  return normalizeKey(event) === def.key.toLowerCase();
}

export function createShortcutHandler(shortcuts: ShortcutDef[], dispatch: (action: string) => void): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    for (const def of shortcuts) {
      if (matchShortcut(event, def)) {
        event.preventDefault();
        event.stopPropagation();
        dispatch(def.action);
        return;
      }
    }
  };
}
