import CreateTooltip from '~/utils/createTooltip';

export default () => {
  const options = typeof value === 'string' ? { content: value } : value;
  const { shadowRoot } = document.querySelector('.inspector');

  const test = new CreateTooltip(el, {
    placement: args,
    tooltipRoot: shadowRoot,
    ...options,
  });
};
