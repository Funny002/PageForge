import { createNode, findNodeById, findNodePath } from '../utils';
import type { Store } from 'common-store';
import type { PageNode } from './types';

export function registerActions(store: Store) {
  store.actions.register('node.add', (_store, parentId: string, tagName: string) => {
    const page = store.getState<PageNode>('page')!;
    const parentPath = findNodePath(page, parentId);
    if (!parentPath) return { success: false, error: `未找到父节点: ${parentId}` };

    const newNode = createNode(tagName);
    const childrenPath = [...parentPath, 'children'];
    const pathStr = childrenPath.join('.');
    store.data.set(`page.${pathStr}`, [...store.getState<PageNode[]>(`page.${pathStr}`) ?? [], newNode]);
    return { success: true, nodeId: newNode.id };
  });

  store.actions.register('node.remove', (_store, nodeId: string) => {
    const page = store.getState<PageNode>('page')!;
    const nodePath = findNodePath(page, nodeId);
    if (!nodePath) return { success: false, error: `未找到节点: ${nodeId}` };

    const pathStr = `page.${nodePath.join('.')}`;
    store.data.delete(pathStr);
    return { success: true };
  });

  store.actions.register('node.updateAttr', (_store, nodeId: string, key: string, value: string) => {
    const page = store.getState<PageNode>('page')!;
    const nodePath = findNodePath(page, nodeId);
    if (!nodePath) return { success: false, error: `未找到节点: ${nodeId}` };

    store.data.set(`page.${nodePath.join('.')}.attributes.${key}`, value);
    return { success: true };
  });

  store.actions.register('node.removeAttr', (_store, nodeId: string, key: string) => {
    const page = store.getState<PageNode>('page')!;
    const nodePath = findNodePath(page, nodeId);
    if (!nodePath) return { success: false, error: `未找到节点: ${nodeId}` };

    store.data.delete(`page.${nodePath.join('.')}.attributes.${key}`);
    return { success: true };
  });

  store.actions.register('node.updateStyle', (_store, nodeId: string, key: string, value: string) => {
    const page = store.getState<PageNode>('page')!;
    const nodePath = findNodePath(page, nodeId);
    if (!nodePath) return { success: false, error: `未找到节点: ${nodeId}` };

    store.data.set(`page.${nodePath.join('.')}.styles.${key}`, value);
    return { success: true };
  });

  store.actions.register('node.removeStyle', (_store, nodeId: string, key: string) => {
    const page = store.getState<PageNode>('page')!;
    const nodePath = findNodePath(page, nodeId);
    if (!nodePath) return { success: false, error: `未找到节点: ${nodeId}` };

    store.data.delete(`page.${nodePath.join('.')}.styles.${key}`);
    return { success: true };
  });

  store.actions.register('node.addClass', (_store, nodeId: string, className: string) => {
    const page = store.getState<PageNode>('page')!;
    const node = findNodeById(page, nodeId);
    if (!node) return { success: false, error: `未找到节点: ${nodeId}` };

    const nodePath = findNodePath(page, nodeId)!;
    const classes = node.classes.includes(className) ? node.classes : [...node.classes, className];
    store.data.set(`page.${nodePath.join('.')}.classes`, classes);
    return { success: true };
  });

  store.actions.register('node.removeClass', (_store, nodeId: string, className: string) => {
    const page = store.getState<PageNode>('page')!;
    const node = findNodeById(page, nodeId);
    if (!node) return { success: false, error: `未找到节点: ${nodeId}` };

    const nodePath = findNodePath(page, nodeId)!;
    store.data.set(`page.${nodePath.join('.')}.classes`, node.classes.filter((c) => c !== className));
    return { success: true };
  });

  store.actions.register('node.setText', (_store, nodeId: string, text: string) => {
    const page = store.getState<PageNode>('page')!;
    const nodePath = findNodePath(page, nodeId);
    if (!nodePath) return { success: false, error: `未找到节点: ${nodeId}` };

    store.data.set(`page.${nodePath.join('.')}.textContent`, text);
    return { success: true };
  });

  store.actions.register('node.move', (_store, nodeId: string, newParentId: string, position?: number) => {
    const page = store.getState<PageNode>('page')!;
    const oldPath = findNodePath(page, nodeId);
    const newParentPath = findNodePath(page, newParentId);
    if (!oldPath) return { success: false, error: `未找到节点: ${nodeId}` };
    if (!newParentPath) return { success: false, error: `未找到目标父节点: ${newParentId}` };

    const nodeData = store.getState<PageNode>(`page.${oldPath.join('.')}`)!;

    store.data.batch(() => {
      store.data.delete(`page.${oldPath.join('.')}`);

      const newChildrenPath = [...newParentPath, 'children'];
      const childrenPathStr = `page.${newChildrenPath.join('.')}`;
      const siblings = store.getState<PageNode[]>(childrenPathStr) ?? [];
      const targetIndex = position ?? siblings.length;
      siblings.splice(targetIndex, 0, nodeData);
      store.data.set(childrenPathStr, siblings);
    });

    return { success: true };
  });

  store.actions.register('node.select', (_store, nodeId: string | null) => {
    const page = store.getState<PageNode>('page')!;
    if (nodeId !== null && !findNodeById(page, nodeId)) {
      return { success: false, error: `未找到节点: ${nodeId}` };
    }
    store.data.set('selectedNodeId', nodeId);
    return { success: true, nodeId };
  });

  store.actions.register('node.deselect', () => {
    store.data.set('selectedNodeId', null);
    return { success: true };
  });

  store.actions.register('canvas.resize', (_store, width: number, height: number) => {
    store.data.set('canvasWidth', width);
    store.data.set('canvasHeight', height);
    return { success: true, width, height };
  });
}
