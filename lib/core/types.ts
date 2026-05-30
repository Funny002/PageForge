export type ToolType = 'select' | 'hand';

export type GridType = 'dot' | 'line' | 'checkerboard' | 'cross' | 'none';

export interface GridConfig {
  type: GridType;
  size: number;
  color: string;
  opacity: number;
}

export interface PageNode {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  props: Record<string, unknown>;
}

export interface PageState {
  canvasWidth: number;
  canvasHeight: number;
  scale: number;
  viewportX: number;
  viewportY: number;
  tool: ToolType;
  showRuler: boolean;
  nodes: PageNode[];
  selectedNodeIds: string[];
  grid: GridConfig;
}
