<template>
  <div
    class="fixed bottom-5 left-1/2 text-foreground -translate-x-1/2"
    :style="{ zIndex: CONTENT_ZINDEX.toolbar }">
    <div
      v-motion
      class="flex items-center gap-4"
      :initial="{ opacity: 0, y: 100 }"
      :enter="{ opacity: 1, y: 0 }"
      :delay="100">
      <div class="bg-background border-2 p-1 rounded-xl flex gap-1">
        <button v-for="i in 4" :key="i" class="toolbar-button">
          <Layers3Icon class="inline-block" />
        </button>
      </div>
      <div class="bg-background border-2 p-1 rounded-xl flex items-center">
        <button
          class="toolbar-button"
          @click="
            appProvider.updateState({ paused: !appProvider.state.paused })
          ">
          <PauseIcon v-if="!appProvider.state.paused" class="inline-block" />
          <PlayIcon v-else class="inline-block" />
        </button>
        <hr class="h-6 mx-1 bg-border w-px" />
        <button class="toolbar-button" @click="appProvider.destroy">
          <PowerIcon class="inline-block" />
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CONTENT_ZINDEX } from '@root/src/utils/constant';
import { Layers3Icon, PauseIcon, PlayIcon, PowerIcon } from 'lucide-vue-next';
import { useAppProvider } from '../app-plugin';

const appProvider = useAppProvider();
</script>
