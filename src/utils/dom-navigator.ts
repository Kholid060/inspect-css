import { EL_ATTR_NAME } from './constant';

const IGNORE_TAGS = ['HEAD', 'STYLE', 'SCRIPT'];
const IGNORE_ATTRS = [...Object.values(EL_ATTR_NAME), 'style'];

export interface NodeObject {
  path: string;
  tagName: string;
  childCount: number;
  textContent?: string;
  childrens: NodeObject[];
  attrs: Record<string, string>;
}

export function getElementPath(element: Element, root = document.body): string {
  if (element === root) return element.tagName.toLowerCase();

  const siblings = element.parentNode?.childNodes;
  if (!siblings) return '';

  let childIndex = 1;
  for (let index = 0; index < siblings.length; index++) {
    const sibling = siblings[index];

    if (sibling === element) {
      let selector = `>${element.tagName.toLowerCase()}`;
      if (childIndex > 1) selector += `:nth-child(${childIndex})`;

      return getElementPath(element.parentNode as Element, root) + selector;
    }

    if (
      sibling.nodeType === Node.ELEMENT_NODE &&
      (<Element>sibling).tagName === element.tagName
    ) {
      childIndex += 1;
    }
  }

  return '';
}

export function elementToNodeObject(element: Element) {
  const attrs: Record<string, string> = {};
  const childCount = element.childElementCount;

  for (let index = 0; index < element.attributes.length; index += 1) {
    const attr = element.attributes.item(index);
    if (!attr || IGNORE_ATTRS.includes(attr.name)) continue;

    attrs[attr.name] = attr.value;
  }

  const nodeObject: NodeObject = {
    attrs,
    path: '',
    childCount,
    childrens: [],
    tagName: element.tagName.toLowerCase(),
  };
  if (childCount === 0) nodeObject.textContent = element.textContent || '';

  return nodeObject;
}

export function traverseElementChild(element: Element, path?: string) {
  const children: NodeObject[] = [];
  const parentPath = path || getElementPath(element);

  let elementIndex = 1;
  element.childNodes.forEach((node) => {
    if (!(node instanceof Element)) return;
    if (IGNORE_TAGS.includes(node.tagName)) {
      elementIndex += 1;
      return;
    }

    const nodeObject = elementToNodeObject(node);
    nodeObject.path = `${parentPath}>${node.tagName.toLowerCase()}`;
    if (elementIndex > 1) nodeObject.path += `:nth-child(${elementIndex})`;

    children.push(nodeObject);

    elementIndex += 1;
  });

  return children;
}
