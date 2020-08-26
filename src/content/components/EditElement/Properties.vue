<template>
  <div class="properties">
  	<h3>Element Properties</h3>
    <template v-if="state.selected">
      <element-size 
      	:size="state.size" 
      	:selector="state.selector" 
      	:computedStyles="state.computedStyles" 
      	:show-info="false"
      ></element-size>
      <css-editor
      	@change="onEditorChange" 
      	@add="onAddProperty"
      	@blur:value="onValueBlur"
      	:css="state.appliedCSS.css"
      ></css-editor>
      <div class="hover-css" v-if="state.appliedCSS.hover.length !== 0">
        <p>:hover</p>
        <css-editor class="hover" :css="state.appliedCSS.hover" readonly></css-editor>
      </div>
    </template>
  </div>
</template>
<script>
import { watch, reactive } from 'vue';
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
    const onEditorChange = ({ value, index, change }) => {
      if (typeof change === 'undefined') return;

      const styles = state.appliedCSS.css;
      const currentEdit = styles[index];

      if (change === 'key') {
        const newKey = value.replace(/\s/g, '');
        const duplicateIndex = findDuplicateKey(newKey);

        if (newKey === '') {
          state.appliedCSS.css.splice(index, 1);
        } else if (duplicateIndex !== -1) {
          state.appliedCSS.css[index] = {
            key: newKey,
            value: currentEdit.value,
          };
          state.appliedCSS.css.splice(duplicateIndex, 1);
        } else {
          state.appliedCSS.css[index].key = newKey;
        }
      } else if (change === 'value') {
        state.appliedCSS.css[index].value = value;
      }

      const activeElement = document.querySelector('.active-element');
      activeElement.style[styles[index].key] = currentEdit.value;

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

    watch(() => props.activeElementId, () => {
    	const target = document.querySelector('.active-element');

    	if (!target) return;

    	const { size, selector, computedStyles } = getElementProperties(target);

      state.appliedCSS = getAppliedCSS(target);
      state.size = size;
      state.selector = selector;
      state.computedStyles = computedStyles;
      state.selected = true;
    });

    return {
      state,
      onValueBlur,
      onAddProperty,
      onEditorChange,
    };
  },
};
</script>
