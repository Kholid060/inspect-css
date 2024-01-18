<template>
  <div class="space-y-4 p-4">
    <div class="flex items-center">
      <p class="font-semibold">Attributes</p>
      <div class="flex-1"></div>
      <button
        class="h-8 px-3 bg-secondary inline-flex items-center text-secondary-foreground hover:bg-secondary/80 text-sm transition rounded-md"
        @click="addAttribute"
        ><PlusIcon class="h-5 w-5 mr-1 -ml-1" /> Add</button
      >
    </div>
    <div
      v-for="(attr, index) in attrs"
      :key="index"
      class="bg-input/30 rounded-md text-sm focus-within:ring-primary focus-within:ring-2">
      <div
        class="bg-input/50 rounded-t-md border-b flex items-center gap-2 pr-3">
        <input
          :value="attr.name"
          type="text"
          class="bg-transparent font-semibold h-9 pl-3 pr-12 flex-1 focus:outline-none"
          placeholder="Attribute name"
          @input="
            updateAttribute({
              index,
              type: 'name',
              value: (<HTMLTextAreaElement>$event.target).value,
            })
          " />
        <button class="text-muted-foreground" @click="deleteAttribute(index)">
          <TrashIcon class="h-5 w-5" />
        </button>
      </div>
      <textarea
        :value="attr.value"
        placeholder="Attribute value"
        class="min-h-4 p-2 px-3 w-full bg-transparent resize-y focus:outline-none"
        @input="
          updateAttribute({
            index,
            type: 'value',
            value: (<HTMLTextAreaElement>$event.target).value,
          })
        " />
    </div>
  </div>
</template>
<script setup lang="ts">
import { EL_ATTR_NAME } from '@root/src/utils/constant';
import { debounce } from '@root/src/utils/helper';
import { PlusIcon, TrashIcon } from 'lucide-vue-next';
import { ref, watch } from 'vue';

interface AttrItem {
  name: string;
  value: string;
}

const props = defineProps<{
  element: Element;
}>();

const IGNORE_ATTRS = Object.values(EL_ATTR_NAME);

const attrs = ref<Array<AttrItem>>([]);

const updateAttribute = debounce(
  ({
    type,
    index,
    value,
  }: {
    index: number;
    value: string;
    type: 'name' | 'value';
  }) => {
    const attr = attrs.value[index];
    if (!attr) return;

    if (type === 'name') {
      if (!value.trim()) return;

      props.element.removeAttribute(attr.name);
      props.element.setAttribute(value, attr.value);
    } else {
      props.element.setAttribute(attr.name, value);
    }

    attr[type] = value;
  },
  200,
);
function addAttribute() {
  attrs.value.push({ name: '', value: '' });
}
function deleteAttribute(index: number) {
  const attr = attrs.value[index];
  if (!attr) return;

  attrs.value.splice(index, 1);
  props.element.removeAttribute(attr.name);
}

watch(
  () => props.element,
  () => {
    attrs.value = [...props.element.attributes].reduce<AttrItem[]>(
      (acc, curr) => {
        if (!IGNORE_ATTRS.includes(curr.name)) {
          acc.push({
            name: curr.name,
            value: curr.value,
          });
        }

        return acc;
      },
      [],
    );
  },
  { immediate: true },
);
</script>
