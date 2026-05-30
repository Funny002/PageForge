<template>
  <div class="fp-topbar">
    <div class="fp-topbar__left">
      <slot name="left" />
      <template v-if="leftItems.length">
        <component :is="item.component" v-for="item in leftItems" :key="item.id" />
      </template>
    </div>
    <div class="fp-topbar__center">
      <slot name="center" />
      <template v-if="centerItems.length">
        <component :is="item.component" v-for="item in centerItems" :key="item.id" />
      </template>
    </div>
    <div class="fp-topbar__right">
      <slot name="right" />
      <template v-if="rightItems.length">
        <component :is="item.component" v-for="item in rightItems" :key="item.id" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageForge } from '../../composables/usePageForge'
const forge = usePageForge()
const allItems = computed(() => forge.content.topBar.getItems().value)

const leftItems = computed(() => allItems.value.filter((i) => i.position === 'left'))
const centerItems = computed(() => allItems.value.filter((i) => i.position === 'center'))
const rightItems = computed(() => allItems.value.filter((i) => i.position === 'right'))
</script>

<style lang="scss" src="./style.scss"></style>
