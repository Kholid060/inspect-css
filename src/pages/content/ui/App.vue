<template>
  <main class="text-base text-left">
    <AppElementScanner v-if="!state.paused" />
    <AppElementDetail />
    <AppToolbar />
  </main>
</template>
<script setup lang="ts">
import { useAppProvider } from './app-plugin';
import AppElementDetail from './app/AppElementDetail.vue';
import AppElementScanner from './app/AppElementScanner.vue';
import AppToolbar from './app/AppToolbar.vue';

const { state } = useAppProvider();
</script>
