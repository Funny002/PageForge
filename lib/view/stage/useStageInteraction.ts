import { shallowRef } from 'vue';
import { usePageStore, useStoreState } from '../../core';
import type { ToolType, PageNode } from '../../core';

type DragMode = 'idle' | 'move' | 'resize' | 'marquee' | 'pan';

interface MarqueeRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useStageInteraction() {
  const store = usePageStore();
  const canvasWidth = useStoreState<number>('canvasWidth', 1920);
  const tool = useStoreState<ToolType>('tool', 'select');

  const surfaceRef = shallowRef<HTMLElement | null>(null);
  const marquee = shallowRef<MarqueeRect | null>(null);

  function setSurfaceRef(el: unknown) {
    surfaceRef.value = el as HTMLElement | null;
  }

  let dragMode: DragMode = 'idle';
  let dragSurfaceX = 0;
  let dragSurfaceY = 0;
  let dragScreenX = 0;
  let dragScreenY = 0;
  let dragNodeIds: string[] = [];
  let dragResizeDir = '';
  let dragStartBounds: Record<string, Bounds> = {};

  function getNodes(): PageNode[] {
    return (store.data.get('nodes') as PageNode[]) ?? [];
  }

  function getSelectedIds(): string[] {
    return (store.data.get('selectedNodeIds') as string[]) ?? [];
  }

