<template>
  <div class="px-10 py-8 bg-primary/25 rounded-lg relative text-sm">
    <span
      class="absolute left-0 top-0 ml-2 mt-1 text-xs text-muted-foreground"
      >{{ title }}</span
    >
    <span
      v-for="direction in DIRECTIONS"
      :key="direction"
      :class="[
        direction,
        direction === 'top' || direction === 'bottom'
          ? 'horizontal-center'
          : 'vertical-center',
      ]"
      :style="{ [direction]: '5px' }"
    >
      {{ computedStyles[`${title}-${direction}`] }}
    </span>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
interface Props {
  title: 'padding' | 'margin';
  computedStyles: Record<string, string | number>;
}

withDefaults(defineProps<Props>(), {
  title: 'padding',
  computedStyles: () => ({}),
});

const DIRECTIONS = ['top', 'right', 'bottom', 'left'] as const;
</script>
