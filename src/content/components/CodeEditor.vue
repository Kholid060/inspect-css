<template>
  <pre><code 
		:class="[`language-${language}`]" 
		:contenteditable="!disabled"
  	autocorrect="off"
  	autocapitalize="off"
  	spellcheck="false"
  	ref="code"></code></pre>
</template>
<script>
import { ref, onMounted, watch } from 'vue';
import Misbehave from 'misbehave';
import Prism from 'prismjs';

export default {
  props: {
    modelValue: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: 'css',
    },
  },
  setup(props, { emit }) {
    const code = ref(null);
    const editor = ref(null);

    onMounted(() => {
      code.value.innerText = props.modelValue;

      editor.value = new Misbehave(code.value, {
        oninput: () => Prism.highlightElement(code.value),
      });
    });

    watch(
      () => props.modelValue,
      value => {
        console.log(value);
      }
    );

    return {
      code,
    };
  },
};
</script>
