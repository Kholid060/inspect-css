<template>
	<div class="p-5 bg-default flex rounded-lg mb-4">
		<div class="flex-1">
			<button-icon 
				v-for="item in menu"
				:key="item.name"
				:icon="item.icon"
				:active="item.name === modelValue" 
				@click="emitValue(item.name)"
				class="mr-4"
				:title="item.title"
			></button-icon>	
		</div>
		<v-mdi 
			@click="closeExtension" 
			name="mdi-close"
			size="22"
			class="cursor-pointer hover:text-danger"
		></v-mdi>
	</div>
</template>
<script>
import emitter from 'tiny-emitter/instance';
import ButtonIcon from './ButtonIcon.vue';

export default {
	components: { ButtonIcon },
	props: {
		menu: Array,
		modelValue: {
			type: String,
			default: 'properties',
		},
	},
	setup(props, { emit }) {
		return {
			emitValue: (name) => {
				emit('update:modelValue', name);
			},
			closeExtension: () => {
				emitter.emit('extension-close', true);
				emit('close', true);
			},
		};
	},
};
</script>