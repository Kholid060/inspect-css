<template></template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { emitter } from '@root/src/lib/mitt';
import CSSRules from '@root/src/utils/CSSRules';

const cssRules = new CSSRules();

function onSelectElement(element: Element) {
  cssRules.init();
  console.log(cssRules.getElementRules(element));
}

onMounted(() => {
  cssRules.init();
  emitter.on('content:el-selected', onSelectElement);
});
onUnmounted(() => {
  emitter.off('content:el-selected', onSelectElement);
});
</script>
