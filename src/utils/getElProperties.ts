function generateBoxModels(name: string) {
  const directions = ['top', 'right', 'bottom', 'left'];
  const keys = directions.map((direction) => `${name}-${direction}`);

  return keys;
}

function removePx(str: string) {
  if (str === 'fontFamily') return '';

  const value = +str.replace('px', '');
  const result = value === 0 ? '-' : Math.floor(value);

  return result;
}

type ComputedStyles = Record<string, string | number>;

export interface ElementBasicSelector {
  id: string;
  tag: string;
  classes: string;
}

export interface ElementProperties {
  selector: ElementBasicSelector;
  computedStyles: ComputedStyles;
  size: { height: number; width: number };
}

export function getElBasicSelector(target: Element) {
  const selector: ElementBasicSelector = {
    tag: target.tagName.toLowerCase(),
    id: target.id ? `#${target.id}` : '',
    classes: Array.from(target.classList).join('.'),
  };
  if (selector.classes) selector.classes = `.${selector.classes}`;

  return {
    ...selector,
    string: `${selector.tag}${selector.id}${selector.classes}`,
  };
}

function getElProperties(target: Element) {
  const computedStyleKeys = [
    ...generateBoxModels('margin'),
    ...generateBoxModels('padding'),
    'fontSize',
    'fontFamily',
  ];
  const selector = getElBasicSelector(target);

  const getSize = () => {
    const { height, width } = target.getBoundingClientRect();
    return { height, width };
  };
  const getComputedStyles = () => {
    const computedStyles = computedStyleKeys.reduce<ComputedStyles>(
      (styles, key: string) => {
        const value = getComputedStyle(target)[
          key as keyof CSSStyleDeclaration
        ] as string;

        styles[key] =
          key === 'fontFamily'
            ? value.split(',')[0].replace(/"/g, '')
            : removePx(value);

        return styles;
      },
      {},
    );

    return computedStyles;
  };
  const getAll = () => {
    const properties = {
      selector,
      size: getSize(),
      computedStyles: getComputedStyles(),
    };

    return properties;
  };

  return {
    getAll,
    getSize,
    selector,
    getComputedStyles,
  };
}

export default getElProperties;
