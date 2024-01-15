<template>
  <div
    v-if="!appProvider?.state.paused"
    style="z-index: 999998"
    class="overlay fixed top-0 left-0 h-full w-full" />
  <div
    v-show="elProperties"
    ref="containerRef"
    :style="{ ...floatingStyles, zIndex: 999999 }"
    class="w-72 overflow-auto bg-background text-foreground p-4 rounded-lg">
    <UiElementProperties v-if="elProperties" :properties="elProperties" />
    <p class="text-sm mt-4 leading-tight text-muted-foreground">
      Click or press
      <kbd class="kbd text-xs">{{ IS_MAC_OS ? '⌘' : 'Ctrl' }}</kbd> +
      <kbd class="kbd text-xs">Space</kbd> to edit element
    </p>
  </div>
</template>
<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { APP_PROVIDER_KEY } from '../keys';
import { emitter } from '@src/lib/mitt';
import { generateBoundingClientRect } from '@root/src/utils/helper';
import { AppStateProvider } from '@root/src/interfaces/app.interface';
import { ClientRectObject, flip, offset, useFloating } from '@floating-ui/vue';
import { SELECTED_EL_ATTR_NAME } from '@root/src/utils/constant';
import getElProperties, {
  ElementProperties,
} from '@root/src/utils/getElProperties';
import UiElementProperties from '@root/src/pages/components/ui/UiElementProperties.vue';

const IS_MAC_OS = navigator.userAgent.indexOf('Mac OS X') !== -1;

const appProvider = inject<AppStateProvider>(APP_PROVIDER_KEY);

const containerRef = ref<HTMLDivElement | null>(null);
const elProperties = shallowRef<ElementProperties | null>(null);
const floatingReference = shallowRef<{
  getBoundingClientRect: () => ClientRectObject;
}>();

const { floatingStyles } = useFloating(floatingReference, containerRef, {
  placement: 'bottom-start',
  middleware: [offset(10), flip()],
});

let previousSelectedEl: Element | null = null;

function selectElement(element: Element) {
  emitter.emit('content:el-selected', element);
}
function handlePointerMove({ clientX, clientY }: PointerEvent) {
  if (appProvider?.state.paused) return;

  floatingReference.value = {
    getBoundingClientRect: generateBoundingClientRect(clientX, clientY),
  };

  const { 1: target } = document.elementsFromPoint(clientX, clientY);
  if (!target || target === previousSelectedEl) return;

  target.setAttribute(SELECTED_EL_ATTR_NAME, 'false');
  previousSelectedEl?.removeAttribute(SELECTED_EL_ATTR_NAME);

  elProperties.value = getElProperties(target).getAll();

  previousSelectedEl = target;
}
function handleKeyDown(event: KeyboardEvent) {
  if (appProvider?.state.paused) return;

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

  previousSelectedEl = null;
});
</script>
