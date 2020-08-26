<template>
	<button class="button-icon" :class="{ active }">
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