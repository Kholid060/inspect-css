<template>
  <p class="font-semibold">HTML</p>
  <div class="mt-2 rounded-md bg-muted/50 highlight-white/5">
    <UiCodemirror
      :key="editorKey"
      :extensions="[html(), EditorView.lineWrapping]"
      :model-value="innerHTML"
      :theme-options="{
        settings: {
          background: 'transparent',
          gutterBackground: 'transparent',
        },
      }"
      placeholder="HTML here"
      class="text-sm p-2"
      @change="updateInnerHTML"
    />
  </div>
</template>
<script setup lang="ts">
import { watch, shallowRef } from 'vue';
import { html } from '@codemirror/lang-html';
import UiCodemirror from '@root/src/pages/components/ui/UiCodemirror.vue';
import { EditorView } from '@codemirror/view';

const props = defineProps<{
  element: Element;
}>();

const innerHTML = shallowRef('');
const editorKey = shallowRef(0);

function updateInnerHTML(html: string) {
  innerHTML.value = html;
  // eslint-disable-next-line vue/no-mutating-props
  props.element.innerHTML = html;
}

watch(
  () => props.element,
  () => {
    innerHTML.value = props.element.innerHTML.trim();
    editorKey.value += 1;
  },
  { immediate: true },
);
</script>
