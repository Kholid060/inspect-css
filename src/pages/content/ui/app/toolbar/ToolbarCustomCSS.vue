<template>
  <div class="text-sm">
    <div class="px-3 pt-3">
      <p class="font-semibold">Custom CSS</p>
      <p class="text-muted-foreground leading-tight">
        Add custom css to the page
      </p>
    </div>
    <div
      class="flex items-center border-b px-3 mt-1 text-muted-foreground space-x-1"
    >
      <button
        :class="[
          'border-b-2 inline-flex items-center p-2 hover:text-foreground transition',
          activeTab === 'elements'
            ? 'border-primary text-foreground'
            : 'border-transparent',
        ]"
        @click="activeTab = 'elements'"
      >
        Elements
        <span
          v-if="addedCustomCSSCount"
          class="rounded-md bg-red-500 opacity-50 text-zinc-100 w-2 h-2 text-xs ml-2"
        />
      </button>
      <button
        :class="[
          'border-b-2 inline-flex items-center p-2 hover:text-foreground transition',
          activeTab === 'global'
            ? 'border-primary text-foreground'
            : 'border-transparent',
        ]"
        @click="activeTab = 'global'"
      >
        Global
        <span
          v-if="appProvider.state.hasGlobalCSS"
          class="rounded-md bg-red-500 opacity-50 text-zinc-100 w-2 h-2 text-xs ml-2"
        />
      </button>
    </div>
    <div class="max-h-[350px] min-h-16 overflow-auto px-3 pb-3 pt-2">
      <KeepAlive>
        <CustomCSSGlobal v-if="activeTab === 'global'" />
        <CustomCSSElements v-else-if="activeTab === 'elements'" />
      </KeepAlive>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useAppProvider } from '../../app-plugin';
import CustomCSSGlobal from '@root/src/pages/components/custom-css/CustomCSSGlobal.vue';
import CustomCSSElements from '@root/src/pages/components/custom-css/CustomCSSElements.vue';

const appProvider = useAppProvider();

const activeTab = shallowRef('elements');

const addedCustomCSSCount = computed(
  () => Object.keys(appProvider.styleData.dirtyItems.value).length,
);
</script>
