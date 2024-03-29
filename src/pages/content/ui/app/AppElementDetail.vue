<template>
  <div
    v-if="elProperties"
    ref="containerRef"
    class="fixed top-0 left-0 bg-background rounded-xl text-foreground border"
    :style="{ zIndex: CONTENT_ZINDEX.content, width: CONTAINER_WIDTH + 'px' }"
  >
    <DetailHeader
      :container-el="containerRef"
      :last-position="lastPosition"
      :selected-el="selectedEl"
      @close-window="closeWindow"
      @update-window-pos="updateWindowPosition"
    />
    <div class="px-4 pt-4">
      <UiElementSelector :selector="elProperties.selector" />
      <div class="flex items-center mt-0.5 gap-1 text-sm">
        <CaseSensitiveIcon class="h-7 w-7" />
        <p>
          {{ elProperties.computedStyles.fontFamily }}
          {{ elProperties.computedStyles.fontSize }}px
        </p>
      </div>
    </div>
    <div
      class="flex items-center border-b px-4 mt-1 text-muted-foreground space-x-1"
    >
      <button
        v-for="item in tabItems"
        :key="item.id"
        :class="[
          'border-b-2 inline-flex items-center p-2 hover:text-foreground transition',
          item.id === state.activeTab
            ? 'border-primary text-foreground'
            : 'border-transparent',
        ]"
        @click="state.activeTab = item.id"
      >
        <component :is="item.icon" class="h-4 w-4 mr-2" />
        {{ item.name }}
      </button>
    </div>
    <div style="max-height: calc(100vh - 200px)" class="overflow-auto p-4">
      <KeepAlive include="detail-style,DetailStyle">
        <DetailStyle
          v-if="state.activeTab === 'style' && elStyleData"
          :el-selector="elSelector"
          :style-data="elStyleData"
          :properties="elProperties"
          :basic-selector="elProperties.selector"
          @update:applied-style="updateAppliedStyle"
        />
        <DetailAttributes
          v-else-if="state.activeTab === 'attributes' && selectedEl"
          :element="selectedEl"
        />
        <DetailElementHTML
          v-else-if="state.activeTab === 'html' && selectedEl"
          :element="selectedEl"
        />
      </KeepAlive>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  shallowReactive,
  nextTick,
  watch,
} from 'vue';
import { emitter, EmitterEvents } from '@root/src/lib/mitt';
import CSSRulesUtils, {
  ElementAppliedStyleRules,
} from '@root/src/utils/CSSRulesUtils';
import {
  BrushIcon,
  CaseSensitiveIcon,
  PencilRuler,
  Code2Icon,
} from 'lucide-vue-next';
import { CONTENT_ZINDEX, SESSION_STORAGE_KEY } from '@src/utils/constant';
import getElProperties, {
  ElementProperties,
} from '@root/src/utils/getElProperties';
import DetailStyle from './detail/DetailStyle.vue';
import DetailElementHTML from './detail/DetailElementHTML.vue';
import UiElementSelector from '@root/src/pages/components/ui/UiElementSelector.vue';
import { finder } from '@medv/finder';
import DetailHeader from './detail/DetailHeader.vue';
import DetailAttributes from './detail/DetailAttributes.vue';
import { debounce, parseJSON } from '@root/src/utils/helper';
import { StyleDataItem, useAppProvider } from '../app-plugin';

interface WindowPosition {
  x: number;
  y: number;
}

const CONTAINER_WIDTH = 350;

let listenedWindowResize = false;
let lastPosition: WindowPosition | null = parseJSON(
  sessionStorage.getItem(SESSION_STORAGE_KEY.elPropsPosition) ?? '',
  null,
);

const cssRulesUtils = new CSSRulesUtils();
const tabItems = [
  { name: 'Style', id: 'style', icon: BrushIcon },
  { name: 'Attributes', id: 'attributes', icon: PencilRuler },
  { name: 'HTML', id: 'html', icon: Code2Icon },
];

const appProvider = useAppProvider();

const state = shallowReactive({
  isDragging: false,
  activeTab: 'style',
});

const containerRef = ref<HTMLDivElement>();

const selectedEl = ref<Element>();
const elSelector = shallowRef('');
const elStyleData = shallowRef<StyleDataItem | null>(null);
const elProperties = shallowRef<ElementProperties | null>(null);

function closeWindow() {
  elSelector.value = '';
  elProperties.value = null;
  elStyleData.value = null;
}
function checkPopupBound() {
  if (!containerRef.value) return;

  let x = lastPosition?.x ?? 0;
  let y = lastPosition?.y ?? 0;

  const containerRect = containerRef.value.getBoundingClientRect();

  if (x < 0) x = 0;
  else if (x + containerRect.width > window.innerWidth)
    x = window.innerWidth - containerRect.width;

  if (y < 0) y = 0;
  else if (y + containerRect.height > window.innerHeight)
    y = window.innerHeight - containerRect.height;

  updateWindowPosition(x, y);
}
function updateAppliedStyle(newValue: ElementAppliedStyleRules) {
  if (!elStyleData.value) return;

  const styleId = elStyleData.value.id;

  elStyleData.value.currentProps = newValue;

  appProvider.addDirtyStyleItem(styleId);
  appProvider.updateStyleItem(styleId, { currentProps: newValue });

  nextTick(() => {
    if (selectedEl.value)
      elProperties.value = getElProperties(selectedEl.value).getAll();
  });
}
function updateWindowPosition(x: number, y: number) {
  if (!containerRef.value) return;

  lastPosition = { x, y };
  containerRef.value.style.transform = `translate(${x}px, ${y}px)`;
}
function onSelectElement({
  el,
  properties,
}: EmitterEvents['content:el-selected']) {
  selectedEl.value = el;

  elSelector.value = finder(el, {
    className: () => false,
    attr: (name) => name === 'data-testid',
  });
  elProperties.value = properties;

  let styleData =
    Object.values(appProvider.styleData.items).find(
      (item) => item.elSelector === elSelector.value,
    ) || null;
  if (!styleData) {
    const appliedStyle = cssRulesUtils.getAppliedRules(el);
    styleData = appProvider.addStyleItem({
      initialProps: appliedStyle,
      elSelector: elSelector.value,
      basicSelector: elProperties.value.selector,
    });
  }
  elStyleData.value = styleData;

  nextTick(() => {
    let position = lastPosition;
    if (!position) {
      position = {
        y: 5,
        x: window.innerWidth - CONTAINER_WIDTH - 25,
      };
    }

    updateWindowPosition(position.x, position.y);
    checkPopupBound();
  });
}
const onWindowResize = debounce(() => {
  checkPopupBound();
}, 200);

watch(elProperties, (value) => {
  if (value) {
    if (listenedWindowResize) return;

    window.addEventListener('resize', onWindowResize);
    listenedWindowResize = true;
  } else {
    window.removeEventListener('resize', onWindowResize);
    listenedWindowResize = false;
  }
});

onMounted(() => {
  emitter.on('content:el-selected', onSelectElement);
  emitter.on('content:remove-selected', closeWindow);
});
onUnmounted(() => {
  cssRulesUtils.destroy();
  emitter.off('content:el-selected', onSelectElement);
  emitter.off('content:remove-selected', closeWindow);
  window.removeEventListener('resize', onWindowResize);
});
</script>
