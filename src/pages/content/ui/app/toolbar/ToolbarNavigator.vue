<template>
  <div class="p-4 text-sm w-[400px] min-h-52 max-h-96 overflow-auto">
    <p class="font-semibold">Navigator</p>
    <div
      class="text-xs mt-2"
      :style="{ color: defaultSettingsTheme.foreground }"
      @keydown="onKeydown"
    >
      <DomNavigationItem
        v-if="treeNode"
        :node-object="treeNode"
        :child-index="0"
        default-open
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, provide, shallowRef } from 'vue';
import {
  NodeObject,
  elementToNodeObject,
  traverseElementChild,
} from '@root/src/utils/dom-navigator';
import DomNavigationItem from '@root/src/pages/components/dom-navigation/DomNavigationItem.vue';
import { defaultSettingsTheme } from '@src/lib/codemirror/theme';
import { DOM_NAVIGATOR_KEY } from '../../keys';
import { emitter } from '@root/src/lib/mitt';
import getElProperties from '@root/src/utils/getElProperties';
import { EL_ATTR_NAME } from '@root/src/utils/constant';
import { useAppProvider } from '../../app-plugin';

export interface ToolbarNavigatorState {
  updateActiveNode: (value: string) => void;
  updateTreeNode: (detail: { path: string; children: NodeObject[] }) => void;
}

const APP_NAVIGATION_ITEM_CLASS = 'dom-navigation-item';

const appProvider = useAppProvider();

const treeNode = shallowRef<NodeObject | null>(null);

function updateActiveNode(elPath: string) {
  if (!elPath) return;

  const element = document.querySelector(elPath);
  if (!element) return;

  const selectedElement = document.querySelector(`[${EL_ATTR_NAME.selected}]`);
  selectedElement?.removeAttribute(EL_ATTR_NAME.selected);

  element.setAttribute(EL_ATTR_NAME.selected, 'true');

  const properties = getElProperties(element).getAll();
  emitter.emit('content:el-selected', {
    properties,
    el: element,
  });
}
function updateTreeNode({
  path,
  children,
}: {
  path: string;
  children: NodeObject[];
}) {
  let currentNode = treeNode.value;
  if (!currentNode) return;

  for (let index = 0; index < path.length; index += 1) {
    // skip root
    if (index === 0) continue;

    const childIndex = +path[index];
    currentNode = currentNode.childrens[childIndex];
  }

  if (!currentNode) return;
  currentNode.childrens = children;
}
function onKeydown(event: KeyboardEvent) {
  let { activeElement } = appProvider.shadowRoot;
  if (
    !activeElement ||
    !activeElement.classList.contains(APP_NAVIGATION_ITEM_CLASS)
  )
    return;

  if (event.code === 'ArrowDown') {
    activeElement = activeElement.nextElementSibling;
  } else if (event.code === 'ArrowUp') {
    activeElement = activeElement.previousElementSibling;
  }

  if (
    !activeElement ||
    !activeElement.classList.contains(APP_NAVIGATION_ITEM_CLASS)
  )
    return;

  event.preventDefault();
  (activeElement as HTMLElement).focus();

  if (event.repeat) return;

  updateActiveNode((activeElement as HTMLElement).dataset.path || '');
}

provide<ToolbarNavigatorState>(DOM_NAVIGATOR_KEY, {
  updateTreeNode,
  updateActiveNode,
});

onMounted(() => {
  const rootElement = document.body;
  const rootObject = elementToNodeObject(rootElement);
  rootObject.path = 'body';
  rootObject.childrens = traverseElementChild(rootElement);

  treeNode.value = rootObject;
});
</script>
