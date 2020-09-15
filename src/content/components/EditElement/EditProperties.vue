<template>
  <div class="properties p-5">
    <template v-if="state.selected">
      <element-properties :properties="state.properties" :show-info="false"></element-properties>
      <div class="flex bg-light p-1 rounded-lg mt-5 text-sm">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="{ 'bg-default': tab === state.activeTab }"
          class="w-6/12 rounded-lg focus:outline-none h-10 uppercase"
          @click="state.activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>
      <div class="properties__css-code mt-4">
        <codeflask
          class="h-48"
          :code="state.activeTab === ':hover' ? state.appliedCSS.hover : state.appliedCSS.css"
          @change="onEditorChange"
          :readonly="state.activeTab === ':hover'"
          v-show="state.activeTab === 'css' || state.appliedCSS.hover !== ''"
        ></codeflask>
      </div>
    </template>
    <div class="mt-10 text-center" v-else>
      <div class="p-8 inline-block rounded-full bg-light mb-5">
        <v-mdi name="mdi-cursor-default-click" size="36"></v-mdi>
      </div>
      <p class="text-light">Click an element to see the properties</p>
    </div>
  </div>
</template>
<script>
import { watch, reactive, onMounted } from 'vue';
import debounce from 'lodash.debounce';
import GetElementProperties from '~/utils/getElementProperties';
import GetAppliedCSS from '~/utils/getAppliedCSS';
import ElementProperties from '../ElementProperties.vue';
import Codeflask from '../Codeflask.vue';

export default {
  components: { ElementProperties, Codeflask },
  props: {
    activeElementId: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const state = reactive({
      properties: null,
      selected: false,
      activeTab: 'css',
      appliedCSS: { css: '', hover: '' },
    });
    const onEditorChange = debounce(code => {
      if (typeof code !== 'string' || state.activeTab === ':hover') return;

      const target = document.querySelector('.active-element');
      target.setAttribute('style', code);

      state.appliedCSS.css = code;
    }, 400);
    const init = () => {
      const target = document.querySelector('.active-element');

      if (!target) return;

      const properties = new GetElementProperties(target);

      state.properties = properties.getAll();
      state.appliedCSS = new GetAppliedCSS(target).all();
      state.selected = true;
    };

    watch(() => props.activeElementId, init);
    onMounted(init);

    return {
      state,
      tabs: ['css', ':hover'],
      onEditorChange,
    };
  },
};
</script>
