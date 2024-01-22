<template>
  <div
    v-if="elProperties"
    ref="containerRef"
    class="fixed top-0 left-0 bg-background rounded-xl text-foreground border"
    :style="{ zIndex: CONTENT_ZINDEX.content, width: CONTAINER_WIDTH + 'px' }"
  >
    <div
      class="text-center py-1 bg-muted/25 cursor-move text-muted-foreground px-4 flex items-center transition-colors w-full rounded-t-lg border-b"
      @pointerdown.self="startDragging"
    >
      <div class="flex-grow"></div>
      <button
        class="hover p-1 rounded-sm hover:bg-muted/50 hover:text-foreground transition"
        @click="closeWindow"
      >
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
    <div style="max-height: calc(100vh - 200px)" class="overflow-auto">
      <KeepAlive>
        <DetailStyle
          v-if="state.activeTab === 'style' && elAppliedStyle"
          :el-selector="elSelector"
          :properties="elProperties"
          :applied-style="elAppliedStyle"
          @update:applied-style="updateAppliedStyle"
        />
        <DetailAttributes
          v-else-if="state.activeTab === 'attributes' && selectedEl"
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
  XIcon,
} from 'lucide-vue-next';
import {
  CONTENT_ZINDEX,
  EL_ATTR_NAME,
  SESSION_STORAGE_KEY,
} from '@src/utils/constant';
import getElProperties, {
  ElementProperties,
} from '@root/src/utils/getElProperties';
import DetailStyle from './detail/DetailStyle.vue';
import UiElementSelector from '@root/src/pages/components/ui/UiElementSelector.vue';
import { finder } from '@medv/finder';
import DetailAttributes from './detail/DetailAttributes.vue';
import { debounce, parseJSON } from '@root/src/utils/helper';

interface WindowPosition {
  x: number;
  y: number;
}

const CONTAINER_WIDTH = 350;

let lastPosition: WindowPosition | null = parseJSON(
  sessionStorage.getItem(SESSION_STORAGE_KEY.elPropsPosition) ?? '',
  null,
);

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

const selectedEl = ref<Element>();
const elSelector = shallowRef('');
const elProperties = shallowRef<ElementProperties | null>(null);
const elAppliedStyle = shallowRef<ElementAppliedStyleRules | null>(null);

function closeWindow() {
  elProperties.value = null;
  elAppliedStyle.value = null;
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
  elAppliedStyle.value = newValue;

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
function startDragging(pointerDownEvent: PointerEvent) {
  if (!containerRef.value) return;

  const containerRect = containerRef.value.getBoundingClientRect();

  const offsetY = pointerDownEvent.clientY - containerRect.top;
  const offsetX = pointerDownEvent.clientX - containerRect.left;

  document.body.setAttribute(EL_ATTR_NAME.dragging, '');

  function pointerMoveHandler({ clientX, clientY }: PointerEvent) {
    let x = clientX - offsetX;
    let y = clientY - offsetY;

    if (x < 0) x = 0;
    else if (x + containerRect.width > window.innerWidth)
      x = window.innerWidth - containerRect.width;

    if (y < 0) y = 0;
    else if (y + containerRect.height > window.innerHeight)
      y = window.innerHeight - containerRect.height;

    updateWindowPosition(x, y);
  }

  document.addEventListener('pointermove', pointerMoveHandler);
  document.addEventListener(
    'pointerup',
    () => {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY.elPropsPosition,
        JSON.stringify(lastPosition),
      );
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
  selectedEl.value = el;

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
    checkPopupBound();
  });
}
const onWindowResize = debounce(() => {
  checkPopupBound();
}, 200);

watch(elProperties, (value) => {
  if (value) {
    window.addEventListener('resize', onWindowResize);
  } else {
    window.removeEventListener('resize', onWindowResize);
  }
});

onMounted(() => {
  emitter.on('content:el-selected', onSelectElement);
});
onUnmounted(() => {
  cssRulesUtils.destroy();
  window.removeEventListener('resize', onWindowResize);
  emitter.off('content:el-selected', onSelectElement);
});
</script>
