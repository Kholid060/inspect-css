<template>
  <button class="focus:outline-none" :class="[active ? 'text-primary' : 'text-light']">
    <v-mdi :name="icon" :size="iconSize"></v-mdi>
  </button>
</template>
<script>
export default {
  props: {
    icon: String,
    active: Boolean,
    iconSize: {
      type: [String, Number],
      default: '24',
    },
  },
};
</script>
