import { createApp } from 'vue';
import App from './App.vue?shadow';
import compsUi from '../lib/comps-ui';

const app = createApp(App);

app.use(compsUi);

export function insertShadowRoot(shadowRoot) {
  App.shadowRoot = shadowRoot;
}

export default app;
