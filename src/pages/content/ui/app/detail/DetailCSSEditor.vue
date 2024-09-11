<template>
  <UiCodemirror
    v-model="model"
    :view-options="{ root: appProvider.shadowRoot }"
    :extensions="editorExtensions"
    :theme-options="{
      settings: {
        background: 'transparent',
        gutterBackground: 'transparent',
      },
    }"
    @change="emit('change', $event)"
  />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { css } from '@src/lib/codemirror/css';
import { color } from '@uiw/codemirror-extensions-color';
import { toggleCommentGutter } from '@src/lib/codemirror/extensions';
import UiCodemirror from '@root/src/pages/components/ui/UiCodemirror.vue';
import { useAppProvider } from '../../app-plugin';

interface Props {
  styleId?: string;
  modelValue: string;
}
const props = withDefaults(defineProps<Props>(), {
  styleId: '',
});
const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();
const model = defineModel({ type: String });

let editorView: EditorView;

const appProvider = useAppProvider();

const editorExtensions: Extension[] = [
  css(),
  color,
  toggleCommentGutter,
  EditorView.lineWrapping,
];

const codemirror = ref<InstanceType<typeof UiCodemirror> | null>();

watch(
  () => props.styleId,
  () => {
    codemirror.value?.editorView?.dispatch({
      changes: {
        from: 0,
        insert: props.modelValue,
        to: editorView.state.doc.length,
      },
    });
  },
  {
    flush: 'post',
  },
);
</script>
