import type { Store } from 'common-store';

export function registerActions(store: Store) {
  store.actions.register('canvas.resize', (_store, width: number, height: number) => {
    store.data.set('canvasWidth', width);
    store.data.set('canvasHeight', height);
    return { success: true, width, height };
  });
}
