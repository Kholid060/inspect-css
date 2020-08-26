<template>
  <div class="edit-element">
  	<Menu></Menu>
    <div class="edit-element__content">
    	<properties v-bind="{ activeElementId }"></properties>
  	</div>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue';
import Properties from './components/EditElement/Properties.vue';
import Menu from './components/Menu.vue';

export default {
  components: { Properties, Menu },
  setup() {
  	const activeElementId = ref(0);
  	const eventHandler = target => {
      if (target.matches('.inspector,.active-element,html,body')) return;

      const activeElement = document.querySelector('.active-element');
      activeElement && activeElement.classList.remove('active-element');

      target.classList.add('active-element');

      activeElementId.value += 1;
    };

  	onMounted(() => {
      window.addEventListener('click', ({ target }) => eventHandler(target));

      document.addEventListener('keyup', ({ code, ctrlKey }) => {
        if (ctrlKey && code === 'Space') {
          const target = document.querySelector('code');

          eventHandler(target);
        }
      });
    });

    return {
    	activeElementId,
    };
  },
};
</script>
