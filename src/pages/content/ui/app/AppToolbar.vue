<template>
  <div
    class="fixed bottom-2 left-1/2 text-foreground -translate-x-1/2"
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
      <div class="bg-background border p-1 rounded-xl flex items-center gap-1">
        <UiTooltip label="Interactive">
          <button
            :class="[
              'toolbar-button',
              { active: appProvider.state.interactive },
            ]"
            @click="
              appProvider.updateState({
                interactive: !appProvider.state.interactive,
              })
            "
          >
            <MousePointerClickIcon class="inline-block" />
          </button>
        </UiTooltip>
        <UiTooltip label="Show grid">
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
        </UiTooltip>
        <hr class="h-6 bg-border w-px" />
        <a
          role="button"
          class="toolbar-button"
          href="https://github.com/Kholid060/inspect-css/"
          rel="noopener"
          target="_blank"
        >
          <GithubIcon class="inline-block" />
        </a>
      </div>
      <div class="relative">
        <div
          v-if="activeTool"
          v-motion
          class="bg-popover border absolute bottom-full mb-2 rounded-lg left-1/2 min-w-80 max-w-md min-h-20 group/content"
          :initial="{ y: 10 }"
          :enter="{ y: 0 }"
          :leave="{ y: -10 }"
          style="translate: -50%"
        >
          <button
            class="absolute h-8 w-8 -top-3 -right-3 z-50 flex items-center justify-center rounded-md border bg-secondary group-hover/content:scale-100 scale-0 transition"
            @click="activeTool = ''"
          >
            <XIcon class="h-5 w-5" />
          </button>
          <component :is="toolCompsMap[activeTool]" />
        </div>
        <div class="bg-background border p-1 rounded-xl flex gap-1">
          <UiTooltip v-for="tool in tools" :key="tool.id" :label="tool.name">
            <button
              :class="[
                'toolbar-button indicator',
                { active: tool.id === activeTool },
              ]"
              @click="activeTool = tool.id === activeTool ? '' : tool.id"
            >
              <component :is="tool.icon" class="inline-block" />
              <span
                v-if="
                  tool.id === 'custom-css' &&
                  (addedCustomCSSCount || appProvider.state.hasGlobalCSS)
                "
                class="rounded-md bg-red-500 text-zinc-100 w-2 h-2 text-xs absolute -top-0 -right-0"
              />
            </button>
          </UiTooltip>
        </div>
      </div>
      <div class="bg-background border p-1 rounded-xl flex items-center">
        <UiTooltip label="Pause">
          <button
            class="toolbar-button"
            @click="
              appProvider.updateState({ paused: !appProvider.state.paused })
            "
          >
            <PauseIcon v-if="!appProvider.state.paused" class="inline-block" />
            <PlayIcon v-else class="inline-block" />
          </button>
        </UiTooltip>
        <hr class="h-6 mx-1 bg-border w-px" />
        <UiTooltip label="Close">
          <button class="toolbar-button" @click="appProvider.destroy">
            <PowerIcon class="inline-block" />
          </button>
        </UiTooltip>
      </div>
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
  GithubIcon,
  MousePointerClickIcon,
  PaletteIcon,
  PauseIcon,
  PipetteIcon,
  PlayIcon,
  PowerIcon,
  XIcon,
} from 'lucide-vue-next';
import { useAppProvider } from '../app-plugin';
import ToolbarAssets from './toolbar/ToolbarAssets.vue';
import ToolbarCustomCSS from './toolbar/ToolbarCustomCSS.vue';
import { Component, computed, shallowRef } from 'vue';
import ToolbarEyeDropper from './toolbar/ToolbarEyeDropper.vue';
import ToolbarNavigator from './toolbar/ToolbarNavigator.vue';
import ToolbarColorPalette from './toolbar/ToolbarColorPalette.vue';
import UiTooltip from '@root/src/pages/components/ui/UiTooltip.vue';

const toolCompsMap: Record<string, Component> = {
  assets: ToolbarAssets,
  navigator: ToolbarNavigator,
  'custom-css': ToolbarCustomCSS,
  'eye-dropper': ToolbarEyeDropper,
  'color-palette': ToolbarColorPalette,
};
const tools = [
  { id: 'navigator', name: 'Navigator', icon: Layers3Icon },
  { id: 'custom-css', name: 'Custom CSS', icon: Code2Icon },
  { id: 'assets', name: 'Graphic Assets', icon: FileImageIcon },
  { id: 'color-palette', name: 'Color Palettes', icon: PaletteIcon },
];
if (window.EyeDropper) {
  tools.push({ id: 'eye-dropper', name: 'Eye dropper', icon: PipetteIcon });
}

const appProvider = useAppProvider();

const activeTool = shallowRef('custom-css');

const addedCustomCSSCount = computed(
  () => Object.keys(appProvider.styleData.dirtyItems.value).length,
);
</script>
