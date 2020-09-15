<template>
  <div class="bg-default rounded-lg p-5 shadow-2xl" style="width: 300px; z-index: 999" ref="container">
    <element-properties :properties="state.properties" v-if="state.properties !== null"></element-properties>
  </div>
</template>
<script>
import { ref, onMounted, reactive } from 'vue';
import emitter from 'tiny-emitter/instance';
import ElementProperties from './components/ElementProperties.vue';
import { generateGetBoundingClientRect } from '~/utils/helper';
import GetElementProperties from '~/utils/getElementProperties';
import createPopper from '~/utils/createPopper';

export default {
  components: { ElementProperties },
  setup() {
    const container = ref(null);
    const state = reactive({
      properties: null,
    });

    onMounted(() => {
      const virtualElement = {
        getBoundingClientRect: generateGetBoundingClientRect(),
      };
      const instance = createPopper({
        container: virtualElement,
        content: container.value,
        options: {
          placement: 'right-end',
        },
      });
      const mousemove = ({ target, clientX, clientY }) => {
        const isPaused = document.body.classList.contains('pause');
        const isMatchExtensionEl = target.classList.contains('inspect-css');

        if (isPaused || isMatchExtensionEl) return container.value.classList.add('hidden');
        container.value.classList.remove('hidden');

        virtualElement.getBoundingClientRect = generateGetBoundingClientRect(clientX, clientY);
        instance.update();

        if (!target.matches('.hover-element,.inspect-css')) {
          const properties = new GetElementProperties(target);
          state.properties = properties.getAll();

          const element = document.querySelector('.hover-element');
          element && element.classList.remove('hover-element');

          target.classList.add('hover-element');
          target.addEventListener(
            'mouseleave',
            () => {
              target.classList.remove('hover-element');
            },
            { once: true }
          );
        }
      };

      window.addEventListener('mousemove', mousemove);

      emitter.on('closeExtension', () => {
        window.removeEventListener('mousemove', mousemove);
      });
    });

    return {
      container,
      state,
    };
  },
};
</script>
