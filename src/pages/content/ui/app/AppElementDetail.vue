<template>
  <div
    v-if="elProperties"
    ref="containerRef"
    class="fixed top-0 left-0 bg-background rounded-lg text-foreground border"
    :style="{ zIndex: CONTENT_ZINDEX.content, width: CONTAINER_WIDTH + 'px' }">
    <div
      class="text-center py-1 bg-muted/25 cursor-move text-muted-foreground px-4 flex items-center transition-colors w-full rounded-t-lg border-b"
      @pointerdown.self="startDragging">
      <div class="flex-grow"></div>
      <button
        class="hover p-1 rounded-sm hover:bg-muted/50 hover:text-foreground transition"
        @click="closeWindow">
        <XIcon class="h-5 w-5" />
      </button>
    </div>
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
      class="flex items-center border-b px-4 mt-1 text-muted-foreground space-x-1">
      <button
        v-for="item in tabItems"
        :key="item.id"
        :class="[
          'border-b-2 inline-flex items-center p-2 hover:text-foreground transition',
          item.id === state.activeTab
            ? 'border-primary text-foreground'
            : 'border-transparent',
        ]"
        @click="state.activeTab = item.id">
        <component :is="item.icon" class="h-4 w-4 mr-2" />
        {{ item.name }}
      </button>
    </div>
    <div style="max-height: calc(100vh - 200px)" class="overflow-auto">
      <DetailStyle
        :el-selector="elSelector"
        :properties="elProperties"
        :applied-style="elAppliedStyle!"
        @update:applied-style="elAppliedStyle = $event" />
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
} from 'vue';
import { emitter, EmitterEvents } from '@root/src/lib/mitt';
import CSSRulesUtils, {
  ElementAppliedStyleRules,
} from '@root/src/utils/CSSRulesUtils';
import {
  BrushIcon,
  CaseSensitiveIcon,
  PencilRuler,
  XIcon,
} from 'lucide-vue-next';
import { CONTENT_ZINDEX, EL_ATTR_NAME } from '@src/utils/constant';
import { ElementProperties } from '@root/src/utils/getElProperties';
import DetailStyle from './detail/DetailStyle.vue';
import UiElementSelector from '@root/src/pages/components/ui/UiElementSelector.vue';
import { finder } from '@medv/finder';

const CONTAINER_WIDTH = 350;

let lastPosition: { x: number; y: number } | null = null;

const cssRulesUtils = new CSSRulesUtils();
const tabItems = [
  { name: 'Style', id: 'style', icon: BrushIcon },
  { name: 'Attributes', id: 'attributes', icon: PencilRuler },
];

const state = shallowReactive({
  isDragging: false,
  activeTab: 'style',
});

const containerRef = ref<HTMLDivElement>();

const elSelector = shallowRef('');
const elProperties = shallowRef<ElementProperties | null>(null);
const elAppliedStyle = shallowRef<ElementAppliedStyleRules | null>(null);

function closeWindow() {
  elProperties.value = null;
  elAppliedStyle.value = null;
}
function updateWindowPosition(x: number, y: number) {
  if (!containerRef.value) return;

  lastPosition = { x, y };
  containerRef.value.style.transform = `translate(${x}px, ${y}px)`;
}
function startDragging(pointerDownEvent: PointerEvent) {
  if (!containerRef.value) return;

  const containerRect = containerRef.value.getBoundingClientRect();

  const offsetY = pointerDownEvent.clientY - containerRect.top;
  const offsetX = pointerDownEvent.clientX - containerRect.left;

  document.body.setAttribute(EL_ATTR_NAME.dragging, '');

  function pointerMoveHandler({ clientX, clientY }: PointerEvent) {
    const x = clientX - offsetX;
    const y = clientY - offsetY;

    if (
      x < 0 ||
      y < 0 ||
      x + containerRect.width > window.innerWidth ||
      y + containerRect.height > window.innerHeight
    )
      return;

    updateWindowPosition(x, y);
  }

  document.addEventListener('pointermove', pointerMoveHandler);
  document.addEventListener(
    'pointerup',
    () => {
      document.body.removeAttribute(EL_ATTR_NAME.dragging);
      document.removeEventListener('pointermove', pointerMoveHandler);
    },
    { once: true },
  );
}
function onSelectElement({
  el,
  properties,
}: EmitterEvents['content:el-selected']) {
  elSelector.value = finder(el, {
    className: () => false,
    attr: (name) => name === 'data-testid',
  });
  elProperties.value = properties;
  elAppliedStyle.value = cssRulesUtils.getAppliedRules(el);

  nextTick(() => {
    let position = lastPosition;
    if (!position) {
      position = {
        y: 5,
        x: window.innerWidth - CONTAINER_WIDTH - 25,
      };
    }

    updateWindowPosition(position.x, position.y);
  });
}

onMounted(() => {
  emitter.on('content:el-selected', onSelectElement);
});
onUnmounted(() => {
  cssRulesUtils.destroy();
  emitter.off('content:el-selected', onSelectElement);
});
</script>
