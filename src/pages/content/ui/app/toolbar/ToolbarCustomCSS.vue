<template>
  <div class="max-h-[300px] overflow-auto text-sm">
    <div class="px-2 pt-2">
      <p class="font-semibold">Custom CSS</p>
      <p class="text-muted-foreground leading-tight">
        Add custom css to the page
      </p>
    </div>
    <UiCodemirror
      v-if="initiated"
      :model-value="customCSS"
      class="mt-2 px-2 pb-2 w-full overflow-y-visible overflow-x-auto"
      placeholder="CSS code here..."
      :extensions="editorExtensions"
      :theme-options="{
        settings: {
          background: 'transparent',
          gutterBackground: 'transparent',
        },
      }"
      @change="updateCSS"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import { lineNumbers } from '@codemirror/view';
import type { Extension } from '@codemirror/state';
import { EL_IDS } from '@src/utils/constant';
import UiCodemirror from '@root/src/pages/components/ui/UiCodemirror.vue';
import { css } from '@codemirror/lang-css';

let styleEl: HTMLStyleElement;

const editorExtensions: Extension[] = [css(), lineNumbers()];

const customCSS = shallowRef('');
const initiated = shallowRef(false);

function updateCSS(value: string) {
  customCSS.value = value;
  styleEl.textContent = value;
}

onMounted(() => {
  styleEl = document.getElementById(EL_IDS.customCSS) as HTMLStyleElement;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = EL_IDS.customCSS;
    document.body.appendChild(styleEl);
    console.log(styleEl);
  }

  customCSS.value = styleEl.textContent ?? '';
  initiated.value = true;
});
</script>
