<template>
  <div class="space-y-4 pt-2">
    <div class="flex items-center">
      <p class="font-semibold">Attributes</p>
      <div class="flex-1"></div>
      <button
        class="h-8 px-3 bg-secondary inline-flex items-center highlight-white/5 text-secondary-foreground hover:bg-secondary/80 text-sm transition rounded-sm"
        @click="addAttribute"
      >
        <PlusIcon class="h-5 w-5 mr-1 -ml-1" /> Add
      </button>
    </div>
    <div
      v-for="(attr, index) in attrs"
      :key="index"
      class="bg-input/30 rounded-md text-sm border focus-within:ring-primary focus-within:ring-2 highlight-white/5 relative"
    >
      <div
        class="bg-input/50 rounded-t-md border-b flex items-center gap-2 pr-3"
      >
        <input
          :value="attr.name"
          type="text"
          class="bg-transparent font-semibold h-9 px-3 flex-1 focus:outline-none w-auto"
          placeholder="Attribute name"
          @input="
            updateAttribute({
              index,
              type: 'name',
              value: (<HTMLTextAreaElement>$event.target).value,
            })
          "
        />
        <UiTooltip v-if="isImgEl && attr.name === 'src'" label="Update image">
          <UiButton
            class="flex-shrink-0"
            size="icon-xs"
            variant="secondary"
            @click="inputFile?.click()"
          >
            <FolderOpenIcon class="h-5 w-5" />
          </UiButton>
        </UiTooltip>
        <UiTooltip v-if="attr.isInvalid" label="Invalid attribute name">
          <AlertTriangleIcon class="h-5 w-5 text-red-400 mr-1" />
        </UiTooltip>
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
        "
      />
    </div>
  </div>
  <input
    ref="inputFile"
    type="file"
    class="hidden"
    accept="image/*"
    @change="updateImgSrc"
  />
</template>
<script setup lang="ts">
import UiButton from '@root/src/pages/components/ui/UiButton.vue';
import UiTooltip from '@root/src/pages/components/ui/UiTooltip.vue';
import { EL_ATTR_NAME } from '@root/src/utils/constant';
import { debounce } from '@root/src/utils/helper';
import {
  PlusIcon,
  TrashIcon,
  FolderOpenIcon,
  AlertTriangleIcon,
} from 'lucide-vue-next';
import { ref, shallowRef, triggerRef, watch } from 'vue';

interface AttrItem {
  name: string;
  value: string;
  isInvalid: boolean;
}

const props = defineProps<{
  element: Element;
}>();

const IGNORE_ATTRS = Object.values(EL_ATTR_NAME) as string[];

const inputFile = ref<HTMLInputElement>();

const isImgEl = shallowRef(false);
const attrs = shallowRef<Array<AttrItem>>([]);

const updateAttribute = debounce(
  ({
    type,
    index,
    value,
    trigger,
  }: {
    index: number;
    value: string;
    trigger?: boolean;
    type: 'name' | 'value';
  }) => {
    const attr = attrs.value[index];
    if (!attr) return;

    try {
      attr[type] = value;

      if (type === 'name') {
        if (!value.trim()) return;

        props.element.removeAttribute(attr.name);
        props.element.setAttribute(value, attr.value);
      } else {
        props.element.setAttribute(attr.name, value);
      }

      if (attr.isInvalid) {
        trigger = true;
        attr.isInvalid = false;
      }
    } catch (error) {
      trigger = true;
      attr.isInvalid = true;
    } finally {
      if (trigger) triggerRef(attrs);
    }
  },
  200,
);
function addAttribute() {
  attrs.value.push({ name: '', value: '', isInvalid: false });
  triggerRef(attrs);
}
function deleteAttribute(index: number) {
  const attr = attrs.value[index];
  if (!attr) return;

  attrs.value.splice(index, 1);
  props.element.removeAttribute(attr.name);
  triggerRef(attrs);
}
function updateImgSrc() {
  const file = inputFile.value?.files?.item(0);
  if (!file || !file.type.startsWith('image')) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const imgSrcIndex = attrs.value.findIndex((attr) => attr.name === 'src');
    if (imgSrcIndex === -1) return;

    updateAttribute({
      type: 'value',
      trigger: true,
      index: imgSrcIndex,
      value: reader.result as string,
    });
  };
}

watch(
  () => props.element,
  () => {
    isImgEl.value = props.element instanceof HTMLImageElement;
    attrs.value = [...props.element.attributes].reduce<AttrItem[]>(
      (acc, curr) => {
        if (IGNORE_ATTRS.includes(curr.name)) return acc;

        acc.push({
          name: curr.name,
          isInvalid: false,
          value: curr.value,
        });

        return acc;
      },
      [],
    );
  },
  { immediate: true },
);
</script>
