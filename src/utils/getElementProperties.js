function generateKeys(name) {
  const directions = ['top', 'right', 'bottom', 'left'];
  const keys = directions.map(direction => `${name}-${direction}`);

  return keys;
}

function removePx(text) {
  if (text === 'fontFamily') return;
  const value = text.replace('px', '');

  return +value === 0 ? '-' : Math.floor(value);
}

function filterClasses(classes) {
  const blackListClasses = ['hover-element', 'active-element'];
  const filtered = classes.filter(name => !blackListClasses.includes(name));

  return filtered.length !== 0 ? `.${filtered.join('.')}` : '';
}

export default class ElementProperties {
  constructor(reference) {
    this.reference = reference;
    this.computedStyleKeys = [...generateKeys('margin'), ...generateKeys('padding'), 'fontFamily'];
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
