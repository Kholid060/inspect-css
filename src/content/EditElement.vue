<template>
  <div class="fixed right-0 m-8 top-0" style="width: 300px;">
  	<Menu @close="closeExtension" :menu="menu" v-model="state.activeMenu"></Menu>
    <div class="bg-default p-5 rounded-lg overflow-hidden" style="min-height: 200px">
      <transition :name="state.transition" mode="out-in">
    	  <component 
          :is="state.activeMenu" 
          :activeElementId="state.activeElementId"
        ></component>
      </transition>
    </div>
  </div>
</template>
<script>
import { onMounted, shallowReactive, watch } from 'vue';
import Properties from './components/EditElement/Properties.vue';
import Attributes from './components/EditElement/Attributes.vue';
import Menu from './components/Menu.vue';

export default {
  components: { Properties, Menu, Attributes },
  setup() {
    const state = shallowReactive({
          activeElementId: 0,
          activeMenu: 'properties',
          transition: 'slide-right',
    });
    const menu = [
      { name: 'properties', icon: 'mdi-vector-square' },
      { name: 'attributes', icon: 'mdi-square-edit-outline' },
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
    }
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
    watch(() => state.activeMenu, (value, old) => {
      const findIndex = (key) => menu.findIndex(({ name }) => key === name);
      const indexNewMenu = findIndex(value);
      const indexOldMenu = findIndex(old);

      state.transition = indexNewMenu > indexOldMenu ? 'slide-right' : 'slide-left';
    });

    return {
      menu,
      state,
      closeExtension,
    };
  },
};
</script>
