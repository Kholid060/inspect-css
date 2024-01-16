<template>
  <Teleport to="body">
    <div
      v-if="!appProvider?.state.paused"
      ref="overlayRef"
      :style="{
        zIndex: CONTENT_ZINDEX.overlay,
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100%',
        width: '100%',
      }" />
  </Teleport>
  <div
    v-show="elProperties"
    ref="containerRef"
    :style="{ ...floatingStyles, zIndex: CONTENT_ZINDEX.content }"
    class="w-72 overflow-auto bg-background text-foreground p-4 rounded-lg border">
    <UiElementProperties v-if="elProperties" :properties="elProperties" />
    <p class="text-sm mt-4 leading-tight text-muted-foreground">
      Click or press
      <kbd class="kbd text-xs">{{ IS_MAC_OS ? '⌘' : 'Ctrl' }}</kbd> +
      <kbd class="kbd text-xs">Space</kbd> to edit element
    </p>
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

const IS_MAC_OS = navigator.userAgent.indexOf('Mac OS X') !== -1;

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
function handlePointerMove({ clientX, clientY }: PointerEvent) {
  if (
    appProvider.state.paused ||
    document.body.hasAttribute(EL_ATTR_NAME.dragging)
  )
    return;

  floatingReference.value = {
    getBoundingClientRect: generateBoundingClientRect(clientX, clientY),
  };

  const { 1: target } = document.elementsFromPoint(clientX, clientY);
  if (overlayRef.value === target) {
    previousSelectedEl?.removeAttribute(EL_ATTR_NAME.hover);
    previousSelectedEl = null;
    elProperties.value = null;
    return;
  }

  if (!target || target === previousSelectedEl) return;

  target.setAttribute(EL_ATTR_NAME.hover, 'false');
  previousSelectedEl?.removeAttribute(EL_ATTR_NAME.hover);

  elProperties.value = getElProperties(target).getAll();

  previousSelectedEl = target;
}
function handleKeyDown(event: KeyboardEvent) {
  if (
    appProvider?.state.paused ||
    document.activeElement === appProvider.shadowRoot.host
  )
    return;

  const { code } = event;
  if (code !== 'Space' || !previousSelectedEl) return;

  event.preventDefault();
  event.stopPropagation();

  selectElement(previousSelectedEl);
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
