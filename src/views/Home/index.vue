<template>
  <div>
    <div>Home</div>
    <n-button @click="handleClick">to Editor</n-button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function handleClick() {
  router.push('/editor');
}
</script>
