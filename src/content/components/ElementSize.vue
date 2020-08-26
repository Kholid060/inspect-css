<template>
  <div class="popper">
    <div class="line-clamp popper__element-selector">
      <span class="tag">{{ selector.tag }}</span
      ><span class="id">{{ selector.id }}</span
      ><span class="classes">{{ selector.classes }}</span>
    </div>
    <p class="text-overflow popper__font">
      <v-mdi name="mdi-format-font"></v-mdi>
      {{ computedStyles.fontFamily }}
    </p>
    <div class="popper__margin" title="Margin">
      <span class="text">margin</span>
      <span 
        v-for="direction in directions" 
        :key="direction"
        :class="[
          direction, 
          direction === 'top' || direction === 'bottom' ? 'horizontal-center' : 'vertical-center'
        ]"
      >
        {{ computedStyles[`margin-${direction}`] }}
      </span>
      <div class="popper__padding">
        <span class="text">padding</span>
        <span 
          v-for="direction in directions" 
          :key="direction" 
          :class="[
            direction, 
            direction === 'top' || direction === 'bottom' ? 'horizontal-center' : 'vertical-center'
          ]"
        >
          {{ computedStyles[`padding-${direction}`] }}
        </span>
        <div class="popper__size">
          {{ Math.floor(size.width) }} x {{ Math.floor(size.height) }}
        </div>
      </div>
    </div>
    <p class="popper__info" v-show="showInfo">
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
