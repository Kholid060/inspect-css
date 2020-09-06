<template>
  <div class="properties p-5" v-if="state.selected">
    <element-size :size="state.size" :selector="state.selector" :computedStyles="state.computedStyles" :show-info="false"></element-size>
    <div class="properties__css-code mt-4">
      <codeflask class="h-32" :code="state.appliedCSS.css" @change="onEditorChange"></codeflask>
    </div>
    <div class="px-3 py-2 bg-light rounded-lg mt-4" v-if="state.appliedCSS.hover">
      <p class="text-sm">:hover</p>
      <codeflask :code="state.appliedCSS.hover" readonly></codeflask>
    </div>
  </div>
</template>
<script>
import { watch, reactive, onMounted } from 'vue';
import debounce from 'lodash.debounce';
import getElementProperties from '~/utils/getElementProperties';
import getAppliedCSS from '~/utils/getAppliedCSS';
import ElementSize from '../ElementSize.vue';
import Codeflask from '../Codeflask.vue';

export default {
  components: { ElementSize, Codeflask },
  props: {
    activeElementId: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const state = reactive({
      size: {},
      selector: {},
      computedStyles: {},
      selected: false,
      appliedCSS: { css: '', hover: '' },
    });
    const onEditorChange = debounce(code => {
      if (typeof code !== 'string') return;

      const target = document.querySelector('.active-element');

      target.setAttribute('style', code);
    }, 400);
    const init = () => {
      const target = document.querySelector('.active-element');

      if (!target) return;

      const { size, selector, computedStyles } = getElementProperties(target);

      state.appliedCSS = getAppliedCSS(target);
      state.size = size;
      state.selector = selector;
      state.computedStyles = computedStyles;
      state.selected = true;
    };

    watch(() => props.activeElementId, init);
    onMounted(init);

    return {
      state,
      onEditorChange,
    };
  },
};
</script>
