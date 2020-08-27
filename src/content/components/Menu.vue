<template>
	<div class="edit-element__menu">
		<div class="icons">
			<button-icon 
				v-for="item in menu"
				:key="item.name"
				:icon="item.icon"
				:active="item.name === modelValue" 
				@click="emitValue(item.name)"
				style="margin-right: 12px;"
			></button-icon>	
		</div>
		<v-mdi @click="closeExtension" name="mdi-close" class="close"></v-mdi>
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