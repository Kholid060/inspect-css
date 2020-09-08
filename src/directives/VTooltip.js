import CreateTooltip from '~/utils/createTooltip';

export default function(el, { value, args = 'top' }) {
  const { shadowRoot } = document.querySelector('.inspector');
  // TO DO why the fuck all the valus is same
  // Split Code
  const test = new CreateTooltip(el, {
    placement: args,
    tooltipRoot: shadowRoot,
    content: value,
  });
  console.log(test);
}
