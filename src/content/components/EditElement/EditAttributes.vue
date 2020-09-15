<template>
  <div class="edit-attributes p-5">
    <h3 class="mb-3 font-semibold">Edit Attributes</h3>
    <form @submit.prevent="addAttribute" class="rounded-md add-form border text-sm flex items-center mb-6" autocomplete="off">
      <input name="key" type="text" class="p-2 w-5/12 bg-transparent" v-model="state.key" placeholder="key" />
      <input name="value" type="text" class="p-2 w-5/12 bg-transparent" v-model="state.value" placeholder="value" />
      <button class="p-2 focus:outline-none w-2/12 text-primary" type="submit">
        <v-mdi name="mdi-plus"></v-mdi>
      </button>
    </form>
    <p class="text-light mt-6 text-center text-opacity-75 text-sm" v-show="Object.keys(state.attributes).length === 0">
      There's no attribute that you can edit
    </p>
    <div class="flex items-center mb-3" v-for="(value, key) in state.attributes" v-bind="{ key }">
      <p class="text-overflow w-4/12 text-light" :title="key">{{ key }}</p>
      <input
        type="text"
        class="mx-2 w-7/12 bg-light px-3 focus:outline-none py-2 text-sm rounded-md"
        @input="updateAttribute($event.target.value, key)"
        :value="state.attributes[key]"
      />
      <button class="w-1/12" title="Delete attribute" @click="deleteAttribute(key)">
        <v-mdi name="mdi-delete" class="text-danger"></v-mdi>
      </button>
    </div>
  </div>
</template>
<script>
import { watch, onMounted, reactive } from 'vue';
import debounce from 'lodash.debounce';

export default {
  props: {
    activeElementId: Number,
  },
  setup(props) {
    const blackListAttrs = ['style'];
    const state = reactive({
      attributes: {},
      key: '',
      value: '',
    });
    const init = () => {
      const target = document.querySelector('.active-element');

      if (!target) return;

      const attributes = Array.from(target.attributes).reduce((attrs, { name, value }) => {
        if (blackListAttrs.includes(name)) return attrs;

        attrs[name] = value.replace('active-element', '');

        return attrs;
      }, {});
      state.attributes = attributes;
    };
    const updateAttribute = debounce((value, key) => {
      let newAttribute = value;

      if (key === 'class') {
        const findActiveClasses = key.split(' ').includes('active-element');

        if (!findActiveClasses) {
          newAttribute += ' active-element';
        }
      }

      const activeElement = document.querySelector('.active-element');

      activeElement.setAttribute(key, newAttribute);
    }, 400);
    const addAttribute = () => {
      if (state.key === '' || blackListAttrs.includes(state.key)) return;

      updateAttribute(state.value, state.key);
      state.attributes[state.key] = state.value;
      state.key = state.value = '';
    };
    const deleteAttribute = key => {
      const activeElement = document.querySelector('.active-element');
      activeElement.removeAttribute(key);

      delete state.attributes[key];
    };

    watch(() => props.activeElementId, init);
    onMounted(init);

    return {
      state,
      addAttribute,
      deleteAttribute,
      updateAttribute,
    };
  },
};
</script>
