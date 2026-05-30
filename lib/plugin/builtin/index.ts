import type { PageForgePlugin } from '../index';
import TextRenderer from './Text.vue';
import RectangleRenderer from './Rectangle.vue';
import ImageRenderer from './Image.vue';
import ExplorerPanel from './panels/Explorer.vue';
import ComponentPalette from './panels/ComponentPalette.vue';
import { TreeViewAlt, Rocket } from '@vicons/carbon';

export const textPlugin: PageForgePlugin = {
  name: 'builtin:text',
  nodeTypes: {
    text: {
      label: 'Text',
      defaultProps: {
        text: 'Text',
        fontSize: 16,
        fontWeight: 'normal',
        color: 'var(--pf-text-primary)',
        textAlign: 'left',
      },
      defaultSize: { width: 120, height: 40 },
      renderer: TextRenderer,
    },
  },
};

export const rectanglePlugin: PageForgePlugin = {
  name: 'builtin:rectangle',
  nodeTypes: {
    rectangle: {
      label: 'Rectangle',
      defaultProps: {
        fill: '#e8f0fe',
        borderColor: '#d0d7de',
        borderRadius: 0,
      },
      defaultSize: { width: 200, height: 120 },
      renderer: RectangleRenderer,
    },
  },
};

export const imagePlugin: PageForgePlugin = {
  name: 'builtin:image',
  nodeTypes: {
    image: {
      label: 'Image',
      defaultProps: {
        src: '',
        alt: 'Image',
        objectFit: 'cover',
      },
      defaultSize: { width: 200, height: 150 },
      renderer: ImageRenderer,
    },
  },
};

export const explorerPlugin: PageForgePlugin = {
  name: 'builtin:explorer',
  views: {
    sidebar: [{
      id: 'pf-explorer',
      title: 'Explorer',
      icon: TreeViewAlt,
      render: ExplorerPanel,
    }],
  },
};

export const componentPlugin: PageForgePlugin = {
  name: 'builtin:components',
  views: {
    sidebar: [{
      id: 'pf-components',
      title: 'Components',
      icon: Rocket,
      render: ComponentPalette,
    }],
  },
};

export const builtinPlugins: PageForgePlugin[] = [
  textPlugin,
  rectanglePlugin,
  imagePlugin,
  explorerPlugin,
  componentPlugin,
];
