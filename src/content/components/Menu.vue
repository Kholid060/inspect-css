<template>
  <div class="absolute w-full z-10 bottom-0 flex shadow-xl justify-evenly rounded-lg h-16 items-center bg-light">
    <button
      v-for="item in menu"
      :key="item.name"
      :content="item.name"
      v-tippy
      class="focus:outline-none"
      :class="[item.name === modelValue ? 'text-primary' : 'text-light']"
      :title="item.title"
      @click="emitValue(item.name)"
    >
      <v-mdi :name="item.icon" size="24"></v-mdi>
    </button>
  </div>
</template>
<script>
import emitter from 'tiny-emitter/instance';

export default {
  props: {
    menu: Array,
    modelValue: {
      type: String,
      default: 'properties',
    },
  },
  setup(props, { emit }) {
    return {
      emitValue: name => {
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
