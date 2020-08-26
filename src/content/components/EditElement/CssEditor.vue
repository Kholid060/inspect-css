<template>
  <div class="css-editor">
    <form 
    	autocomplete="off"
    	@submit.prevent="submitForm" 
    	v-if="!readonly" 
    	class="css-editor__add-property"
    >
      <input 
      	type="text" 
      	class="css-editor__css-key" 
      	name="key" 
      	placeholder="Key"
      	v-model="state.key"
      />
      <input 
      	type="text"
      	name="value"
      	class="css-editor__css-value" 
      	placeholder="Value" 
      	v-model="state.value"
      />
      <button>
      	<v-mdi name="mdi-plus"></v-mdi>
      </button>
    </form>
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
	      	class="css-editor__color-preview" 
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
import validateColor from 'validate-color';
import { shallowReactive } from 'vue';

export default {
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

        emit('change', { value, index, change });
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
