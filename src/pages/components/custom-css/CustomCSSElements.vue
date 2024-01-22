<template>
  <p
    v-if="elementCSS.length === 0"
    class="text-center py-2 text-muted-foreground"
  >
    No changes
  </p>
  <UiButton
    v-else
    size="sm"
    variant="secondary"
    class="highlight-white/5"
    @click="resetAll"
  >
    Reset All
  </UiButton>
  <ul class="space-y-2 mt-2">
    <li
      v-for="item in elementCSS"
      :key="item.id"
      class="bg-muted/50 p-2 rounded-md flex items-center gap-2 group"
    >
      <UiElementSelector
        :selector="item.basicSelector"
        class="flex-1 cursor-pointer"
        @click="selectElement(item.selector)"
      />
      <UiButton
        variant="secondary"
        size="sm"
        class="highlight-white/5 invisible group-hover:visible"
        @click="resetElCSS(item)"
      >
        Reset
      </UiButton>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useAppProvider } from '../../content/ui/app-plugin';
import getElProperties, {
  ElementBasicSelector,
} from '@root/src/utils/getElProperties';
import UiElementSelector from '../ui/UiElementSelector.vue';
import UiButton from '../ui/UiButton.vue';
import { emitter } from '@root/src/lib/mitt';
import { EL_ATTR_NAME } from '@root/src/utils/constant';

interface StyleItem {
  id: number;
  selector: string;
  basicSelector: ElementBasicSelector;
}

const appProvider = useAppProvider();

const elementCSS = computed(() => {
  const styleData = appProvider.styleData;
  const styles: StyleItem[] = [];

  for (const key in styleData.dirtyItems.value) {
    const style = styleData.items[key];
    if (!style) continue;

    styles.push({
      id: style.id,
      selector: style.elSelector,
      basicSelector: style.basicSelector,
    });
  }

  return styles;
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
function resetElCSS(item: Pick<StyleItem, 'id' | 'selector'>) {
  const styleEl = document.querySelector(
    `[${EL_ATTR_NAME.customStyle}="${item.selector}"]`,
  );
  if (!styleEl) return;

  styleEl.remove();
  emitter.emit('content:remove-selected');

  appProvider.removeDirtyStyleItem(item.id);
}
function resetAll() {
  const { styleData } = appProvider;
  for (const key in styleData.dirtyItems.value) {
    const item = styleData.items[key];
    if (!item) continue;

    resetElCSS({ id: item.id, selector: item.elSelector });
  }
}
</script>
