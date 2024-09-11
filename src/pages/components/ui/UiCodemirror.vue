<template>
  <div ref="editorEl" class="font-mono"></div>
</template>
<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from 'vue';
import { EditorState } from '@codemirror/state';
import type { Extension } from '@codemirror/state';
import {
  keymap,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  placeholder as placeholderPlugin,
  type EditorViewConfig,
} from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { autocompletion } from '@codemirror/autocomplete';
import { themeInit } from '@root/src/lib/codemirror/theme';
import type { CreateThemeOptions } from '@uiw/codemirror-themes';

interface Props {
  modelValue?: string;
  placeholder?: string;
  extensions?: Extension[];
  viewOptions?: EditorViewConfig;
  themeOptions: Partial<CreateThemeOptions>;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  extensions: () => [],
  viewOptions: () => ({}),
  themeOptions: () => ({}),
});

const emits = defineEmits<{
  (e: 'change', value: string): void;
  (e: 'update:modelValue', value: string): void;
}>();

const editorEl = ref<HTMLDivElement>();
const editorView = shallowRef<EditorView>();
const editorState = shallowRef<EditorState>();

onMounted(() => {
  const updateListener = EditorView.updateListener.of((viewUpdate) => {
    if (!viewUpdate.docChanged) return;

    const newValue = viewUpdate.state.doc.toString();
    emits('change', newValue);
    emits('update:modelValue', newValue);
  });

  editorState.value = EditorState.create({
    doc: props.modelValue,
    extensions: [
      updateListener,
      autocompletion(),
      highlightActiveLine(),
      keymap.of(defaultKeymap),
      keymap.of([indentWithTab]),
      highlightActiveLineGutter(),
      themeInit(props.themeOptions),
      placeholderPlugin(props.placeholder),
      ...props.extensions,
    ],
  });
  editorView.value = new EditorView({
    parent: editorEl.value,
    state: editorState.value,
    ...props.viewOptions,
  });
});
onUnmounted(() => {
  editorView.value?.destroy();
});

defineExpose({
  editorView,
  editorState,
  rootEl: editorEl,
});
</script>
