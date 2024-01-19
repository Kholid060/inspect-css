<template>
  <div class="px-4">
    <div v-if="activeElementId === 0" class="py-10 text-center">
      <span class="inline-block p-6 rounded-full mb-4 bg-gray-100 bg-opacity-5">
        <ui-icon name="cursor" size="36"></ui-icon>
      </span>
      <p>Click an element to edit attributes</p>
    </div>
    <template v-else>
      <form
        class="border border-gray-100 border-opacity-5 w-full flex items-center rounded-lg mb-4"
        @submit.prevent="addAttribute"
      >
        <input
          v-model="state.key"
          type="text"
          class="flex-1 h-full pl-4 bg-transparent focus:ring-0 pr-2"
          placeholder="Attribute name"
        />
        <ui-button icon type="submit" class="text-primary">
          <ui-icon name="add"></ui-icon>
        </ui-button>
      </form>
      <div class="space-y-2">
        <transition-group name="list-transition">
          <div
            v-for="(value, key) in state.attributes"
            :key="key"
            class="bg-gray-100 bg-opacity-5 rounded-lg p-4 list-transition"
          >
            <label class="text-sm text-gray-300" :for="key">{{ key }}</label>
            <div class="flex items-center">
              <input
                :id="key"
                :value="value"
                placeholder="value"
                type="text"
                class="flex-1 mr-4 focus:ring-0 bg-transparent"
                @input="updateAttribute(key, $event.target.value)"
              />
              <ui-icon
                name="delete-bin"
                class="text-red-500 cursor-pointer"
                @click="deleteAttribute(key)"
              ></ui-icon>
            </div>
          </div>
        </transition-group>
      </div>
    </template>
  </div>
</template>
<script>
import { onMounted, watch, reactive } from 'vue';

export default {
  props: {
    activeElementId: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const blackListAttrs = ['style', 'active-element'];
    const state = reactive({
      attributes: {},
      key: '',
    });

    function init() {
      const target = document.querySelector('[active-element]');

      if (!target) return;

      const attributes = Array.from(target.attributes).reduce(
        (attrs, { name, value }) => {
          if (blackListAttrs.includes(name)) return attrs;

          attrs[name] = value;

          return attrs;
        },
        {},
      );

      state.attributes = attributes;
    }
    function updateAttribute(key, value) {
      const newAttribute = value;

      const activeElement = document.querySelector('[active-element]');

      state.attributes[key] = newAttribute;
      activeElement.setAttribute(key, newAttribute);
    }
    function addAttribute() {
      if (
        state.key === '' ||
        blackListAttrs.includes(state.key.toLowerCase()) ||
        state.attributes[state.key]
      )
        return;

      updateAttribute(state.key, '');

      state.attributes[state.key] = '';
      state.key = '';
    }
    function deleteAttribute(key) {
      const activeElement = document.querySelector('[active-element]');
      activeElement.removeAttribute(key);

      delete state.attributes[key];
    }

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
