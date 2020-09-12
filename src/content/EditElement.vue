<template>
  <div class="fixed right-0 m-4 top-0" style="width: 300px;">
    <edit-navigation></edit-navigation>
    <div class="rounded-lg shadow-2xl overflow-hidden bg-default">
      <div class="pb-16 overflow-auto scroll" style="height: calc(100vh - 140px)">
        <keep-alive>
          <component :key="state.activeMenu" :is="state.activeMenu" :activeElementId="state.activeElementId"></component>
        </keep-alive>
      </div>
      <edit-menu @close="closeExtension" :menu="menu" v-model="state.activeMenu"></edit-menu>
    </div>
  </div>
</template>
<script>
import { onMounted, shallowReactive, watch } from 'vue';
import EditProperties from './components/EditElement/EditProperties.vue';
import EditAttributes from './components/EditElement/EditAttributes.vue';
import EditCodes from './components/EditElement/EditCss.vue';
import EditPalettes from './components/EditElement/EditPalettes.vue';
import EditMenu from './components/EditElement/EditMenu.vue';
import EditNavigation from './components/EditElement/EditNavigation.vue';
import GlobalEvent from '../utils/globalEvent';

export default {
  components: {
    EditProperties,
    EditAttributes,
    EditCodes,
    EditPalettes,
    EditMenu,
    EditNavigation,
  },
  setup() {
    const state = shallowReactive({
      activeElementId: 0,
      activeMenu: 'edit-properties',
      transition: 'slide-right',
    });
    const menu = [
      { name: 'edit-properties', title: 'Properties', icon: 'mdi-view-grid' },
      // { name: 'edit-font', title: 'Fonts', icon: 'mdi-format-color-text' },
      { name: 'edit-attributes', title: 'Attributes', icon: 'mdi-square-edit-outline' },
      { name: 'edit-codes', title: 'CSS Code', icon: 'mdi-xml' },
      { name: 'edit-palettes', title: 'Palettes', icon: 'mdi-palette' },
      { name: 'information', title: 'Info', icon: 'mdi-information' },
      // { name: 'assets', title: 'Assets', icon: 'mdi-image-multiple' },
    ];
    const closeExtension = () => {
      window.removeEventListener('click', clickHandler);
      document.removeEventListener('keyup', keyupHandler);

      const container = document.querySelector('.inspector');
      document.body.removeChild(container);

      const activeElement = document.querySelector('.active-element');
      activeElement && activeElement.classList.remove('active-element');
    };

    onMounted(() => {
      GlobalEvent.init({
        onEventFired: () => (state.activeElementId += 1),
      });
    });

    return {
      menu,
      state,
      closeExtension,
    };
  },
};
</script>
