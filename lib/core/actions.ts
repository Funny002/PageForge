import type { Store } from 'common-store';
import type { ToolType } from './types';

export function registerActions(store: Store) {
  store.actions.register('canvas.resize', (_store, width: number, height: number) => {
    store.data.set('canvasWidth', width);
    store.data.set('canvasHeight', height);
    return { success: true, width, height };
  });

  store.actions.register('scale.set', (_store, scale: number) => {
    const clamped = Math.max(0.1, Math.min(5.0, scale));
    store.data.set('scale', clamped);
    return { success: true, scale: clamped };
  });

  store.actions.register('tool.set', (_store, tool: ToolType) => {
    store.data.set('activeTool', tool);
    return { success: true, tool };
  });
}