  function findNodeAt(sx: number, sy: number): PageNode | null {
    const nodes = getNodes();
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const nx = n.x ?? 0;
      const ny = n.y ?? 0;
      const nw = n.width ?? 100;
      const nh = n.height ?? 80;
      if (sx >= nx && sx <= nx + nw && sy >= ny && sy <= ny + nh) {
        return n;
      }
    }
    return null;
  }

  function findNodesInRect(rx: number, ry: number, rw: number, rh: number): string[] {
    const x1 = Math.min(rx, rx + rw);
    const y1 = Math.min(ry, ry + rh);
    const x2 = Math.max(rx, rx + rw);
    const y2 = Math.max(ry, ry + rh);
    return getNodes()
      .filter((n) => {
        const nx = n.x;
        const ny = n.y;
        const nw = n.width;
        const nh = n.height;
        return nx + nw >= x1 && nx <= x2 && ny + nh >= y1 && ny <= y2;
      })
      .map((n) => n.id);
  }

  function toSurface(e: PointerEvent): [number, number] {
    const el = surfaceRef.value;
    if (!el) return [0, 0];
    const rect = el.getBoundingClientRect();
    const s = rect.width / canvasWidth.value;
    return [(e.clientX - rect.left) / s, (e.clientY - rect.top) / s];
  }

  function isShiftKey(e: PointerEvent): boolean {
    return e.shiftKey;
  }

  function onSurfacePointerDown(e: PointerEvent) {
    if (dragMode !== 'idle') return;

    const [sx, sy] = toSurface(e);
    dragScreenX = e.clientX;
    dragScreenY = e.clientY;
    dragSurfaceX = sx;
    dragSurfaceY = sy;

    if (tool.value === 'hand') {
      dragMode = 'pan';
      surfaceRef.value?.setPointerCapture(e.pointerId);
      return;
    }

    const node = findNodeAt(sx, sy);
    const selectedIds = getSelectedIds();

    if (node) {
      const isSelected = selectedIds.includes(node.id);
      if (isShiftKey(e)) {
        const ids = isSelected
          ? selectedIds.filter((id) => id !== node.id)
          : [...selectedIds, node.id];
        store.actions.dispatch('stage.selectNodes', ids, false);
      } else if (!isSelected) {
        store.actions.dispatch('stage.selectNodes', [node.id], false);
      }

      dragMode = 'move';
      dragNodeIds = isShiftKey(e) || isSelected
        ? [...new Set([...selectedIds, node.id])]
        : [node.id];
      dragStartBounds = {};
      for (const n of getNodes()) {
        if (dragNodeIds.includes(n.id)) {
          dragStartBounds[n.id] = {
            x: n.x ?? 0,
            y: n.y ?? 0,
            width: n.width ?? 100,
            height: n.height ?? 80,
          };
        }
      }
      surfaceRef.value?.setPointerCapture(e.pointerId);
      return;
    }

    store.actions.dispatch('stage.clearSelection');
    dragMode = 'marquee';
    marquee.value = { x: sx, y: sy, w: 0, h: 0 };
    surfaceRef.value?.setPointerCapture(e.pointerId);
  }

  function onSurfacePointerMove(e: PointerEvent) {
    if (dragMode === 'idle') return;

    const [sx, sy] = toSurface(e);
    const dx = sx - dragSurfaceX;
    const dy = sy - dragSurfaceY;

    if (dragMode === 'pan') {
      store.actions.dispatch('stage.pan', e.clientX - dragScreenX, e.clientY - dragScreenY);
      dragScreenX = e.clientX;
      dragScreenY = e.clientY;
      return;
    }

    if (dragMode === 'move') {
      setNodePositionsByOffset(dx, dy);
      return;
    }

    if (dragMode === 'resize') {
      resizeNodeByOffset(dragResizeDir, sx, sy, dragStartBounds);
      return;
    }

    if (dragMode === 'marquee') {
      marquee.value = {
        x: dragSurfaceX,
        y: dragSurfaceY,
        w: dx,
        h: dy,
      };
    }
  }

  function onHandlePointerDown(e: PointerEvent, nodeId: string, dir: string) {
    e.stopPropagation();
    const [sx, sy] = toSurface(e);
    dragMode = 'resize';
    dragSurfaceX = sx;
    dragSurfaceY = sy;
    dragResizeDir = dir;
    dragNodeIds = [nodeId];

    const nodes = getNodes();
    dragStartBounds = {};
    const target = nodes.find((n) => n.id === nodeId);
    if (target) {
      dragStartBounds[nodeId] = {
        x: target.x,
        y: target.y,
        width: target.width,
        height: target.height,
      };
    }

    surfaceRef.value?.setPointerCapture(e.pointerId);
  }

  function getMoveOffset(): [number, number] {
    for (const [id, b] of Object.entries(dragStartBounds)) {
      const node = getNodes().find((n) => n.id === id);
      if (node) {
        return [node.x - b.x, node.y - b.y];
      }
    }
    return [0, 0];
  }

  function setNodePositionsByOffset(dx: number, dy: number) {
    const nodes = getNodes().map((n) => {
      if (!dragNodeIds.includes(n.id)) return n;
      const start = dragStartBounds[n.id];
      if (!start) return n;
      return { ...n, x: start.x + dx, y: start.y + dy };
    });
    store.data.set('nodes', nodes);
  }

  function resizeNodeByOffset(dir: string, sx: number, sy: number, startBounds: Record<string, Bounds>) {
    const nodeId = dragNodeIds[0];
    if (!nodeId) return;
    const start = startBounds[nodeId];
    if (!start) return;

    let { x, y, width, height } = start;
    const dx = sx - dragSurfaceX;
    const dy = sy - dragSurfaceY;

    if (dir.includes('e')) width = start.width + dx;
    if (dir.includes('w')) { width = start.width - dx; x = start.x + dx; }
    if (dir.includes('s')) height = start.height + dy;
    if (dir.includes('n')) { height = start.height - dy; y = start.y + dy; }

    const w = Math.max(10, width);
    const h = Math.max(10, height);

    const nodes = getNodes().map((n) => {
      if (n.id !== nodeId) return n;
      return { ...n, x, y, width: w, height: h };
    });
    store.data.set('nodes', nodes);
  }

  function onSurfacePointerUp(_e: PointerEvent) {
    if (dragMode === 'idle') return;

    if (dragMode === 'move') {
      const dx = getMoveOffset()[0];
      const dy = getMoveOffset()[1];
      store.actions.dispatch('stage.moveNodes', dragNodeIds, dx, dy);
      dragNodeIds = [];
      dragStartBounds = {};
    }

    if (dragMode === 'resize') {
      const nodeId = dragNodeIds[0];
      if (nodeId) {
        const start = dragStartBounds[nodeId];
        const currentNode = getNodes().find((n) => n.id === nodeId);
        if (start && currentNode) {
          store.actions.dispatch('stage.resizeNode', nodeId, currentNode.width, currentNode.height);
        }
      }
      dragNodeIds = [];
      dragStartBounds = {};
    }

    if (dragMode === 'marquee') {
      const m = marquee.value;
      if (m && (Math.abs(m.w) > 3 || Math.abs(m.h) > 3)) {
        const ids = findNodesInRect(m.x, m.y, m.w, m.h);
        store.actions.dispatch('stage.selectNodes', ids, false);
      }
      marquee.value = null;
    }

    dragMode = 'idle';
  }

  return {
    surfaceRef,
    setSurfaceRef,
    marquee,
    onSurfacePointerDown,
    onSurfacePointerMove,
    onSurfacePointerUp,
    onHandlePointerDown,
  };
}
