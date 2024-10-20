<template>
  <p
    v-if="elementCSS.length === 0"
    class="text-center py-2 text-muted-foreground"
  >
    No changes
  </p>
  <div v-else class="flex items-center">
    <UiButton
      size="sm"
      variant="secondary"
      class="highlight-white/5"
      @click="resetAll"
    >
      Reset all
    </UiButton>
    <div class="grow"></div>
    <UiButton
      size="sm"
      variant="secondary"
      class="highlight-white/5"
      @click="copyChanges()"
    >
      {{ isCopied === 'all' ? '✅ Copied' : 'Copy changes' }}
    </UiButton>
  </div>
  <ul class="space-y-2 mt-2">
    <li
      v-for="item in elementCSS"
      :key="item.id"
      class="bg-muted/50 p-2 rounded-md flex items-center gap-2 group"
    >
      <UiElementSelector
        :selector="item.basicSelector"
        class="flex-1 cursor-pointer line-clamp-2 max-w-sm"
        @click="selectElement(item.elSelector)"
      />
      <UiTooltip label="Copy changes">
        <UiButton
          variant="secondary"
          size="icon-sm"
          class="highlight-white/5 invisible group-hover:visible"
          @click="copyChanges(item)"
        >
          <span v-if="item.id === isCopied">✅</span>
          <CopyIcon v-else class="size-5" />
        </UiButton>
      </UiTooltip>
      <UiTooltip label="Reset">
        <UiButton
          variant="secondary"
          size="icon-sm"
          class="highlight-white/5 invisible group-hover:visible"
          @click="resetElCSS(item)"
        >
          <RotateCcwIcon class="size-5" />
        </UiButton>
      </UiTooltip>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { RotateCcwIcon, CopyIcon } from 'lucide-vue-next';
import { StyleDataItem, useAppProvider } from '../../content/ui/app-plugin';
import getElProperties from '@root/src/utils/getElProperties';
import UiElementSelector from '../ui/UiElementSelector.vue';
import UiButton from '../ui/UiButton.vue';
import { emitter } from '@root/src/lib/mitt';
import { EL_ATTR_NAME } from '@root/src/utils/constant';
import { getAppliedCSS } from '@root/src/utils/get-applied-css';
import { copyToClipboard } from '@root/src/utils/helper';
import UiTooltip from '../ui/UiTooltip.vue';

const appProvider = useAppProvider();

const isCopied = shallowRef<number | string | null>(null);

const elementCSS = computed(() => {
  return Object.entries(appProvider.styleData.items).reduce<StyleDataItem[]>(
    (acc, { 1: style }) => {
      if (appProvider.styleData.dirtyItems.value[style.id]) {
        acc.push(style);
      }

      return acc;
    },
    [],
  );
});

function selectElement(selector: string) {
  const element = document.querySelector(selector);
  if (!element) return;

  const selectedElement = document.querySelector(`[${EL_ATTR_NAME.selected}]`);
  selectedElement?.removeAttribute(EL_ATTR_NAME.selected);

  element.setAttribute(EL_ATTR_NAME.selected, 'true');

  const properties = getElProperties(element).getAll();
  emitter.emit('content:el-selected', {
    properties,
    el: element,
  });
}
function resetElCSS(item: StyleDataItem) {
  const styleEl = document.querySelector(
    `[${EL_ATTR_NAME.customStyle}="${item.elSelector}"]`,
  );
  if (!styleEl) return;

  styleEl.remove();
  emitter.emit('content:remove-selected');

  appProvider.removeDirtyStyleItem(item.id);
}
function resetAll() {
  elementCSS.value.forEach(resetElCSS);
}
function copyChanges(item?: StyleDataItem) {
  const cssText = getAppliedCSS(item ? [item] : elementCSS.value).trim();

  copyToClipboard(cssText)
    .then(() => {
      isCopied.value = item?.id ?? 'all';
      setTimeout(() => {
        isCopied.value = null;
      }, 1000);
    })
    .catch((error) => {
      alert('Error when trying copy CSS to clipboard');
      console.error(error);
    });
}
</script>
