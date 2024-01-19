<template>
  <div
    class="fixed bottom-5 left-1/2 text-foreground -translate-x-1/2"
    :style="{ zIndex: CONTENT_ZINDEX.toolbar }"
  >
    <div
      v-motion
      class="flex items-center gap-4 relative"
      :initial="{ opacity: 0, y: 100 }"
      :enter="{ opacity: 1, y: 0 }"
      :leave="{ opacity: 0, y: -100 }"
      :delay="100"
    >
      <div class="bg-background border-2 p-1 rounded-xl flex gap-1">
        <button
          :class="['toolbar-button', { active: appProvider.state.interactive }]"
          @click="
            appProvider.updateState({
              interactive: !appProvider.state.interactive,
            })
          "
        >
          <MousePointerClickIcon class="inline-block" />
        </button>
        <button
          :class="['toolbar-button', { active: appProvider.state.showGrid }]"
          @click="
            appProvider.updateState({
              showGrid: !appProvider.state.showGrid,
            })
          "
        >
          <Grid3X3Icon class="inline-block" />
        </button>
      </div>
      <div class="bg-background border-2 p-1 rounded-xl flex gap-1">
        <button
          v-for="tool in tools"
          :key="tool.id"
          :class="['toolbar-button', { active: tool.id === activeTool }]"
          @click="activeTool = tool.id === activeTool ? '' : tool.id"
        >
          <component :is="tool.icon" class="inline-block" />
        </button>
      </div>
      <div class="bg-background border-2 p-1 rounded-xl flex items-center">
        <button
          class="toolbar-button"
          @click="
            appProvider.updateState({ paused: !appProvider.state.paused })
          "
        >
          <PauseIcon v-if="!appProvider.state.paused" class="inline-block" />
          <PlayIcon v-else class="inline-block" />
        </button>
        <hr class="h-6 mx-1 bg-border w-px" />
        <button class="toolbar-button" @click="appProvider.destroy">
          <PowerIcon class="inline-block" />
        </button>
      </div>
    </div>
    <div
      v-if="activeTool"
      v-motion
      class="bg-popover border-2 absolute bottom-full mb-2 rounded-lg left-1/2 min-w-80 max-w-md"
      :initial="{ y: 10 }"
      :enter="{ y: 0 }"
      :leave="{ y: -10 }"
      style="translate: -50%"
    >
      <component :is="toolCompsMap[activeTool]" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { CONTENT_ZINDEX } from '@root/src/utils/constant';
import {
  Code2Icon,
  FileImageIcon,
  Grid3X3Icon,
  Layers3Icon,
  MousePointerClickIcon,
  PaletteIcon,
  PauseIcon,
  PipetteIcon,
  PlayIcon,
  PowerIcon,
} from 'lucide-vue-next';
import { useAppProvider } from '../app-plugin';
import ToolbarCustomCSS from './toolbar/ToolbarCustomCSS.vue';
import { Component, shallowRef } from 'vue';

const toolCompsMap: Record<string, Component> = {
  'custom-css': ToolbarCustomCSS,
};
const tools = [
  { id: 'navigator', name: 'Navigator', icon: Layers3Icon },
  { id: 'custom-css', name: 'Custom CSS', icon: Code2Icon },
  { id: 'assets', name: 'Graphic Assets', icon: FileImageIcon },
  { id: 'palette', name: 'Color Palettes', icon: PaletteIcon },
];
if (window.EyeDropper) {
  tools.push({ id: 'eyedropper', name: 'Eye dropper', icon: PipetteIcon });
}

const appProvider = useAppProvider();

const activeTool = shallowRef('');
</script>
