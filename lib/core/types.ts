export interface PageNode {
  id: string;
  tagName: string;
  attributes: Record<string, string>;
  styles: Record<string, string>;
  classes: string[];
  children: PageNode[];
  textContent?: string;
}

export interface PageState {
  page: PageNode;
  selectedNodeId: string | null;
  canvasWidth: number;
  canvasHeight: number;
}
