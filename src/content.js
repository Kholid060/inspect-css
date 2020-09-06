import { createApp } from 'vue';
import App from './content/App.vue';
import VueMdijs from './plugins/vue-mdijs';
import style from './assets/scss/tailwind.scss';
import VueTippy from 'vue-tippy';

const app = createApp(App);
app.use(VueMdijs);

// const shadowEl = document.createElement('div');
// shadowEl.classList.add('inspector');
// shadowEl.attachShadow({ mode: 'open' });

// const { shadowRoot } = shadowEl;

// const rootElement = document.createElement('div');
// rootElement.classList.add('root');

// const styleEl = document.createElement('style');
// styleEl.innerText = style;

// shadowRoot.appendChild(rootElement);
// shadowRoot.appendChild(styleEl);
// document.body.appendChild(shadowEl);

const extensionContainer = document.createElement('div');
extensionContainer.classList.add('inspector');
document.body.appendChild(extensionContainer);

app.use(VueTippy);

app.mount(extensionContainer);
