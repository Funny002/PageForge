import type { Store } from 'common-store';

export function registerActions(store: Store): void {
  store.actions.register('canvas.resize', (_, width, height) => {
    store.data.set('canvas.width', width);
    store.data.set('canvas.height', height);
    return { success: true, width, height };
  });
}
