import type { Store } from 'common-store';

export function registerActions(store: Store): void {
  store.actions.register('canvas.resize', (_, width, height) => {
    store.data.set('canvas.width', width);
    store.data.set('canvas.height', height);
    return { success: true, width, height };
  });

  store.actions.register('menu.width', (_, width) => {
    store.data.set('menu.width', width);
    return { success: true, width };
  });

  store.actions.register('menu.isTxt', (_, status) => {
    store.data.set('menu.isTxt', status);
    return { success: true, status };
  });
}
