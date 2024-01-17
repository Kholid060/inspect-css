<template>
  <div class="px-4 pb-4 pt-2">
    <UiElementSpacing
      :computed-styles="properties.computedStyles"
      class="mt-2"
      title="margin">
      <UiElementSpacing
        :computed-styles="properties.computedStyles"
        title="padding">
        <div class="bg-primary bg-opacity-25 rounded-md text-center py-2 px-1">
          {{ Math.floor(properties.size.width) }}x{{
            Math.floor(properties.size.height)
          }}
        </div>
      </UiElementSpacing>
    </UiElementSpacing>
    <div class="mt-4 space-y-4">
      <div
        v-for="(mediaCSS, index) in appliedStyle.media"
        :key="mediaCSS.mediaCondition"
        class="p-2 rounded-md bg-muted/50 space-y-2">
        <div>
          <p class="text-sm font-mono text-indigo-400 font-semibold"
            >@media{{ wrapInParenthesis(mediaCSS.mediaCondition) }}</p
          >
          <DetailCSSEditor
            :model-value="mediaCSS.cssText"
            class="text-sm mt-1"
            @change="onCSSChange({ type: 'media', index, value: $event })" />
        </div>
        <div
          v-for="(pseudoCSS, pseudoIndex) in mediaCSS.pseudo"
          :key="pseudoCSS.selector"
          class="p-2 rounded-md bg-muted/50">
          <p class="text-sm font-mono text-emerald-500 font-semibold">{{
            pseudoCSS.selector
          }}</p>
          <DetailCSSEditor
            :model-value="pseudoCSS.cssText"
            class="text-sm mt-1"
            @change="
              onCSSChange({
                value: $event,
                mediaIdx: index,
                index: pseudoIndex,
                type: 'media-pseudo',
              })
            " />
        </div>
      </div>
      <DetailCSSEditor
        :model-value="appliedStyle.cssText"
        class="text-sm"
        @change="onCSSChange({ type: 'main', value: $event })" />
      <div
        v-for="(pseudoCSS, index) in appliedStyle.pseudo"
        :key="pseudoCSS.selector"
        class="p-2 rounded-md bg-muted/50">
        <p class="text-sm font-mono text-amber-500 font-semibold">{{
          pseudoCSS.selector
        }}</p>
        <DetailCSSEditor
          :model-value="pseudoCSS.cssText"
          class="text-sm mt-1"
          @change="onCSSChange({ type: 'pseudo', value: $event, index })" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue';
import DetailCSSEditor from './DetailCSSEditor.vue';
import UiElementSpacing from '@root/src/pages/components/ui/UiElementSpacing.vue';
import { ElementAppliedStyleRules } from '@root/src/utils/CSSRulesUtils';
import { ElementProperties } from '@root/src/utils/getElProperties';
import { debounce, wrapInParenthesis } from '@root/src/utils/helper';
import { StyleDataItem, useAppProvider } from '../../app-plugin';
import { generateElementCSS } from '@src/utils/generate-element-css';

type OnCSSChangeType =
  | {
      type: 'main';
      value: string;
    }
  | { type: 'pseudo'; value: string; index: number }
  | { type: 'media'; value: string; index: number }
  | { type: 'media-pseudo'; value: string; mediaIdx: number; index: number };

interface Props {
  elSelector: string;
  properties: ElementProperties;
  appliedStyle: ElementAppliedStyleRules;
}
const props = defineProps<Props>();
const emits = defineEmits<{
  (e: 'update:appliedStyle', value: ElementAppliedStyleRules): void;
}>();

const appProvider = useAppProvider();

let styleData: StyleDataItem | null = null;
let styleElement: HTMLStyleElement | null = null;

const onCSSChange = debounce((detail: OnCSSChangeType) => {
  const copyAppliedStyle = { ...props.appliedStyle };

  switch (detail.type) {
    case 'main':
      copyAppliedStyle.cssText = detail.value;
      break;
    case 'media':
      copyAppliedStyle.media[detail.index].cssText = detail.value;
      break;
    case 'pseudo':
      copyAppliedStyle.pseudo[detail.index].cssText = detail.value;
      break;
    case 'media-pseudo':
      copyAppliedStyle.media[detail.mediaIdx].pseudo[detail.index].cssText =
        detail.value;
      break;
  }

  emits('update:appliedStyle', copyAppliedStyle);

  if (!styleData) return;

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.setAttribute('el-selector', props.elSelector);
    document.body.appendChild(styleElement);
  }

  const generatedCSS = generateElementCSS({
    style: copyAppliedStyle,
    selector: props.elSelector,
    initialStyle: styleData.initialProps,
  });
  styleElement.textContent = generatedCSS;
  console.log(generatedCSS);
}, 500);

watch(
  () => props.elSelector,
  () => {
    styleElement = document.querySelector<HTMLStyleElement>(
      `style[el-selector="${props.elSelector}"]`,
    );

    styleData =
      Object.values(appProvider.styleData.items).find(
        (item) => item.elSelector === props.elSelector,
      ) || null;
    if (!styleData) {
      // set css to initial
      styleData = appProvider.addStyleItem({
        elSelector: props.elSelector,
        initialProps: props.appliedStyle,
      });
    }
  },
  { immediate: true },
);
</script>