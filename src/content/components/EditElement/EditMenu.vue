<template>
  <div class="absolute w-full z-10 bottom-0 flex shadow-xl justify-evenly rounded-lg h-16 items-center bg-light">
    <button-icon
      v-for="item in menu"
      :key="item.name"
      :active="item.name === modelValue"
      v-tooltip="item.title"
      :icon="item.icon"
      @click="emitValue(item.name)"
      :class="{ 'bg-default': item.name === modelValue }"
      class="hover:bg-default rounded-lg p-2"
    ></button-icon>
  </div>
</template>
<script>
import ButtonIcon from '../ButtonIcon.vue';

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
