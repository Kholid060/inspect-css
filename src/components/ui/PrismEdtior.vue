<template>
  <prism-editor
    @update:model-value="emitChange"
    v-bind="$attrs"
    line-numbers
    :model-value="modelValue"
    :highlight="highlighter"
    class="my-editor rounded-lg scroll"
  ></prism-editor>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import { highlight, languages } from 'prismjs';

export default {
  components: { PrismEditor },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    function highlighter(code) {
      return highlight(code, languages.css);
    }
    function emitChange(value) {
      emit('change', value);
      emit('update:modelValue', value);
    }

    return {
      emitChange,
      highlighter,
    };
  },
};
</script>
