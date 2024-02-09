<template>
  <PopoverRoot v-bind="forwarded">
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverContent
      :class="[
        'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        props.class,
      ]"
    >
      <slot />
    </PopoverContent>
  </PopoverRoot>
</template>
<script setup lang="ts">
import {
  PopoverRoot,
  useForwardPropsEmits,
  PopoverTrigger,
  PopoverContent,
} from 'radix-vue';
import type { PopoverRootEmits, PopoverRootProps } from 'radix-vue';

const props = defineProps<PopoverRootProps & { class?: string }>();
const emits = defineEmits<PopoverRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>
