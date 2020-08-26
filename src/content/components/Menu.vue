<template>
	<div class="edit-element__properties">
		<button-icon 
			v-for="item in menu"
			:key="item.name"
			:icon="item.icon"
			:active="item.name === activeMenu" 
			@click="activeMenu = item.name"
			style="margin-right: 8px;"
		></button-icon>	
	</div>
</template>
<script>
import { ref } from 'vue';
import ButtonIcon from './ButtonIcon.vue';

export default {
	components: { ButtonIcon },
	setup() {
		const menu = [
			{ name: 'properties', icon: 'mdi-vector-square' },
			{ name: 'attribute', icon: 'mdi-square-edit-outline' },
		];
		const activeMenu = ref('properties');
	
		return {
			menu,
			activeMenu,
		};
	},
};
</script>