<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    :width="size"
    :height="size"
    v-html="icon"
  >
  </svg>
</template>
<script>
import icons from '../../lib/icons';

export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    size: {
      type: [String, Number],
      default: 24,
    },
  },
  setup(props) {
    const icon = icons[props.name] || null;

    if (icon === null) {
      console.error(`${props.name} icon is not found`);
    }

    return {
      icon,
    };
  },
};
</script>
