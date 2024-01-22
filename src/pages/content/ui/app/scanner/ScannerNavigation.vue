<template>
  <div
    v-if="elNavigation"
    ref="containerRef"
    class="text-xs text-muted-foreground p-4 border-b shadow-inner overflow-hidden"
    :style="{ height: CONTAINER_HEIGHT + 'px' }"
  >
    <p class="line-clamp-1">{{ elNavigation.parent?.name }}</p>
    <div
      v-for="(node, index) in elNavigation.nodes"
      :id="`node-${index}`"
      :key="node.name"
      class="overflow-hidden"
    >
      <p
        :class="[
          'line-clamp-1 -ml-px',
          activeNode === index && 'text-primary font-semibold',
        ]"
      >
        {{ getNodeArrow(index) + ' ' + node.name }}
      </p>
      <p v-if="node.firstChild" class="line-clamp-1 flex-1">
        <span
          :style="{
            visibility:
              index !== elNavigation.nodes.length - 1 ? 'visible' : 'hidden',
          }"
          >│</span
        >
        <span class="pl-2">{{ '└─ ' + node.firstChild.name }}</span>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getElBasicSelector } from '@root/src/utils/getElProperties';
import { debounce } from '@root/src/utils/helper';
import { ref, shallowRef, watch } from 'vue';

interface NavigationNodeItem {
  id: number;
  name: string;
  element: Element;
  childCount: number;
  firstChild: null | { name: string; element: Element };
}
interface ElementNavigation {
  nodes: NavigationNodeItem[];
  parent: null | { name: string; element: Element };
}

const emits = defineEmits<{
  (e: 'select', element: Element): void;
}>();

const CONTAINER_HEIGHT = 56;
const IGNORE_TAG = ['STYLE', 'HEAD', 'SCRIPT'];

const activeNode = shallowRef(-1);
const containerRef = ref<HTMLDivElement>();
const elNavigation = shallowRef<ElementNavigation | null>(null);

watch(
  [activeNode, elNavigation],
  debounce(() => {
    if (!containerRef.value) return;

    const el = containerRef.value.querySelector<HTMLElement>(
      `#node-${activeNode.value}`,
    );

    if (!el) return;

    containerRef.value.scrollTo({
      behavior: 'smooth',
      top: el.offsetTop - CONTAINER_HEIGHT / 2 + 6,
    });
  }, 100),
  { flush: 'post' },
);

function getNodeArrow(index: number) {
  const { nodes, parent } = elNavigation.value!;

  if (!elNavigation.value || (nodes.length === 1 && !parent)) return '';

  if (index === nodes.length - 1) return '└─';
  if (index === 0 && !parent) return '┎─';

  return '├─';
}
function getElNavigation(element: Element) {
  let nodeId = -1;
  let activeIndex = 0;

  const isValidNode = (node: Element) => !IGNORE_TAG.includes(node.tagName);
  const extractNode = (node: Element): NavigationNodeItem => {
    nodeId += 1;

    const firstChild =
      node.firstElementChild && isValidNode(node.firstElementChild)
        ? {
            element: node.firstElementChild,
            name: getElBasicSelector(node.firstElementChild).string,
          }
        : null;

    return {
      id: nodeId,
      firstChild,
      element: node,
      childCount: node.childElementCount,
      name: getElBasicSelector(node).string,
    };
  };

  const parent = element.parentElement && {
    element: element.parentElement,
    name: getElBasicSelector(element.parentElement).string,
  };
  const nodes: NavigationNodeItem[] = [extractNode(element)];

  let nextSibling = element.nextElementSibling;
  while (nextSibling) {
    if (isValidNode(nextSibling)) nodes.push(extractNode(nextSibling));
    nextSibling = nextSibling.nextElementSibling;
  }

  let prevSibling = element.previousElementSibling;
  while (prevSibling) {
    if (isValidNode(prevSibling)) {
      nodes.unshift(extractNode(prevSibling));
      activeIndex += 1;
    }
    prevSibling = prevSibling.previousElementSibling;
  }

  return { parent, nodes, activeIndex };
}
function updateNavigation(element: Element) {
  const navigation = getElNavigation(element);
  elNavigation.value = navigation;
  activeNode.value = navigation.activeIndex;
}
function navigate(direction: 'up' | 'down' | 'left' | 'right') {
  if (!containerRef.value || !elNavigation.value) return;

  const { nodes, parent } = elNavigation.value;

  const switchParent = () => {
    if (!parent || parent.element === document.documentElement) return;

    const newNavigation = getElNavigation(parent.element);
    elNavigation.value = newNavigation;
    activeNode.value = newNavigation.activeIndex;
  };

  switch (direction) {
    case 'up':
      activeNode.value === 0 ? switchParent() : (activeNode.value -= 1);
      break;
    case 'down':
      activeNode.value = Math.min(activeNode.value + 1, nodes.length - 1);
      break;
    case 'left':
      switchParent();
      break;
    case 'right': {
      const child = nodes[activeNode.value].firstChild;
      if (child) {
        const newNavigation = getElNavigation(child.element);
        elNavigation.value = newNavigation;
        activeNode.value = newNavigation.activeIndex;
      }

      break;
    }
  }

  const newActiveEl = elNavigation.value.nodes[activeNode.value];
  if (!newActiveEl) return;

  emits('select', newActiveEl.element);
}

defineExpose({ updateNavigation, navigate });
</script>
