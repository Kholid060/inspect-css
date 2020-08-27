<template>
  <div class="properties" v-if="state.selected">
    <element-size 
    	:size="state.size" 
    	:selector="state.selector" 
    	:computedStyles="state.computedStyles" 
    	:show-info="false"
    ></element-size>
    <css-editor
    	@change:key="onEditorKeyChange" 
      @change:value="onEditorValueChange" 
    	@blur:value="onValueBlur"
    	@add="onAddProperty"
      class="mt-4"
    	:css="state.appliedCSS.css"
    ></css-editor>
    <div class="px-3 py-2 bg-light rounded-lg mt-4" v-if="state.appliedCSS.hover.length !== 0">
      <p>:hover</p>
      <css-editor
        :css="state.appliedCSS.hover"
        readonly
      ></css-editor>
    </div>
  </div>
</template>
<script>
import { watch, reactive, onMounted } from 'vue';
import CssEditor from './CssEditor.vue';
import ElementSize from '../ElementSize.vue';
import getElementProperties, { computedStyleKeys } from '~/utils/getElementProperties';
import getAppliedCSS from '~/utils/getAppliedCSS';

export default {
  components: { ElementSize, CssEditor },
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
      appliedCSS: { css: [], hover: [] },
    });
    const findDuplicateKey = (key) => state.appliedCSS.css.findIndex((style) => style.key === key);
    const onEditorKeyChange = ({ value, index }) => {
      const activeElement = document.querySelector('.active-element');
      const styles = state.appliedCSS.css;
      const currentEdit = styles[index];
      const newKey = value.replace(/\s/g, '');
      const duplicateIndex = findDuplicateKey(newKey);

      if (newKey === '') {
        state.appliedCSS.css.splice(index, 1);
      } else if (duplicateIndex !== -1) {
        activeElement.style[currentEdit.key] = null;
        state.appliedCSS.css[index] = {
          key: newKey,
          value: currentEdit.value,
        };
        state.appliedCSS.css.splice(duplicateIndex, 1);
      } else if (currentEdit.key !== value) {
        activeElement.style[currentEdit.key] = null;
      }

      activeElement.style[value] = currentEdit.value;
      state.appliedCSS.css[index].key = newKey;
    };
    const onEditorValueChange = ({ value, index, change }) => {
      const styles = state.appliedCSS.css;
      const currentEdit = styles[index];
      const activeElement = document.querySelector('.active-element');

      state.appliedCSS.css[index].value = value;
      activeElement.style[currentEdit.key] = currentEdit.value;

      const matchKeyword = [...computedStyleKeys, 'height', 'width'].indexOf(currentEdit.key);
      if (matchKeyword) {
        const { computedStyles, size } = getElementProperties(activeElement);

        state.computedStyles = computedStyles;
        state.size = size;
      }
    };
    const onAddProperty = ({ key, value }) => {
    	const duplicateIndex = findDuplicateKey(key);

    	if (duplicateIndex !== -1) {
    		state.appliedCSS.css[duplicateIndex].value = value;
    	} else {
    		state.appliedCSS.css.push({ key, value });
    	}

    	const activeElement = document.querySelector('.active-element');
      activeElement.style[key] = value;
    };
    const onValueBlur = ({ index, value }) => {
    	if (value === '') {
    		state.appliedCSS.css.splice(index, 1);
    	}
    };
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
      onValueBlur,
      onAddProperty,
      onEditorKeyChange,
      onEditorValueChange,
    };
  },
};
</script>
