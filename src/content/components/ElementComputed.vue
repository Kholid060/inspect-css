<template>
  <div class="px-10 py-8 bg-primary bg-opacity-25 rounded-lg relative mb-2 text-sm">
    <span class="absolute left-0 top-0 ml-2 mt-1 text-sm">{{ title }}</span>
    <span v-for="direction in directions" :key="direction" :class="[direction, isVertical(direction) ? 'horizontal-center' : 'vertical-center']" :style="{ [direction]: '5px' }">
      {{ computedStyles[`${title}-${direction}`] }}
    </span>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    computedStyles: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    return {
      directions: ['top', 'right', 'bottom', 'left'],
      isVertical: direction => direction === 'top' || direction === 'bottom',
    };
  },
};
</script>
