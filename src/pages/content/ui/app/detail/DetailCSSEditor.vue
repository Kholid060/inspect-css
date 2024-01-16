<template>
  <div ref="editorEl" class="font-mono"></div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { createTheme } from '@uiw/codemirror-themes';
import { css } from '@codemirror/lang-css';
import { tags as t } from '@lezer/highlight';

const [model] = defineModel({
  default: '',
  type: String,
});

const myTheme = createTheme({
  theme: 'dark',
  settings: {
    background: 'transparent',
    foreground: '#CECFD0',
    caret: '#fff',
    selection: '#727377',
    selectionMatch: '#727377',
    lineHighlight: '#ffffff0f',
  },
  styles: [
    { tag: [t.comment, t.quote], color: '#7F8C98' },
    { tag: [t.keyword], color: '#FF7AB2', fontWeight: 'bold' },
    { tag: [t.string, t.meta, t.integer], color: '#FF8170' },
    { tag: [t.typeName], color: '#DABAFF' },
    { tag: [t.definition(t.variableName)], color: '#6BDFFF' },
    { tag: [t.name], color: '#6BAA9F' },
    { tag: [t.variableName], color: '#ACF2E4' },
    { tag: [t.regexp, t.link], color: '#FF8170' },
  ],
});

let editorView: EditorView;
let editorState: EditorState;

const editorEl = ref<HTMLElement>();

watch(
  () => model.value,
  (newValue) => {
    editorView.dispatch({
      changes: {
        from: 0,
        insert: newValue,
        to: editorView.state.doc.length,
      },
    });
    console.log(newValue);
  },
);

onMounted(() => {
  console.log(model);
  editorState = EditorState.create({
    doc: model.value,
    extensions: [
      css(),
      myTheme,
      highlightActiveLine(),
      EditorView.lineWrapping,
      keymap.of(defaultKeymap),
      keymap.of([indentWithTab]),
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
