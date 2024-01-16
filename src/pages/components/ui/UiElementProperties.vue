<template>
  <UiElementSelector :selector="properties.selector" />
  <div class="flex items-center mt-0.5 gap-1 text-sm">
    <CaseSensitiveIcon class="h-7 w-7" />
    <p>
      {{ properties.computedStyles.fontFamily }}
      {{ properties.computedStyles.fontSize }}px
    </p>
  </div>
  <UiElementSpacing
    :computed-styles="properties.computedStyles"
    class="mt-2"
    title="margin">
    <UiElementSpacing
      :computed-styles="properties.computedStyles"
      title="padding">
      <div class="bg-primary bg-opacity-25 rounded-md text-center py-2 px-1">
        {{ Math.floor(properties.size.width) }}x{{
          Math.floor(properties.size.height)
        }}
      </div>
    </UiElementSpacing>
  </UiElementSpacing>
</template>
<script setup lang="ts">
import { CaseSensitiveIcon } from 'lucide-vue-next';
import UiElementSpacing from './UiElementSpacing.vue';
import { ElementProperties } from '@root/src/utils/getElProperties';
import UiElementSelector from './UiElementSelector.vue';

interface Props {
  properties: ElementProperties;
}

withDefaults(defineProps<Props>(), {
  properties: () => ({
    computedStyles: {},
    size: { height: 0, width: 0 },
    selector: { classes: '', id: '', tag: '' },
  }),
});
</script>
