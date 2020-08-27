<template>
	<div class="edit-attributes">
		<h3 class="content-title">Edit Attributes</h3>
		<add-form 
			style="margin-bottom: 14px"
			v-model:key="state.key"
			v-model:value="state.value"
			@submit="addAttribute"
		></add-form>
		<div
			class="attribute" 
			v-for="(value, key) in state.attributes" 
			v-bind="{ key }"
		>
			<p class="attribute__key text-overflow">{{ key }}</p>
			<input 
				type="text" 
				class="attribute__value" 
				@change="updateAttribute($event.target.value, key)"
				:value="state.attributes[key]"
			/>
		</div>
	</div>
</template>
<script>
import { watch, onMounted, reactive } from 'vue';
import debounce from 'lodash.debounce';
import AddForm from '../AddForm.vue';

export default {
	components: { AddForm },
	props: {
		activeElementId: Number,
	},
	setup(props) {
		const state = reactive({
			attributes: {},
			key: '',
			value: '',
		});
		const init = () => {
			const target = document.querySelector('.active-element');

			if (!target) return;

			const blackListAttrs = ['class', 'id', 'style'];
			const attributes = Array.from(target.attributes).reduce((attrs, { name, value }) => {
				if (blackListAttrs.includes(name)) return attrs;
			
				attrs[name] = value;

				return attrs;
			}, {});
			state.attributes = attributes;
		};
		const updateAttribute = debounce((value, key) => {
  		const activeElement = document.querySelector('.active-element');

  		activeElement.setAttribute(key, value);
  	}, 400);
  	const addAttribute = () => {
  		if (state.key === '') return;
  		
  		updateAttribute(state.value, state.key);
  		state.attributes[state.key] = state.value;
  		state.key = state.value = '';
  	}

		watch(() => props.activeElementId, init);
    onMounted(init);

    return {
    	state,
    	addAttribute,
    	updateAttribute,
    };
	},
};
</script>