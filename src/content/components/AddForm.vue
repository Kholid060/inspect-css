<template>
  <form autocomplete="off" @submit.prevent="emit('submit', $event)" class="rounded-md add-form border text-sm flex items-center">
    <input
      type="text"
      class="p-2 w-5/12 focus:outline-none add-form__key bg-transparent"
      name="key"
      placeholder="Key"
      :value="key"
      tabindex="0"
      @change="emit('update:key', $event.target.value)"
    />
    <input
      type="text"
      name="value"
      tabindex="0"
      class="p-2 focus:outline-none w-5/12 add-form__value bg-transparent"
      placeholder="Value"
      :value="value"
      @change="emit('update:value', $event.target.value)"
    />
    <button class="p-2 focus:outline-none w-2/12 text-primary">
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
};
</script>
