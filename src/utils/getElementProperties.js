const filterClasses = classes => {
  const blackListClasses = ['hover-element', 'active-element'];
  const filtered = classes.filter(name => !blackListClasses.includes(name));

  return filtered.length !== 0 ? `.${filtered.join('.')}` : '';
};
const computedStyle = () => getComputedStyle(target);

export const deletePx = text => {
  if (text === 'fontFamily') return;
  const value = text.replace('px', '');

  return +value === 0 ? '-' : Math.floor(value);
};

export const computedStyleKeys = ['margin-bottom', 'margin-top', 'margin-right', 'margin-left', 'padding-bottom', 'padding-top', 'padding-right', 'padding-left', 'fontFamily'];

export const getSelector = target => {
  const selector = {
    tag: target.tagName.toLowerCase(),
    id: target.id ? `#${target.id}` : '',
    classes: filterClasses(Array.from(target.classList)),
  };

  return selector;
};

export default function(target) {
  const { height, width } = target.getBoundingClientRect();
  const computedStyles = computedStyleKeys.reduce((styles, key) => {
    const value = getComputedStyle(target)[key];

    styles[key] = key === 'fontFamily' ? value.split(',')[0].replace(/"/g, '') : deletePx(value);

    return styles;
  }, {});

  return {
    selector: getSelector(target),
    size: {
      height,
      width,
    },
    computedStyles,
  };
}
