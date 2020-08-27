<template>
  <div class="css-editor">
    <add-form 
      v-if="!readonly"
      v-model:key="state.key" 
      v-model:value="state.value" 
      @submit="submitForm"
      class="mb-1"
    ></add-form>
    <div class="css-editor__properties scroll" v-if="css.length !== 0">
	    <div 
	    	class="css-editor__property" 
	    	v-for="(property, index) in css" 
	    	:key="property.key + index"
	    >
	      <span 
	      	@blur="handleChange($event, index, 'key')" 
	      	:contenteditable="!readonly" 
	      	class="css-editor__css-key"
	      >
	        {{ property.key }}
	      </span>
	      <span class="css-editor__separator">:</span>
	      <span
	      	v-if="isValidColor(property)" 
	      	class="css-editor__color-preview h-3 w-3 inline-block border mr-1" 
	      	:style="{ backgroundColor: property.value }"
	      ></span>
	      <span 
	      	@input="handleChange($event, index, 'value')" 
	      	@blur="onValueBlur($event, index)"
	      	:contenteditable="!readonly" 
	      	class="css-editor__css-value"
	      >
	        {{ property.value }}
	      </span>
	      <span class="css-editor__semicolon">;</span>
	    </div>
	  </div>
  </div>
</template>
<script>
import { shallowReactive } from 'vue';
import validateColor from 'validate-color';
import AddForm from '../AddForm.vue';

export default {
  components: { AddForm },
  props: {
    css: {
      type: Array,
      default: [],
    },
    readonly: Boolean,
  },
  setup(props, { emit }) {
    const state = shallowReactive({ key: '', value: '' });

    return {
    	state,
      isValidColor: ({ key, value }) => {
        const keywords = ['color', 'background'];
        const matchKeyword = keywords.some(keyword => key.match(keyword));

        if (matchKeyword) {
        	if (value.startsWith('var')) return true;

        	return validateColor(value);
        };

        return false;
      },
      handleChange: (event, index, change) => {
        const value = event.path[0].innerText;

        if (props.css[index][change] === value) return;

        emit(`change:${change}`, { value, index });
      },
      submitForm: () => {
      	if (state.key === '' || state.value === '') return;

      	emit('add', state);
      	state.key = '';
      	state.value = '';
      },
      onValueBlur: ({ path }, index) => {
      	const value = path[0].innerText;

      	emit('blur:value', { index, value });
      },
    };
  },
};
</script>
