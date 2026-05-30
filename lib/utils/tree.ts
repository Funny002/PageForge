import type { PageNode } from '../core/types';

export function findNodeById(nodes: PageNode[], id: string): PageNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function findParentNode(nodes: PageNode[], childId: string): PageNode | null {
  for (const node of nodes) {
    if (node.children.some((c) => c.id === childId)) return node;
    if (node.children.length > 0) {
      const found = findParentNode(node.children, childId);
      if (found) return found;
    }
  }
  return null;
}

export function flattenNodes(nodes: PageNode[]): PageNode[] {
  const result: PageNode[] = [];

  function walk(list: PageNode[]) {
    for (const node of list) {
      result.push(node);
      if (node.children.length > 0) walk(node.children);
    }
  }

  walk(nodes);
  return result;
}

export function removeNode(nodes: PageNode[], id: string): PageNode[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => ({
      ...n,
      children: removeNode(n.children, id),
    }));
}

export function deepCloneNodes(nodes: PageNode[]): PageNode[] {
  const idMap = new Map<string, string>()

  function cloneOne(list: PageNode[]): PageNode[] {
    return list.map((n) => {
      const newId = crypto.randomUUID()
      idMap.set(n.id, newId)
      return {
        ...n,
        id: newId,
        props: n.props ? JSON.parse(JSON.stringify(n.props)) : {},
        style: n.style ? JSON.parse(JSON.stringify(n.style)) : {},
        children: cloneOne(n.children),
      }
    })
  }

  function fixParent(list: PageNode[]): PageNode[] {
    return list.map((n) => ({
      ...n,
      parentId: n.parentId ? (idMap.get(n.parentId) ?? null) : null,
      children: fixParent(n.children),
    }))
  }

  const cloned = cloneOne(nodes)
  return fixParent(cloned)
}

export function generateNodeName(type: string, existingNames: string[]): string {
  let index = 1;
  let name = `${type} ${index}`;
  while (existingNames.includes(name)) {
    index++;
    name = `${type} ${index}`;
  }
  return name;
}

export function findNodePath(nodes: PageNode[], id: string): number[] | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) return [i];
    if (nodes[i].children.length > 0) {
      const childPath = findNodePath(nodes[i].children, id);
      if (childPath) return [i, ...childPath];
    }
  }
  return null;
}

export function getNodeAtPath(nodes: PageNode[], path: number[]): PageNode | null {
  let current: PageNode[] = nodes;
  let target: PageNode | null = null;
  for (const idx of path) {
    target = current[idx];
    if (!target) return null;
    current = target.children;
  }
  return target;
}

export function insertNode(nodes: PageNode[], node: PageNode, parentId: string | null, index?: number): PageNode[] {
  const clone = [...nodes];
  if (!parentId) {
    const pos = index ?? clone.length;
    clone.splice(pos, 0, node);
    return clone;
  }
  return clone.map((n) => {
    if (n.id === parentId) {
      const newChildren = [...n.children];
      const pos = index ?? newChildren.length;
      newChildren.splice(pos, 0, { ...node, parentId });
      return { ...n, children: newChildren };
    }
    if (n.children.length > 0) {
      return { ...n, children: insertNode(n.children, node, parentId, index) };
    }
    return n;
  });
}

export function moveNodeInArray(nodes: PageNode[], nodeId: string, direction: 'up' | 'down' | 'front' | 'back'): PageNode[] {
  const idx = nodes.findIndex((n) => n.id === nodeId);
  if (idx === -1) {
    return nodes.map((n) => {
      if (n.children.length > 0) {
        return { ...n, children: moveNodeInArray(n.children, nodeId, direction) };
      }
      return n;
    });
  }
  const clone = [...nodes];
  const [item] = clone.splice(idx, 1);
  switch (direction) {
    case 'up':
      clone.splice(Math.max(0, idx - 1), 0, item);
      break;
    case 'down':
      clone.splice(Math.min(clone.length, idx + 1), 0, item);
      break;
    case 'front':
      clone.push(item);
      break;
    case 'back':
      clone.unshift(item);
      break;
  }
  return clone;
}

export function getMaxZIndex(nodes: PageNode[]): number {
  let max = 0;

  function walk(list: PageNode[]) {
    for (const node of list) {
      const zIndex = (node.props.zIndex as number) ?? 0;
      if (zIndex > max) max = zIndex;
      if (node.children.length > 0) walk(node.children);
    }
  }

  walk(nodes);
  return max;
}
