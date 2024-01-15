<template>
  <main class="text-base text-left">
    <AppElementScanner />
    <AppElementDetail />
  </main>
</template>
<script setup lang="ts">
import { provide, shallowReactive } from 'vue';
import { APP_PROVIDER_KEY } from './keys';
import AppElementDetail from './app/AppElementDetail.vue';
import AppElementScanner from './app/AppElementScanner.vue';
import { AppState, AppStateProvider } from '@src/interfaces/app.interface';

const props = defineProps<{ shadowRoot: ShadowRoot }>();

const appState = shallowReactive<AppState>({
  paused: false,
  showGrid: false,
});

function updateState(newState: Partial<AppState>) {
  Object.assign(appState, newState);
}

provide<AppStateProvider>(APP_PROVIDER_KEY, {
  updateState,
  state: appState,
  shadowRoot: props.shadowRoot,
});
</script>
