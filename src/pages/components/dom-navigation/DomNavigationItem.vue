<template>
  <div
    class="hover:bg-muted/90 dom-navigation-item rounded cursor-default flex items-start focus:bg-primary/40 focus:outline-none"
    :style="{ paddingLeft: (padding || 2) + 'px' }"
    tabindex="0"
    :data-path="nodeObject.path"
    @keydown="onKeydown"
    @click="domNavigationState?.updateActiveNode(nodeObject.path)"
  >
    <div class="pt-0.5 pl-1" @click="expandChildren()">
      <ChevronRight
        :class="[
          'h-3 w-3 text-muted-foreground inline',
          { 'rotate-90': expand, invisible: nodeObject.childCount < 1 },
        ]"
      />
    </div>
    <p class="flex-1 line-clamp-2 leading-tight pr-1 py-0.5">
      <span style="color: rgb(86, 156, 214)">{{ nodeObject.tagName }}</span>
      <span v-if="Object.keys(nodeObject.attrs).length > 0">
        <span>(</span>
        <span
          v-for="(attrValue, attrKey) in nodeObject.attrs"
          :key="depth + attrKey"
        >
          {{ attrKey }}="<span style="color: rgb(181, 206, 168)">{{
            attrValue
          }}</span
          >"
        </span>
        <span>)</span>
      </span>
      <span v-show="nodeObject.textContent" class="text-foreground">
        "{{ nodeObject.textContent }}"
      </span>
    </p>
  </div>
  <template v-if="nodeObject.childrens.length && expand">
    <DomNavigationItem
      v-for="(item, index) in nodeObject.childrens"
      :key="index + depth + dataPath"
      :node-object="item"
      :depth="depth + 1"
      :child-index="index"
      :path="dataPath"
    />
  </template>
</template>
<script setup lang="ts">
import { inject, toRef } from 'vue';
import {
  NodeObject,
  traverseElementChild,
} from '@root/src/utils/dom-navigator';
import { ChevronRight } from 'lucide-vue-next';
import { DOM_NAVIGATOR_KEY } from '../../content/ui/keys';
import { ToolbarNavigatorState } from '../../content/ui/app/toolbar/ToolbarNavigator.vue';

interface Props {
  path?: string;
  depth?: number;
  childIndex: number;
  defaultOpen?: boolean;
  nodeObject: NodeObject;
  parentNode?: NodeObject | null;
}

const props = withDefaults(defineProps<Props>(), {
  path: '',
  depth: 0,
  parentNode: null,
  defaultOpen: false,
});

const padding = props.depth * 8;
const dataPath = props.path + props.childIndex;

const domNavigationState = inject<ToolbarNavigatorState>(DOM_NAVIGATOR_KEY);

const expand = toRef(props, 'defaultOpen');

function updateChildren() {
  if (
    props.nodeObject.childCount < 1 ||
    props.nodeObject.childrens.length !== 0
  )
    return;

  const element = document.querySelector<HTMLElement>(props.nodeObject.path);
  if (!element) return;

  domNavigationState?.updateTreeNode({
    path: dataPath,
    children: traverseElementChild(element),
  });
}
function expandChildren(force?: boolean) {
  updateChildren();
  expand.value = typeof force === 'boolean' ? force : !expand.value;
}
function onKeydown({ code }: KeyboardEvent) {
  if (!props.nodeObject.childCount) return;

  switch (code) {
    case 'ArrowRight':
      expandChildren(true);
      break;
    case 'ArrowLeft':
      expand.value = false;
      break;
  }
}
</script>
