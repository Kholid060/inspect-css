<template>
  <div
    class="bg-gray-900 rounded-lg p-4 shadow-2xl"
    style="width: 300px; z-index: 99999"
    ref="container"
  >
    <ui-element-properties
      :properties="state.properties"
      v-if="state.properties !== null"
    ></ui-element-properties>
  </div>
</template>
<script>
import {
  ref, onMounted, reactive, onUnmounted,
} from 'vue';
import { generateGetBoundingClientRect } from '@/utils/helper';
import GetElementProperties from '@/utils/getElementProperties';
import createPopper from '@/utils/createPopper';

export default {
  setup() {
    const container = ref(null);
    const state = reactive({
      properties: null,
      popper: null,
    });
    const virtualElement = {
      getBoundingClientRect: generateGetBoundingClientRect(),
    };

    function mouseMoveHandler({ target, clientX, clientY }) {
      const isPaused = document.body.classList.contains('pause');
      const isMatchExtensionEl = target.classList.contains('inspect-css');

      if (isPaused || isMatchExtensionEl) return container.value.classList.add('hidden');
      container.value.classList.remove('hidden');

      virtualElement.getBoundingClientRect = generateGetBoundingClientRect(clientX, clientY);
      state.popper.update();

      if (!target.matches('.hover-element,.inspect-css')) {
        const properties = new GetElementProperties(target);
        state.properties = properties.getAll();

        const element = document.querySelector('.hover-element');

        if (element) element.classList.remove('hover-element');

        target.classList.add('hover-element');
        target.addEventListener(
          'mouseleave',
          () => {
            target.classList.remove('hover-element');
          },
          { once: true },
        );
      }
    }

    onMounted(() => {
      state.popper = createPopper({
        container: virtualElement,
        content: container.value,
        options: {
          placement: 'right-end',
        },
      });

      window.addEventListener('mousemove', mouseMoveHandler);
    });
    onUnmounted(() => {
      window.removeEventListener('mousemove', mouseMoveHandler);
    });

    return {
      container,
      state,
    };
  },
};
</script>
