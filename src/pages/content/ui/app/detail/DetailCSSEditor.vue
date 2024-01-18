<template>
  <div ref="editorEl" class="font-mono"></div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { EditorState } from '@codemirror/state';
import {
  EditorView,
  keymap,
  highlightActiveLine,
  highlightActiveLineGutter,
} from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { css } from '@src/lib/codemirror/css';
import { themeInit } from '@src/lib/codemirror/theme';
import { color } from '@uiw/codemirror-extensions-color';
import { toggleCommentGutter } from '@src/lib/codemirror/extensions';
import { autocompletion } from '@codemirror/autocomplete';

interface Props {
  modelValue: string;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
});
const emit = defineEmits<{
  (e: 'change', value: string): void;
  (e: 'update:modelValue', value: string): void;
}>();

let editorView: EditorView;
let editorState: EditorState;

const editorEl = ref<HTMLElement>();

onMounted(() => {
  const updateListener = EditorView.updateListener.of((viewUpdate) => {
    if (!viewUpdate.docChanged) return;

    const newValue = viewUpdate.state.doc.toString();
    emit('change', newValue);
    emit('update:modelValue', newValue);
  });

  editorState = EditorState.create({
    doc: props.modelValue,
    extensions: [
      css(),
      color,
      updateListener,
      autocompletion(),
      toggleCommentGutter,
      highlightActiveLine(),
      EditorView.lineWrapping,
      keymap.of(defaultKeymap),
      keymap.of([indentWithTab]),
      highlightActiveLineGutter(),
      themeInit({
        settings: {
          background: 'transparent',
          gutterBackground: 'transparent',
        },
      }),
    ],
  });

  editorView = new EditorView({
    state: editorState,
    parent: editorEl.value,
  });
});
onUnmounted(() => {
  editorView.destroy();
});
</script>
