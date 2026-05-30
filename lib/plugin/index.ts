import type { Component } from 'vue';
import type { PageNode } from '../core';

export interface NodeTypeConfig {
  label: string;
  icon?: Component;
  defaultProps: Record<string, unknown>;
  defaultSize: { width: number; height: number };
  renderer: Component;
}

export interface SidebarView {
  id: string;
  title: string;
  icon: Component;
  render: Component;
}

export interface PageForgePlugin {
  name: string;
  version?: string;
  nodeTypes?: Record<string, NodeTypeConfig>;
  views?: {
    sidebar?: SidebarView[];
  };
  onInstall?(): void;
  onUninstall?(): void;
}

export function createNode(type: string, x: number, y: number, props?: Record<string, unknown>): PageNode {
  const registry = getPluginRegistry();
  const config = registry.get(type);
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    x,
    y,
    width: config?.defaultSize.width ?? 100,
    height: config?.defaultSize.height ?? 80,
    props: { ...config?.defaultProps, ...props },
  };
}

let _registry: PluginRegistry | null = null;

export class PluginRegistry {
  private types = new Map<string, NodeTypeConfig>();
  private plugins = new Map<string, PageForgePlugin>();

  registerPlugin(plugin: PageForgePlugin): void {
    if (this.plugins.has(plugin.name)) return;
    this.plugins.set(plugin.name, plugin);
    if (plugin.nodeTypes) {
      for (const [type, config] of Object.entries(plugin.nodeTypes)) {
        this.types.set(type, config);
      }
    }
    plugin.onInstall?.();
  }

  getSidebarViews(): SidebarView[] {
    const views: SidebarView[] = [];
    for (const plugin of this.plugins.values()) {
      if (plugin.views?.sidebar) {
        views.push(...plugin.views.sidebar);
      }
    }
    return views;
  }

  unregisterPlugin(name: string): void {
    const plugin = this.plugins.get(name);
    if (!plugin) return;
    if (plugin.nodeTypes) {
      for (const type of Object.keys(plugin.nodeTypes)) {
        this.types.delete(type);
      }
    }
    plugin.onUninstall?.();
    this.plugins.delete(name);
  }

  get(type: string): NodeTypeConfig | undefined {
    return this.types.get(type);
  }

  getAll(): Array<{ type: string; config: NodeTypeConfig }> {
    return Array.from(this.types.entries()).map(([type, config]) => ({ type, config }));
  }

  has(type: string): boolean {
    return this.types.has(type);
  }

  getPlugins(): PageForgePlugin[] {
    return Array.from(this.plugins.values());
  }
}

export function getPluginRegistry(): PluginRegistry {
  if (!_registry) _registry = new PluginRegistry();
  return _registry;
}

export function registerPlugin(plugin: PageForgePlugin): void {
  getPluginRegistry().registerPlugin(plugin);
}

export function usePlugin(plugin: PageForgePlugin): void {
  registerPlugin(plugin);
}
