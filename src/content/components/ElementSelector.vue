<template>
  <div class="line-clamp font-semibold mb-1">
    <span class="text-danger">{{ selector.tag }}</span
    ><span class="text-primary">{{ selector.id }}</span
    ><span class="text-primary-light">{{ selector.classes }}</span>
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
