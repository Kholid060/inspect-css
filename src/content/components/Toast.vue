<template>
  <div class="toast left-0 top-0 p-5 w-full absolute text-center" ref="toast">
    <div v-if="modelValue" class="toast-content shadow-xl inline-block bg-primary rounded-md px-4 py-2">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { ref, watch } from 'vue';

export default {
  props: {
    modelValue: Boolean,
    duration: {
      type: Number,
      default: 1500,
    },
  },
  setup(props, { emit }) {
    const toast = ref(null);

    watch(
      () => props.modelValue,
      value => {
        if (value) {
          setTimeout(() => {
            toast.value.classList.add('open');
          }, 100);
          setTimeout(() => {
            toast.value.classList.remove('open');
            setTimeout(() => {
              emit('update:modelValue', false);
            }, 200);
          }, props.duration + 100);
        }
      }
    );

    return {
      toast,
    };
  },
};
</script>
