<template>
  <div>
    <div>Home</div>
    <n-button @click="handlerClick">to Editor</n-button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function handlerClick() {
  router.push('/editor');
}
</script>
