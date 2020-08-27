import { createApp } from 'vue';
import App from './content/App.vue';
import VueMdijs from './plugins/vue-mdijs';
import style from '~/assets/scss/tailwind.scss';

const app = createApp(App);
app.use(VueMdijs);

const shadowEl = document.createElement('div');
shadowEl.classList.add('inspector');
shadowEl.attachShadow({ mode: 'open' });

const { shadowRoot } = shadowEl;

const rootElement = document.createElement('div');
rootElement.classList.add('root');

const styleEl = document.createElement('style');
styleEl.innerText = style;

shadowRoot.appendChild(rootElement);
shadowRoot.appendChild(styleEl);
document.body.appendChild(shadowEl);

app.mount(rootElement);
