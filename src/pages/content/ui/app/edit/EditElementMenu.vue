<template>
  <nav class="h-16 px-4 pt-4 rounded-lg text-gray-300 flex items-center">
    <div class="bg-gray-100 bg-opacity-5 rounded-lg">
      <button
        @click="moveExtension"
        :title="state.isOnLeft ? 'Move to right' : 'Move to left'"
        class="p-2 rounded-lg hover:text-white">
        <ui-icon
          name="arrow-left"
          class="transform transition-transform"
          :class="{ 'rotate-180': state.isOnLeft }"></ui-icon>
      </button>
      <button
        @click="toggleBodyClass('isPauseActive', 'pause')"
        :class="[state.isPauseActive ? 'text-primary' : 'hover:text-white']"
        title="Pause"
        class="p-2 rounded-lg">
        <ui-icon name="pause"></ui-icon>
      </button>
      <button
        @click="toggleBodyClass('isGridActive', 'display-grid')"
        :class="[state.isGridActive ? 'text-primary' : 'hover:text-white']"
        class="p-2 rounded-lg"
        title="Show grid">
        <ui-icon name="grid" size="22"></ui-icon>
      </button>
    </div>
    <div class="flex-grow"></div>
    <a
      href="https://github.com/kholid060/inspect-css"
      class="mr-4"
      target="_blank"
      title="GitHub">
      <ui-icon name="github"></ui-icon>
    </a>
    <button @click="closeExtension" title="Close extension">
      <ui-icon name="close"></ui-icon>
    </button>
  </nav>
</template>
<script>
import { shallowReactive, getCurrentInstance } from 'vue';

export default {
  emits: ['move'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();

    const state = shallowReactive({
      isOnLeft: false,
      isGridActive: false,
      isPauseActive: false,
    });

    function moveExtension() {
      emit('move', state.isOnLeft ? 'right: 1.5rem;' : 'left: 1.5rem');

      state.isOnLeft = !state.isOnLeft;
    }
    function toggleBodyClass(key, classes) {
      state[key] = !state[key];

      document.body.classList.toggle(classes);
    }
    function closeExtension() {
      instance.appContext.config.globalProperties.destoryExtension();
    }

    return {
      state,
      moveExtension,
      closeExtension,
      toggleBodyClass,
    };
  },
};
</script>
