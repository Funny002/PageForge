import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  { name: 'App', path: '/', redirect: '/home' },
  { name: 'Home', path: '/home', component: () => import('../views/Home/index.vue') },
  { name: 'Editor', path: '/editor', component: () => import('../views/Editor/index.vue') },
];
