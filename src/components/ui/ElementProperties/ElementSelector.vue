<template>
  <div class="line-clamp font-semibold mb-1">
    <span class="text-red-500">
        {{ selector.tag }}
    </span>
    <span class="text-primary">
      {{ selector.id }}
    </span>
    <span class="text-blue-400">
      {{ selector.classes }}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    selector: {
      type: Object,
      default: () => ({
        tag: '',
        id: '',
        classes: '',
      }),
    },
  },
};
</script>
