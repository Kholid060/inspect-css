<template>
  <div class="popper-container" ref="container">
    <element-size v-bind="state"></element-size>
  </div>
</template>
<script>
import { ref, onMounted, shallowReactive } from 'vue';
import { createPopper } from '@popperjs/core';
import ElementSize from './components/ElementSize.vue';
import { generateGetBoundingClientRect } from '~/utils/helper';
import getElementProperties from '~/utils/getElementProperties';

export default {
  components: { ElementSize },
  setup() {
    const container = ref(null);
    const state = shallowReactive({
      size: {},
      selector: {},
      computedStyles: {},
    });

    onMounted(() => {
      const virtualElement = {
        getBoundingClientRect: generateGetBoundingClientRect(),
      };
      const instance = createPopper(virtualElement, container.value, {
        placement: 'right-end',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [20, 20],
            },
          },
        ],
      });

      window.addEventListener('mousemove', ({ target, clientX, clientY }) => {
        if (target.classList.contains('inspector')) return container.value.classList.add('hide');
        container.value.classList.remove('hide');

        const isDragging = document.body.classList.contains('dragging');

        virtualElement.getBoundingClientRect = generateGetBoundingClientRect(clientX, clientY);
        instance.update();

        if (!target.matches('.active-element,.hover-element,.inspector') && !isDragging) {
          const { size, selector, computedStyles } = getElementProperties(target);
          state.size = size;
          state.selector = selector;
          state.computedStyles = computedStyles;

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
      });
    });

    return {
      container,
      state,
    };
  },
};
</script>
