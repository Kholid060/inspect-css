<template>
  <div ref="editorEl" :style="{ height, width }"></div>
</template>
<script>
import { onMounted, ref, watch, toRef } from 'vue';
import CodeFlask from 'codeflask';

export default {
  props: {
    height: [String, Number],
    width: [String, Number],
    code: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'text/css',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const editor = ref(null);
    const editorEl = ref(null);

    watch(toRef(props, 'code'), value => {
      editor.value.updateCode(value);
    });

    onMounted(() => {
      const { shadowRoot } = document.querySelector('.inspector');

      editor.value = new CodeFlask(editorEl.value, {
        language: props.language,
        readonly: props.readonly,
        styleParent: shadowRoot,
      });
      editor.value.updateCode(props.code);
      editor.value.onUpdate(value => {
        emit('update:code', value);
        emit('change', value);
      });
      editor.value.elTextarea.placeholder = 'Your code here';
    });

    return {
      editorEl,
    };
  },
};
</script>
