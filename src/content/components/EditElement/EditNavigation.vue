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
    <button-icon
      @click="moveExtension"
      icon="mdi-arrow-left"
      class="mr-3"
      :rotate="state.isOnLeft ? 180 : 0"
      v-tooltip:bottom="state.isOnLeft ? 'Move to right' : 'Move to left'"
    ></button-icon>
    <button-icon @click="closeExtension" icon="mdi-close" v-tooltip:bottom="'Close'"></button-icon>
  </div>
</template>
<script>
import { reactive } from 'vue';
import emitter from 'tiny-emitter/instance';
import ButtonIcon from '../ButtonIcon.vue';

export default {
  components: { ButtonIcon },
  setup() {
    const state = reactive({
      isOnLeft: false,
      menu: {
        grid: {
          event: 'toggleGrid',
          title: 'Show Grid',
          icon: 'mdi-grid',
          active: false,
        },
        pause: {
          event: 'togglePause',
          title: 'Pause',
          icon: 'mdi-pause',
          active: false,
        },
        // colorPicker: {
        // 	event: 'toggleColorPicker',
        // 	title: 'Color Picker',
        // 	icon: 'mdi-eyedropper',
        // 	active: false
        // },
      },
    });
    const closeExtension = () => {
      emitter.emit('closeExtension');

      const container = document.querySelector('.inspect-css');
      document.body.removeChild(container);

      const activeElement = document.querySelector('.active-element');
      activeElement && activeElement.classList.remove('active-element');

      document.body.removeAttribute('inspect-css');
    };
    const moveExtension = () => {
      state.isOnLeft = !state.isOnLeft;

      const { shadowRoot } = document.querySelector('.inspect-css');
      const parentElement = shadowRoot.querySelector('.edit-element');

      if (state.isOnLeft) {
        parentElement.classList.add('left-0');
        parentElement.classList.remove('right-0');
      } else {
        parentElement.classList.add('right-0');
        parentElement.classList.remove('left-0');
      }
    };
    const clickEvent = {
      toggleActiveMenu(key, className) {
        state.menu[key].active = !state.menu[key].active;
        document.body.classList.toggle(className);
      },
      toggleGrid() {
        this.toggleActiveMenu('grid', 'display-grid');
      },
      togglePause() {
        this.toggleActiveMenu('pause', 'pause');
      },
      toggleColorPicker() {
        this.toggleColorPicker('colorPicker', 'color-picker');
      },
    };

    return {
      state,
      clickEvent,
      moveExtension,
      closeExtension,
    };
  },
};
</script>
