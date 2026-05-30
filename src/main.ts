import { createPinia } from 'pinia';
import App from './app/index.vue';

async function bootstrap() {
  const app = createApp(App);
  app.use(createPinia()); // 创建 Pinia 实例
  app.mount('#app');
}

bootstrap().then(() => {
  console.log('bootstrap done');
});
