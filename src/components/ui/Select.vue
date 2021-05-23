<template>
  <select
    class="bg-gray-100 bg-opacity-5 px-4 py-2 rounded-lg hover:bg-opacity-10 hover:bg-white"
    :value="modelValue"
    @change="emitValue"
  >
    <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
    <slot></slot>
  </select>
</template>
<script>
export default {
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    block: Boolean,
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    function emitValue({ target }) {
      emit('update:modelValue', target.value);
      emit('change', target.value);
    }

    return {
      emitValue,
    };
  },
};
</script>
