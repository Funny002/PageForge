import type { PageNode } from '../core';

export function createNode(tagName: string): PageNode {
  return {
    id: generateId(),
    tagName,
    attributes: {},
    styles: {},
    classes: [],
    children: [],
  };
}

export function findNodeById(page: PageNode, id: string): PageNode | null {
  if (page.id === id) return page;
  for (const child of page.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export function findNodePath(node: PageNode, targetId: string, currentPath: string[] = []): string[] | null {
  if (node.id === targetId) return currentPath;
  for (let i = 0; i < node.children.length; i++) {
    const result = findNodePath(node.children[i]!, targetId, [...currentPath, 'children', String(i)]);
    if (result) return result;
  }
  return null;
}

let idCounter = 0;

export function generateId(): string {
  return `node_${Date.now().toString(36)}_${(idCounter++).toString(36)}`;
}
