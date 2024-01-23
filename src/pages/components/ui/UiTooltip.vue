<template>
  <TooltipRoot v-bind="forward">
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>
    <TooltipContent
      :side="side"
      :align="align"
      :side-offset="sideOffset"
      class="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    >
      <slot name="content">{{ label }}</slot>
    </TooltipContent>
  </TooltipRoot>
</template>
<script setup lang="ts">
import {
  TooltipContent,
  TooltipRoot,
  type TooltipRootEmits,
  type TooltipRootProps,
  TooltipTrigger,
  useForwardPropsEmits,
  TooltipContentProps,
} from 'radix-vue';

interface Props
  extends TooltipRootProps,
    Pick<TooltipContentProps, 'align' | 'side' | 'sideOffset'> {
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  sideOffset: 5,
});
const emits = defineEmits<TooltipRootEmits>();

const forward = useForwardPropsEmits(props, emits);
</script>
