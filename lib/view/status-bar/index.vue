<template>
  <div class="fp-statusbar">
    <div class="fp-statusbar__left">
      <slot name="left" />
      <template v-if="leftItems.length">
        <component :is="item.component" v-for="item in leftItems" :key="item.id" />
      </template>
    </div>
    <div class="fp-statusbar__right">
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
const allItems = computed(() => forge.content.statusBar.getItems().value)

const leftItems = computed(() => allItems.value.filter((i) => i.position === 'left'))
const rightItems = computed(() => allItems.value.filter((i) => i.position === 'right'))
</script>

<style lang="scss" src="./style.scss"></style>
