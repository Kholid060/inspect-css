<template>
  <div class="fixed rounded-lg shadow-2xl overflow-hidden right-0 m-4 bg-default top-0" style="width: 300px;">
    <div class="pb-16 overflow-auto scroll" style="min-height: 400px; max-height: calc(100vh - 140px)">
      <keep-alive>
        <component :key="state.activeMenu" :is="state.activeMenu" :activeElementId="state.activeElementId"></component>
      </keep-alive>
    </div>
    <Menu @close="closeExtension" :menu="menu" v-model="state.activeMenu"></Menu>
  </div>
</template>
<script>
import { onMounted, shallowReactive, watch } from 'vue';
import Properties from './components/EditElement/Properties.vue';
import Attributes from './components/EditElement/Attributes.vue';
import Codes from './components/EditElement/GlobalCss.vue';
import Palletes from './components/EditElement/WebsitePalettes.vue';
import Menu from './components/Menu.vue';

export default {
  components: { Properties, Menu, Attributes, Codes, Palletes },
  setup() {
    const state = shallowReactive({
      activeElementId: 0,
      activeMenu: 'properties',
      transition: 'slide-right',
    });
    const menu = [
      { name: 'properties', title: 'Element properties', icon: 'mdi-view-grid' },
      { name: 'attributes', title: 'Edit attributes', icon: 'mdi-square-edit-outline' },
      { name: 'codes', title: 'Global CSS Code', icon: 'mdi-xml' },
      { name: 'palletes', title: 'Palettes', icon: 'mdi-palette' },
      // { name: 'assets', title: 'Assets', icon: 'mdi-image-multiple' },
    ];
    const eventHandler = target => {
      if (target.matches('.inspector,.active-element,html,body')) return;

      const activeElement = document.querySelector('.active-element');
      activeElement && activeElement.classList.remove('active-element');

      target.classList.add('active-element');
      state.activeElementId += 1;
    };
    const clickHandler = ({ target }) => eventHandler(target);
    const keyupHandler = ({ code, ctrlKey }) => {
      if (ctrlKey && code === 'Space') {
        const target = document.querySelector('.hover-element');

        eventHandler(target);
      }
    };
    const closeExtension = () => {
      window.removeEventListener('click', clickHandler);
      document.removeEventListener('keyup', keyupHandler);

      const container = document.querySelector('.inspector');
      document.body.removeChild(container);

      const activeElement = document.querySelector('.active-element');
      activeElement && activeElement.classList.remove('active-element');
    };

    onMounted(() => {
      window.addEventListener('click', clickHandler);
      document.addEventListener('keyup', keyupHandler);
    });

    return {
      menu,
      state,
      closeExtension,
    };
  },
};
</script>
