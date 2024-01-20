<template>
  <main class="text-base text-left !font-sans" style="color-scheme: dark">
    <AppElementScanner v-if="!state.paused" />
    <AppElementDetail />
    <AppToolbar />
  </main>
</template>
<script setup lang="ts">
import { EL_ATTR_NAME } from '@root/src/utils/constant';
import { useAppProvider } from './app-plugin';
import AppElementDetail from './app/AppElementDetail.vue';
import AppElementScanner from './app/AppElementScanner.vue';
import AppToolbar from './app/AppToolbar.vue';
import { watch } from 'vue';

const { state } = useAppProvider();

watch(
  () => state.showGrid,
  (showGrid) => {
    if (showGrid) document.body.setAttribute(EL_ATTR_NAME.showGrid, '');
    else document.body.removeAttribute(EL_ATTR_NAME.showGrid);
  },
);
</script>
