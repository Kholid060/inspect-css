<template>
  <UiElementSpacing
    :computed-styles="properties.computedStyles"
    class="mt-2"
    title="margin"
  >
    <UiElementSpacing
      :computed-styles="properties.computedStyles"
      title="padding"
    >
      <div class="bg-primary bg-opacity-25 rounded-md text-center py-2 px-1">
        {{ Math.floor(properties.size.width) }}x{{
          Math.floor(properties.size.height)
        }}
      </div>
    </UiElementSpacing>
  </UiElementSpacing>
  <div class="mt-4 space-y-2">
    <div
      v-for="(mediaCSS, index) in styleData.currentProps.media"
      :key="mediaCSS.mediaCondition"
      class="p-2 rounded-md bg-muted/50 space-y-2 highlight-white/5"
    >
      <div>
        <p class="text-sm font-mono text-indigo-400 font-semibold">
          @media{{ wrapInParenthesis(mediaCSS.mediaCondition) }}
        </p>
        <DetailCSSEditor
          :style-id="elSelector"
          :model-value="mediaCSS.cssText"
          class="text-sm mt-1"
          @change="onCSSChange({ type: 'media', index, value: $event })"
        />
      </div>
      <div
        v-for="(pseudoCSS, pseudoIndex) in mediaCSS.pseudo"
        :key="pseudoCSS.pseudo"
        class="p-2 rounded-md bg-muted/50 highlight-white/5"
      >
        <p class="text-sm font-mono text-amber-500 font-semibold">
          {{ pseudoCSS.pseudo }}
        </p>
        <DetailCSSEditor
          :style-id="elSelector"
          :model-value="pseudoCSS.cssText"
          class="text-sm mt-1"
          @change="
            onCSSChange({
              value: $event,
              mediaIdx: index,
              index: pseudoIndex,
              type: 'media-pseudo',
            })
          "
        />
      </div>
    </div>
    <DetailCSSEditor
      :key="elSelector"
      :model-value="styleData.currentProps.cssText"
      class="text-sm"
      @change="onCSSChange({ type: 'main', value: $event })"
    />
    <div
      v-for="(pseudoCSS, index) in styleData.currentProps.pseudo"
      :key="pseudoCSS.pseudo"
      class="p-2 rounded-md bg-muted/50 highlight-white/5"
    >
      <p class="text-sm font-mono text-amber-500 font-semibold">
        {{ pseudoCSS.pseudo }}
      </p>
      <DetailCSSEditor
        :style-id="elSelector"
        :model-value="pseudoCSS.cssText"
        class="text-sm mt-1"
        @change="onCSSChange({ type: 'pseudo', value: $event, index })"
      />
    </div>
    <div
      v-for="(animation, index) in styleData.currentProps.animation"
      :key="animation.name"
      class="p-2 rounded-md bg-muted/50 highlight-white/5"
    >
      <p class="text-sm font-mono text-amber-500 font-semibold">
        @keyframes {{ animation.name }}
      </p>
      <DetailCSSEditor
        :style-id="elSelector"
        :model-value="animation.cssText"
        class="text-sm mt-1"
        @change="onCSSChange({ type: 'animation', value: $event, index })"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue';
import DetailCSSEditor from './DetailCSSEditor.vue';
import UiElementSpacing from '@root/src/pages/components/ui/UiElementSpacing.vue';
import { ElementAppliedStyleRules } from '@root/src/utils/CSSRulesUtils';
import {
  ElementBasicSelector,
  ElementProperties,
} from '@root/src/utils/getElProperties';
import { debounce, wrapInParenthesis } from '@root/src/utils/helper';
import { StyleDataItem } from '../../app-plugin';
import { generateElementCSS } from '@src/utils/generate-element-css';
import { EL_ATTR_NAME } from '@root/src/utils/constant';

type OnCSSChangeType =
  | {
      type: 'main';
      value: string;
    }
  | { type: 'pseudo'; value: string; index: number }
  | { type: 'media'; value: string; index: number }
  | { type: 'animation'; value: string; index: number }
  | { type: 'media-pseudo'; value: string; mediaIdx: number; index: number };

interface Props {
  elSelector: string;
  styleData: StyleDataItem;
  properties: ElementProperties;
  basicSelector: ElementBasicSelector;
}
const props = defineProps<Props>();
const emits = defineEmits<{
  (e: 'update:appliedStyle', value: ElementAppliedStyleRules): void;
}>();

let styleElement: HTMLStyleElement | null = null;

const onCSSChange = debounce((detail: OnCSSChangeType) => {
  const copyAppliedStyle = { ...props.styleData.currentProps };

  // TO-DO: use object-path
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
    case 'animation':
      copyAppliedStyle.animation[detail.index].cssText = detail.value;
      break;
    case 'media-pseudo':
      copyAppliedStyle.media[detail.mediaIdx].pseudo[detail.index].cssText =
        detail.value;
      break;
  }

  emits('update:appliedStyle', copyAppliedStyle);

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.setAttribute('id', `inspect-css-el-${props.styleData.id}`);
    styleElement.setAttribute(EL_ATTR_NAME.customStyle, props.elSelector);
    document.body.appendChild(styleElement);
  }

  const generatedCSS = generateElementCSS({
    style: copyAppliedStyle,
    selector: props.elSelector,
    initialStyle: props.styleData.initialProps,
  });
  styleElement.textContent = generatedCSS;
}, 500);

watch(
  () => props.elSelector,
  () => {
    styleElement = document.querySelector<HTMLStyleElement>(
      `style[${EL_ATTR_NAME.customStyle}="${props.elSelector}"]`,
    );
  },
  { immediate: true },
);
</script>
