<template>
  <div class="element-properties">
    <element-selector :selector="properties.selector"></element-selector>
    <p class="text-overflow mb-3">
      <v-mdi name="mdi-format-color-text" style="margin-left: -5px"></v-mdi>
      {{ properties.computedStyles.fontFamily }}
    </p>
    <element-computed :computed-styles="properties.computedStyles" title="margin">
      <element-computed :computed-styles="properties.computedStyles" title="padding">
        <div class="bg-primary bg-opacity-25 rounded-lg text-center p-2">{{ Math.floor(properties.size.width) }} x {{ Math.floor(properties.size.height) }}</div>
      </element-computed>
    </element-computed>
    <p class="text-sm mt-4 text-light" v-show="showInfo">
      Click or press "Ctrl" + "Space" to edit element
    </p>
  </div>
</template>
<script>
import { computed } from 'vue';
import ElementSelector from './ElementSelector.vue';
import ElementComputed from './ElementComputed.vue';

export default {
  components: { ElementComputed, ElementSelector },
  props: {
    properties: {
      type: Object,
      default: () => ({
        selector: {},
        computedStyles: {},
        size: {},
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
