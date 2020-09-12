<template>
  <div class="flex items-center h-16 px-5 mb-4 shadow-2xl rounded-lg bg-default">
    <button-icon
      v-for="(item, name) in state.menu"
      :key="name"
      :active="item.active"
      v-tooltip:bottom="item.title"
      :icon="item.icon"
      @click="clickEvent[item.event]()"
      class="mr-3"
    ></button-icon>
    <div class="flex-grow"></div>
    <button-icon icon="mdi-close" v-tooltip:bottom="'Close'"></button-icon>
  </div>
</template>
<script>
import { reactive } from 'vue';
import ButtonIcon from '../ButtonIcon.vue';

export default {
  components: { ButtonIcon },
  setup() {
    const state = reactive({
      menu: {
        grid: { event: 'toggleGrid', title: 'Show Grid', icon: 'mdi-grid', active: false },
        pause: { event: 'togglePause', title: 'Pause', icon: 'mdi-pause', active: false },
      },
    });
    const toggleActiveMenu = (key, className) => {
      state.menu[key].active = !state.menu[key].active;
      document.body.classList.toggle(className);
    };
    const clickEvent = {
      toggleGrid: () => {
        toggleActiveMenu('grid', 'display-grid');
      },
      togglePause: () => {
        toggleActiveMenu('pause', 'pause');
      },
    };

    return {
      state,
      clickEvent,
    };
  },
};
</script>
