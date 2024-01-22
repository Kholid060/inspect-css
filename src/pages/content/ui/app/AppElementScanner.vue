<template>
  <Teleport to="body">
    <div
      v-if="!appProvider.state.paused && !appProvider.state.interactive"
      ref="overlayRef"
      :style="{
        zIndex: CONTENT_ZINDEX.overlay,
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100%',
        width: '100%',
      }"
    />
  </Teleport>
  <div
    v-show="elProperties"
    ref="containerRef"
    :style="{ ...floatingStyles, zIndex: CONTENT_ZINDEX.content }"
    class="w-72 overflow-auto bg-background text-foreground rounded-xl border"
  >
    <!-- <ScannerNavigation ref="scannerNavigation" @select="hoverElement" /> -->
    <div class="p-4">
      <UiElementProperties v-if="elProperties" :properties="elProperties" />
      <table class="text-xs mt-2 w-full text-muted-foreground">
        <tr class="py-1">
          <td><kbd class="kbd">Space</kbd> / <kbd class="kbd">Click</kbd></td>
          <td>Select element</td>
        </tr>
        <tr class="py-1">
          <td>
            <kbd class="kbd">Arrow keys</kbd>
          </td>
          <td>Navigate element</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { emitter } from '@src/lib/mitt';
import { CONTENT_ZINDEX, EL_ATTR_NAME } from '@src/utils/constant';
import { generateBoundingClientRect } from '@root/src/utils/helper';
import { ClientRectObject, flip, offset, useFloating } from '@floating-ui/vue';
import getElProperties, {
  ElementProperties,
} from '@root/src/utils/getElProperties';
import UiElementProperties from '@root/src/pages/components/ui/UiElementProperties.vue';
import { useAppProvider } from '../app-plugin';
import ScannerNavigation from './scanner/ScannerNavigation.vue';

const NAVIGATION_KEY_MAP = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
} as const;

const scannerNavigation = ref<InstanceType<typeof ScannerNavigation> | null>(
  null,
);

const appProvider = useAppProvider();

const overlayRef = ref<HTMLDivElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

const elProperties = shallowRef<ElementProperties | null>(null);
const floatingReference = shallowRef<{
  getBoundingClientRect: () => ClientRectObject;
}>();

const { floatingStyles } = useFloating(floatingReference, containerRef, {
  placement: 'bottom-start',
  middleware: [offset(10), flip()],
});

let selectedEl: Element | null = null;
let previousSelectedEl: Element | null = null;

function selectElement(element: Element) {
  selectedEl?.removeAttribute(EL_ATTR_NAME.selected);

  selectedEl = element;
  selectedEl.setAttribute(EL_ATTR_NAME.selected, 'true');

  emitter.emit('content:el-selected', {
    el: element,
    properties: elProperties.value!,
  });
}
function hoverElement(element: Element, updateNavigation = false) {
  if (element === previousSelectedEl) return;

  element.setAttribute(EL_ATTR_NAME.hover, '');
  previousSelectedEl?.removeAttribute(EL_ATTR_NAME.hover);

  if (updateNavigation) scannerNavigation.value?.updateNavigation(element);

  elProperties.value = getElProperties(element).getAll();
  previousSelectedEl = element;
}
function handlePointerMove({
  clientX,
  clientY,
  target: eventTarget,
}: PointerEvent) {
  if (
    appProvider.state.paused ||
    appProvider.state.tempHide ||
    document.body.hasAttribute(EL_ATTR_NAME.dragging)
  )
    return;

  floatingReference.value = {
    getBoundingClientRect: generateBoundingClientRect(clientX, clientY),
  };

  let target: Element;
  if (appProvider.state.interactive) {
    target = eventTarget as Element;
  } else {
    target = document.elementsFromPoint(clientX, clientY)[1];
  }

  if (
    !target ||
    overlayRef.value === target ||
    appProvider.shadowRoot.host === target
  ) {
    previousSelectedEl?.removeAttribute(EL_ATTR_NAME.hover);
    previousSelectedEl = null;
    elProperties.value = null;
    return;
  }

  if (target === previousSelectedEl) return;

  hoverElement(target, true);
}
function handleKeyDown(event: KeyboardEvent) {
  if (
    appProvider?.state.paused ||
    document.activeElement === appProvider.shadowRoot.host
  )
    return;

  switch (event.code) {
    case 'Space': {
      if (previousSelectedEl) {
        event.preventDefault();
        event.stopPropagation();

        selectElement(previousSelectedEl);
      }
      break;
    }
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      event.preventDefault();
      event.stopPropagation();
      scannerNavigation.value?.navigate(NAVIGATION_KEY_MAP[event.code]);
      break;
    default:
      break;
  }
}
function handleClick() {
  if (!previousSelectedEl) return;

  selectElement(previousSelectedEl);
}

onMounted(() => {
  window.addEventListener('click', handleClick);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('pointermove', handlePointerMove);
});
onUnmounted(() => {
  window.removeEventListener('click', handleClick);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('pointermove', handlePointerMove);

  selectedEl?.removeAttribute(EL_ATTR_NAME.selected);
  previousSelectedEl?.removeAttribute(EL_ATTR_NAME.hover);

  selectedEl = null;
  previousSelectedEl = null;
});
</script>
