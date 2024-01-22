<template>
  <UiCodemirror
    v-if="initiated"
    :view-options="{ root: appProvider.shadowRoot }"
    :model-value="customCSS"
    placeholder="CSS code here..."
    class="min-h-40"
    :extensions="editorExtensions"
    :theme-options="{
      settings: {
        background: 'transparent',
        gutterBackground: 'transparent',
      },
    }"
    @change="updateCSS"
  />
</template>
<script setup lang="ts">
import { shallowRef, onMounted } from 'vue';
import { EL_IDS } from '@src/utils/constant';
import { lineNumbers } from '@codemirror/view';
import type { Extension } from '@codemirror/state';
import UiCodemirror from '@root/src/pages/components/ui/UiCodemirror.vue';
import { css } from '@codemirror/lang-css';
import { useAppProvider } from '../../content/ui/app-plugin';

let styleEl: HTMLStyleElement;
const editorExtensions: Extension[] = [css(), lineNumbers()];

const appProvider = useAppProvider();

const customCSS = shallowRef('');
const initiated = shallowRef(false);

function updateCSS(value: string) {
  customCSS.value = value;
  styleEl.textContent = value;

  appProvider.updateState({ hasGlobalCSS: Boolean(value.trim()) });
}

onMounted(() => {
  styleEl = document.getElementById(EL_IDS.customCSS) as HTMLStyleElement;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = EL_IDS.customCSS;
    document.body.appendChild(styleEl);
  }

  customCSS.value = styleEl.textContent ?? '';
  initiated.value = true;
});
</script>
