<template>
  <div
    class="text-center py-1 bg-muted/25 gap-2 cursor-move text-muted-foreground px-4 flex items-center transition-colors w-full rounded-t-lg border-b"
    @pointerdown.self="startDragging"
  >
    <GripHorizontalIcon
      class="h-5 w-5 text-muted-foreground opacity-50 pointer-events-none"
    />
    <div class="flex-grow"></div>
    <button
      class="hover h-8 w-8 inline-flex justify-center items-center rounded-sm hover:bg-muted/50 hover:text-foreground transition"
      @click="emits('closeWindow')"
    >
      <XIcon class="h-5 w-5" />
    </button>
  </div>
</template>
<script setup lang="ts">
import { EL_ATTR_NAME, SESSION_STORAGE_KEY } from '@root/src/utils/constant';
import { XIcon, GripHorizontalIcon } from 'lucide-vue-next';

interface Props {
  selectedEl?: Element;
  containerEl?: Element;
  lastPosition: null | { x: number; y: number };
}

const props = withDefaults(defineProps<Props>(), {
  selectedEl: undefined,
  containerEl: undefined,
  lastPosition: () => ({ x: 0, y: 0 }),
});
const emits = defineEmits<{
  (e: 'closeWindow'): void;
  (e: 'updateWindowPos', x: number, y: number): void;
}>();

function startDragging(pointerDownEvent: PointerEvent) {
  if (!props.containerEl) return;

  const containerRect = props.containerEl.getBoundingClientRect();

  const offsetY = pointerDownEvent.clientY - containerRect.top;
  const offsetX = pointerDownEvent.clientX - containerRect.left;

  document.body.setAttribute(EL_ATTR_NAME.dragging, '');

  let popupPosition = props.lastPosition;

  function pointerMoveHandler({ clientX, clientY }: PointerEvent) {
    let x = clientX - offsetX;
    let y = clientY - offsetY;

    if (x < 0) x = 0;
    else if (x + containerRect.width > window.innerWidth)
      x = window.innerWidth - containerRect.width;

    if (y < 0) y = 0;
    else if (y + containerRect.height > window.innerHeight)
      y = window.innerHeight - containerRect.height;

    emits('updateWindowPos', x, y);
    popupPosition = { x, y };
  }

  document.addEventListener('pointermove', pointerMoveHandler);
  document.addEventListener(
    'pointerup',
    () => {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY.elPropsPosition,
        JSON.stringify(popupPosition),
      );
      document.body.removeAttribute(EL_ATTR_NAME.dragging);
      document.removeEventListener('pointermove', pointerMoveHandler);
    },
    { once: true },
  );
}
</script>
