<template>
	<div class="edit-attributes">
		<h3 class="mb-3 font-semibold">Edit Attributes</h3>
		<add-form 
			style="margin-bottom: 14px"
			v-model:key="state.key"
			v-model:value="state.value"
			@submit="addAttribute"
		></add-form>
		<p 
			class="text-light mt-6 text-center text-opacity-75" 
			v-show="Object.keys(state.attributes).length === 0"
		>
			There's no attribute that you can edit
		</p>
		<div
			class="flex items-center mb-3" 
			v-for="(value, key) in state.attributes" 
			v-bind="{ key }"
		>
			<p class="text-overflow w-4/12">{{ key }}</p>
			<input 
				type="text" 
				class="mx-2 w-7/12 bg-light px-3 py-2 rounded-md" 
				@change="updateAttribute($event.target.value, key)"
				:value="state.attributes[key]"
			/>
			<button class="w-1/12" title="Delete attribute" @click="deleteAttribute(key)">
				<v-mdi name="mdi-delete" class="text-danger"></v-mdi>
			</button>
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
		const blackListAttrs = ['class', 'id', 'style'];
		const state = reactive({
			attributes: {},
			key: '',
			value: '',
		});
		const init = () => {
			const target = document.querySelector('.active-element');

			if (!target) return;

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
  		if (state.key === '' || blackListAttrs.includes(state.key)) return;
  		
  		updateAttribute(state.value, state.key);
  		state.attributes[state.key] = state.value;
  		state.key = state.value = '';
  	}
  	const deleteAttribute = (key) => {
  		const activeElement = document.querySelector('.active-element');
  		activeElement.removeAttribute(key);
  		
  		delete state.attributes[key];
  	};

		watch(() => props.activeElementId, init);
    onMounted(init);

    return {
    	state,
    	addAttribute,
    	deleteAttribute,
    	updateAttribute,
    };
	},
};
</script>