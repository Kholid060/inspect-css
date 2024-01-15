<template>
  <div class="px-4">
    <template v-if="state.selected">
      <ui-element-properties
        :properties="state.properties"
        :show-info="false"></ui-element-properties>
      <div class="flex items-center mt-6 mb-4">
        <div
          class="border flex-1 mr-4 flex rounded-lg border-gray-100 border-opacity-5 text-gray-300">
          <ui-button
            v-for="tab in tabs"
            :key="tab.id"
            :color="
              state.activeTab === tab.id
                ? 'text-primary bg-gray-100 bg-opacity-5'
                : 'hover:text-white'
            "
            @click="state.activeTab = tab.id"
            class="w-6/12">
            {{ tab.name }}
          </ui-button>
        </div>
        <ui-button icon title="Copy code" @click="copyCode">
          <ui-icon name="file-copy"></ui-icon>
        </ui-button>
      </div>
      <ui-prism-editor
        @change="onEditorChange"
        :model-value="state.appliedCSS[state.activeTab]"
        :readonly="state.activeTab === 'hover'"
        class="bg-gray-100 bg-opacity-5 max-h-64"></ui-prism-editor>
    </template>
    <div class="py-10 text-center" v-else>
      <span class="inline-block p-6 rounded-full mb-4 bg-gray-100 bg-opacity-5">
        <ui-icon name="cursor" size="36"></ui-icon>
      </span>
      <p>Click an element to see the properties</p>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted, watch } from 'vue';
import GetElementProperties from '@/utils/getElementProperties';
import GetAppliedCSS from '@/utils/getAppliedCSS';

export default {
  props: {
    activeElementId: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const tabs = [
      { name: 'CSS', id: 'css' },
      { name: ':hover', id: 'hover' },
    ];
    const state = reactive({
      properties: null,
      selected: false,
      copied: false,
      activeTab: 'css',
      appliedCSS: { css: '', ':hover': '' },
    });

    function onEditorChange(code) {
      if (state.activeTab === ':hover') return;

      const target = document.querySelector('[active-element]');
      target.setAttribute('style', code);

      state.appliedCSS.css = code;
    }
    function init() {
      const target = document.querySelector('[active-element]');

      if (!target) return;

      const properties = new GetElementProperties(target);

      state.properties = properties.getAll();
      state.appliedCSS = new GetAppliedCSS(target).all();
      state.selected = true;
    }
    function copyCode() {
      const { shadowRoot } = document.querySelector('.inspect-css');
      const textarea = shadowRoot.querySelector('.prism-editor__textarea');

      textarea.select();

      document.execCommand('copy');
    }

    watch(() => props.activeElementId, init);

    onMounted(init);

    return {
      tabs,
      state,
      copyCode,
      onEditorChange,
    };
  },
};
</script>
