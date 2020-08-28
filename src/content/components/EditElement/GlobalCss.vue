<template>
	<div class="global-css">
		<p class="font-semibold mb-3">Global CSS</p>
		<codeflask v-model:code="codes"></codeflask>
	</div>
</template>
<script>
import { onMounted, ref, watch } from 'vue';
import debounce from 'lodash.debounce';
import Codeflask from '../Codeflask.vue';

export default {
	components: { Codeflask },
	setup() {
		const codes = ref('');

		watch(codes, debounce((value) => {
			if (typeof value !== 'string') return;

			const style = document.getElementById('custom-global-css');
			style.innerText = value;

			localStorage.setItem('global-css', value);
		}, 250));

		onMounted(() => {
			const storageCodes = localStorage.getItem('global-css') || '';
			
			codes.value = storageCodes;

			const styleEl = document.getElementById('custom-global-css');
			if (styleEl) return;

			const style = document.createElement('style');
			style.id = 'custom-global-css';
			style.innerText = storageCodes;
			document.body.appendChild(style);
		});

		return {
			codes,
		};
	},
};
</script>