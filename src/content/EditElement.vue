<template>
  <div class="fixed m-4 top-0 edit-element right-0" style="width: 310px;">
    <edit-navigation></edit-navigation>
    <div class="rounded-lg shadow-2xl overflow-hidden bg-default">
      <div class="pb-16 overflow-auto scroll" style="height: calc(100vh - 110px)">
        <transition name="slide-up" mode="out-in">
          <component :key="state.activeMenu" :is="state.activeMenu" :activeElementId="state.activeElementId"></component>
        </transition>
      </div>
      <edit-menu :menu="menu" v-model="state.activeMenu"></edit-menu>
    </div>
  </div>
</template>
<script>
import { onMounted, shallowReactive, watch } from 'vue';
import emitter from 'tiny-emitter/instance';
import EditProperties from './components/EditElement/EditProperties.vue';
import EditAttributes from './components/EditElement/EditAttributes.vue';
import EditCss from './components/EditElement/EditCss.vue';
import EditPalettes from './components/EditElement/EditPalettes.vue';
import EditMenu from './components/EditElement/EditMenu.vue';
import EditNavigation from './components/EditElement/EditNavigation.vue';
import GlobalEvent from '../utils/globalEvent';

export default {
  components: {
    EditProperties,
    EditAttributes,
    EditCss,
    EditPalettes,
    EditMenu,
    EditNavigation,
  },
  setup() {
    const state = shallowReactive({
      activeElementId: 0,
      activeMenu: 'edit-properties',
    });
    const menu = [
      { name: 'edit-properties', title: 'Properties', icon: 'mdi-view-grid' },
      // { name: 'edit-font', title: 'Fonts', icon: 'mdi-format-color-text' },
      { name: 'edit-attributes', title: 'Attributes', icon: 'mdi-square-edit-outline' },
      { name: 'edit-css', title: 'Custom CSS', icon: 'mdi-xml' },
      { name: 'edit-palettes', title: 'Palettes', icon: 'mdi-palette' },
      // { name: 'information', title: 'Info', icon: 'mdi-information' },
      // { name: 'assets', title: 'Assets', icon: 'mdi-image-multiple' },
    ];

    onMounted(() => {
      GlobalEvent.init({
        onEventFired: () => (state.activeElementId += 1),
      });

      emitter.on('closeExtension', () => {
        GlobalEvent.removeListener();
      });
    });

    return {
      menu,
      state,
    };
  },
};
</script>
