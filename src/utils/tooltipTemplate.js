function applyAttributes(el, attributes) {
  attributes.forEach(({ key, value }) => {
    el.setAttribute(key, value);
  });

  return el;
}

export default function(id, { content, placement }) {
  console.log(content);
  const container = document.createElement('div');
  container.classList.add('tooltip-ui');
  container.setAttribute('tooltip-id', id);

  const tooltipContent = document.createElement('div');
  applyAttributes(tooltipContent, [
    { key: 'tabindex', value: 0 },
    { key: 'role', value: 'tooltip' },
    { key: 'class', value: 'tooltip-ui__content shadow-xl bg-primary rounded-lg px-3 py-1' },
    { key: 'data-placement', value: placement },
  ]);
  tooltipContent.innerText = content;

  container.appendChild(tooltipContent);

  return container;
}
