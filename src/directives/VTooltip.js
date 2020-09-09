import CreateTooltip from '~/utils/createTooltip';

const setOptions = (content, placement) => {
  const { shadowRoot } = document.querySelector('.inspector');

  if (typeof content === 'string') {
    return {
      content,
      placement,
      tooltipRoot: shadowRoot,
    };
  }

  if (typeof content === 'object' && object !== null) {
    return {
      tooltipRoot: shadowRoot,
      ...content,
    };
  }
};

export default {
  mounted(el, { value, arg = 'top', instance }) {
    el._tooltip = new CreateTooltip(el, setOptions(value, arg));
  },
  updated(el, { value, arg = 'top' }) {
    el._tooltip.setOptions(setOptions(value, arg));
  },
};
