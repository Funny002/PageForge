import type { Component } from 'vue';
import HeadingNode from './heading/index.vue';
import SpanNode from './span/index.vue';
import DivNode from './div/index.vue';
import ImageNode from './image/index.vue';
import TextNode from './text/index.vue';

export const nodeComponentMap: Record<string, Component> = {
  h1: HeadingNode,
  h2: HeadingNode,
  h3: HeadingNode,
  h4: HeadingNode,
  h5: HeadingNode,
  h6: HeadingNode,
  span: SpanNode,
  div: DivNode,
  img: ImageNode,
};

export const textNodeComponent: Component = TextNode;
