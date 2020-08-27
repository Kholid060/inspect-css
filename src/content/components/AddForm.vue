<template>
	<form 
  	autocomplete="off"
  	@submit.prevent="emit('submit', $event)" 
  	class="add-form"
  >
    <input 
    	type="text" 
    	class="add-form__key" 
    	name="key" 
    	placeholder="Key"
    	:value="key"
      tabindex="1" 
    	@change="emit('update:key', $event.target.value)"
    />
    <input 
    	type="text"
    	name="value"
      tabindex="2" 
    	class="add-form__value" 
    	placeholder="Value" 
    	:value="value"
    	@change="emit('update:value', $event.target.value)"
    />
    <button>
    	<v-mdi name="mdi-plus"></v-mdi>
    </button>
  </form>
</template>
<script>
export default {
	props: {
		key: String,
		value: String,
	},	
	setup(props, { emit }) {
		return {
			emit,
		};
	},
}
</script>