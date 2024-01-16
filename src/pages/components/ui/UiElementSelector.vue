<template>
  <div class="line-clamp-2 font-semibold leading-tight">
    <span class="text-red-500">
      {{ selector.tag }}
    </span>
    <span class="text-primary">
      {{ selector.id }}
    </span>
    <span class="text-blue-400">
      {{ selector.classes }}
    </span>
  </div>
</template>
<script setup lang="ts">
import { ElementSelector } from '@root/src/utils/getElProperties';

interface Props {
  selector: ElementSelector;
}

withDefaults(defineProps<Props>(), {
  selector: () => ({ classes: '', id: '', tag: '' }),
});
</script>
