<template>
	<button class="focus:outline-none" :class="[active ? 'text-primary' : 'text-light']">
		<v-mdi :name="icon" size="22"></v-mdi>
	</button>
</template>
<script>
export default {
	props: {
		icon: String,
		active: Boolean,
	},
};
</script>