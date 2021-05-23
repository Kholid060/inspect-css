<template>
  <component
    :is="tag"
    role="button"
    class="ui-button relative transition"
    :class="[
      color ? color : variants[variant],
      icon ? 'p-2' : 'py-2 px-4',
      circle ? 'rounded-full' : 'rounded-lg',
      { 'opacity-70': disabled, 'pointer-events-none': disabled },
    ]"
    v-bind="{ disabled: disabled, ...$attrs }"
  >
    <span class="flex justify-center h-full items-center">
      <slot></slot>
    </span>
    <div v-if="loading" class="vertical-center horizontal-center">
      <ui-spinner :color="variant === 'default' ? 'text-primary' : 'text-white'"></ui-spinner>
    </div>
  </component>
</template>
<script>
export default {
  props: {
    icon: Boolean,
    disabled: Boolean,
    circle: Boolean,
    loading: Boolean,
    color: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: 'button',
    },
    variant: {
      type: String,
      default: 'default',
    },
  },
  setup() {
    const variants = {
      default: 'bg-gray-100 bg-opacity-5 hover:bg-opacity-10 hover:bg-white',
      primary: 'bg-primary text-white hover:bg-blue-600',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    return {
      variants,
    };
  },
};
</script>
