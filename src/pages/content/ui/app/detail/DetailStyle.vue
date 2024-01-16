<template>
  <div class="px-4 pb-4 pt-2">
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
    <DetailCSSEditor :model-value="appliedStyle.cssText" class="text-sm" />
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue';
import DetailCSSEditor from './DetailCSSEditor.vue';
import UiElementSpacing from '@root/src/pages/components/ui/UiElementSpacing.vue';
import { ElementAppliedStyleRules } from '@root/src/utils/CSSRulesUtils';
import { ElementProperties } from '@root/src/utils/getElProperties';

interface Props {
  properties: ElementProperties;
  appliedStyle: ElementAppliedStyleRules;
}
const props = defineProps<Props>();

watch(
  () => props.properties,
  (newValue) => {
    console.log(newValue);
  },
);
</script>
