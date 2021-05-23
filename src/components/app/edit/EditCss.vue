<template>
  <div>
    <p class="px-4 mb-4">Custom Global CSS</p>
    <ui-prism-editor style="padding: 0" v-model="code"></ui-prism-editor>
  </div>
</template>
<script>
import { watch, onMounted, ref } from 'vue';
import { debounce } from '@/utils/helper';

export default {
  setup() {
    const code = ref('');

    watch(
      code,
      debounce((value) => {
        if (typeof value !== 'string') return;

        const style = document.getElementById('custom-global-css');

        style.innerText = value;
      }, 250),
    );

    onMounted(() => {
      const styleEl = document.getElementById('custom-global-css');

      if (styleEl) {
        code.value = styleEl.innerText;

        return;
      }

      const style = document.createElement('style');
      style.id = 'custom-global-css';

      document.body.appendChild(style);
    });

    return {
      code,
    };
  },
};
</script>
