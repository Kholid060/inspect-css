<template>
  <div class="app-element" style="right: 1.5rem" ref="container">
    <div
      class="edit-element bg-gray-900 rounded-lg flex flex-col h-full "
    >
      <edit-element-menu @move="moveElement"></edit-element-menu>
      <div class="my-2 py-2 flex-1 overflow-auto scroll">
        <keep-alive>
          <component :active-element-id="state.activeElementId" :is="state.activeMenu"></component>
        </keep-alive>
      </div>
      <div
        class="bg-gray-100 bg-opacity-5 flex-shrink-0 w-full h-16 flex items-center justify-between px-4 rounded-lg text-gray-300"
      >
        <ui-button
          v-for="menu in menus"
          :key="menu.id"
          :color="menu.id === state.activeMenu ? 'bg-gray-100 bg-opacity-5 text-primary' : 'hover:text-white'"
          :title="menu.title"
          @click="state.activeMenu = menu.id"
          class="transition-colors"
          icon
        >
          <ui-icon :name="menu.icon"></ui-icon>
        </ui-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  onMounted, onUnmounted, shallowReactive, ref,
} from 'vue';
import globalEvent from '@/utils/globalEvent';
import EditCss from './edit/EditCss.vue';
import EditAssets from './edit/EditAssets.vue';
import EditPalette from './edit/EditPalette.vue';
import EditProperties from './edit/EditProperties.vue';
import EditAttributes from './edit/EditAttributes.vue';
import EditElementMenu from './edit/EditElementMenu.vue';

export default {
  components: {
    EditCss,
    EditAssets,
    EditPalette,
    EditProperties,
    EditAttributes,
    EditElementMenu,
  },
  setup() {
    const menus = [
      { id: 'edit-properties', title: 'Properties', icon: 'focus-line-3' },
      { id: 'edit-attributes', title: 'Attributes', icon: 'edit-box' },
      { id: 'edit-css', title: 'Custom CSS', icon: 'code-s-slash' },
      { id: 'edit-assets', title: 'Graphic Assets', icon: 'image' },
      { id: 'edit-palette', title: 'Palettes', icon: 'palette' },
    ];

    const container = ref(null);
    const state = shallowReactive({
      activeElementId: 0,
      activeMenu: 'edit-properties',
    });

    function moveElement(value) {
      container.value.style.cssText = value;
    }

    onMounted(() => {
      globalEvent.init(() => {
        state.activeElementId += 1;
      });
    });
    onUnmounted(() => globalEvent.removeListeners());

    return {
      state,
      menus,
      container,
      moveElement,
    };
  },
};
</script>
