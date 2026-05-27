export type ToolType = 'select' | 'hand' | 'move';

export interface PageNode {
}

export interface PageState {
  // pages: PageNode[];
  selectedNodeId: string[] | null;
  canvasWidth: number;
  canvasHeight: number;
}
