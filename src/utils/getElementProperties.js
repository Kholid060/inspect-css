/* eslint-disable no-param-reassign */

function generateBoxModels(name) {
  const directions = ['top', 'right', 'bottom', 'left'];
  const keys = directions.map((direction) => `${name}-${direction}`);

  return keys;
}

function removePx(str) {
  if (str === 'fontFamily') return '';

  const value = str.replace('px', '');
  const result = +value === 0 ? '-' : Math.floor(value);

  return result;
}

function filterClasses(classes) {
  const blackListClasses = ['hover-element', 'active-element'];
  const filtered = classes.filter((name) => !blackListClasses.includes(name));

  return filtered.length !== 0 ? `.${filtered.join('.')}` : '';
}

class ElementProperties {
  constructor(reference) {
    this.reference = reference;
    this.computedStyleKeys = [
      ...generateBoxModels('margin'),
      ...generateBoxModels('padding'),
      'fontFamily',
    ];
  }

  getSelector() {
    const selector = {
      tag: this.reference.tagName.toLowerCase(),
      id: this.reference.id ? `#${this.reference.id}` : '',
      classes: filterClasses(Array.from(this.reference.classList)),
    };

    return selector;
  }

  getSize() {
    const { height, width } = this.reference.getBoundingClientRect();

    return { height, width };
  }

  getComputedStyles() {
    const computedStyles = this.computedStyleKeys.reduce((styles, key) => {
      const value = getComputedStyle(this.reference)[key];

      styles[key] = key === 'fontFamily' ? value.split(',')[0].replace(/"/g, '') : removePx(value);

      return styles;
    }, {});

    return computedStyles;
  }

  getAll() {
    const properties = {
      selector: this.getSelector(),
      size: this.getSize(),
      computedStyles: this.getComputedStyles(),
    };

    return properties;
  }
}

export default ElementProperties;
