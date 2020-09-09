import style from './assets/scss/style.scss';

const styleEl = document.createElement('style');
styleEl.innerText = style;

const { shadowRoot } = document.querySelector('.inspector');

shadowRoot.appendChild(styleEl);
