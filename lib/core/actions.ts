import type { ToolType, GridConfig, PageNode } from './types';
import type { Store } from 'common-store';

export function registerActions(store: Store) {
  store.actions.register('canvas.resize', (_store, width: number, height: number) => {
    store.data.set('canvasWidth', width);
    store.data.set('canvasHeight', height);
    return { success: true, width, height };
  });

  store.actions.register('stage.setTool', (_store, tool: ToolType) => {
    store.data.set('tool', tool);
    return { success: true, tool };
  });

  store.actions.register('stage.setScale', (_store, scale: number) => {
    store.data.set('scale', Math.max(0.1, Math.min(5, scale)));
    return { success: true, scale };
  });

  store.actions.register('stage.setOffset', (_store, offsetX: number, offsetY: number) => {
    store.data.set('viewportX', offsetX);
    store.data.set('viewportY', offsetY);
    return { success: true, offsetX, offsetY };
  });

  store.actions.register('stage.pan', (_store, dx: number, dy: number) => {
    const vx = (store.data.get('viewportX') as number) ?? 0;
    const vy = (store.data.get('viewportY') as number) ?? 0;
    store.data.set('viewportX', vx + dx);
    store.data.set('viewportY', vy + dy);
    return { success: true, viewportX: vx + dx, viewportY: vy + dy };
  });

  store.actions.register('stage.addNode', (_store, node: PageNode) => {
    const nodes = (store.data.get('nodes') as PageNode[]) ?? [];
    store.data.set('nodes', [...nodes, node]);
    return { success: true, node };
  });

  store.actions.register('stage.moveNodes', (_store, ids: string[], dx: number, dy: number) => {
    const nodes = ((store.data.get('nodes') as PageNode[]) ?? []).map((n) => {
      if (ids.includes(n.id)) {
        return { ...n, x: n.x + dx, y: n.y + dy };
      }
      return n;
    });
    store.data.set('nodes', nodes);
    return { success: true, ids, dx, dy };
  });

  store.actions.register('stage.resizeNode', (_store, id: string, width: number, height: number) => {
    const nodes = ((store.data.get('nodes') as PageNode[]) ?? []).map((n) => {
      if (n.id === id) {
        return { ...n, width: Math.max(10, width), height: Math.max(10, height) };
      }
      return n;
    });
    store.data.set('nodes', nodes);
    return { success: true, id, width, height };
  });

  store.actions.register('stage.selectNodes', (_store, ids: string[], append: boolean) => {
    if (append) {
      const current = (store.data.get('selectedNodeIds') as string[]) ?? [];
      const merged = current.filter((id) => !ids.includes(id)).concat(ids);
      store.data.set('selectedNodeIds', merged);
    } else {
      store.data.set('selectedNodeIds', ids);
    }
    return { success: true, selectedNodeIds: ids };
  });

  store.actions.register('stage.clearSelection', () => {
    store.data.set('selectedNodeIds', []);
    return { success: true };
  });

  store.actions.register('stage.toggleRuler', (_store, show?: boolean) => {
    const current = store.data.get('showRuler') as boolean;
    const next = show ?? !current;
    store.data.set('showRuler', next);
    return { success: true, showRuler: next };
  });

  store.actions.register('stage.setGrid', (_store, config: GridConfig) => {
    store.data.set('grid', config);
    return { success: true, grid: config };
  });
}
