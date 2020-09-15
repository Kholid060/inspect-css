<template>
  <button class="focus:outline-none" :class="[active ? 'text-primary' : 'text-light']">
    <v-mdi class="transition-all duration-200 ease" :rotate="rotate" :name="icon" :size="iconSize"></v-mdi>
  </button>
</template>
<script>
export default {
  props: {
    icon: String,
    active: Boolean,
    rotate: {
      type: Number,
      default: 0,
    },
    iconSize: {
      type: [String, Number],
      default: '24',
    },
  },
};
</script>
