<template>
  <div class="popper">
    <div class="line-clamp font-semibold mb-1" style="font-size: 16px">
      <span class="text-danger">{{ selector.tag }}</span
      ><span class="text-primary">{{ selector.id }}</span
      ><span class="text-primary-light">{{ selector.classes }}</span>
    </div>
    <p class="text-overflow mb-3">
      <v-mdi name="mdi-format-font"></v-mdi>
      {{ computedStyles.fontFamily }}
    </p>
    <div class="px-10 py-8 bg-primary bg-opacity-25 rounded-lg relative mb-2 h-40" style="height: 166px">
      <span class="absolute left-0 top-0 ml-2 mt-1 text-sm">margin</span>
      <span 
        v-for="direction in directions" 
        :key="direction"
        :class="[
          direction, 
          direction === 'top' || direction === 'bottom' ? 'horizontal-center' : 'vertical-center'
        ]"
        :style="{ [direction]: '5px' }"
      >
        {{ computedStyles[`margin-${direction}`] }}
      </span>
      <div class="px-10 py-8 bg-primary bg-opacity-25 rounded-lg relative">
        <span class="absolute left-0 top-0 ml-2 mt-1 text-sm">padding</span>
        <span 
          v-for="direction in directions" 
          :key="direction" 
          :class="[
            direction, 
            direction === 'top' || direction === 'bottom' ? 'horizontal-center' : 'vertical-center'
          ]"
          :style="{ [direction]: '5px' }"
        >
          {{ computedStyles[`padding-${direction}`] }}
        </span>
        <div class="bg-primary bg-opacity-25 rounded-lg text-center p-2">
          {{ Math.floor(size.width) }} x {{ Math.floor(size.height) }}
        </div>
      </div>
    </div>
    <p class="text-sm mt-4 text-light" v-show="showInfo">
      Click or press "Ctrl" + "Space" to edit element
    </p>
  </div>
</template>
<script>
import { computed } from 'vue';

export default {
  props: {
    size: {
      type: Object,
      default: () => ({ height: 0, width: 0 }),
    },
    selector: {
      type: Object,
      default: () => ({ tag: '', id: '', classes: '' }),
    },
    computedStyles: {
      type: Object,
      default: () => ({
        'margin-top': '',
        'margin-bottom': '',
        'margin-left': '',
        'margin-right': '',
        'padding-top': '',
        'padding-bottom': '',
        'padding-left': '',
        'padding-right': '',
        fontFamily: '',
      }),
    },
    showInfo: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {
      directions: ['top', 'right', 'bottom', 'left'],
    };
  },
};
</script>
