import { createApp } from 'vue';
import Browser from 'webextension-polyfill';
import App from '@root/src/pages/content/ui/App.vue';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import injectedStyle from './injected.css?inline';
import fontCss from '@assets/style/fonts.css?inline';
import { EL_ATTR_NAME } from '@root/src/utils/constant';
import { appPlugin } from './app-plugin';
import { MotionPlugin } from '@vueuse/motion';

refreshOnUpdate('pages/content');

function initSelectedStyleEl() {
  const selectedElStyle = document.createElement('style');
  selectedElStyle.id = 'inspect-css-style';
  selectedElStyle.textContent = `
    [${EL_ATTR_NAME.hover}] { outline: 2px solid hsl(0deg 90.6% 70.78%) }
    [${EL_ATTR_NAME.selected}="true"] { outline: 2px solid hsl(217.22deg 91.22% 59.8%) !important }
    [${EL_ATTR_NAME.dragging}] { user-select: none !important; }
  `;

  document.head.appendChild(selectedElStyle);
}

function initApp() {
  const appId = 'inspect-css-root';
  const appExists = Boolean(document.getElementById(appId));
  if (appExists) return false;

  const root = document.createElement('div');
  root.id = appId;
  root.setAttribute('style', 'all: unset');

  document.body.append(root);

  const rootIntoShadow = document.createElement('div');
  rootIntoShadow.id = 'shadow-root';

  const shadowRoot = root.attachShadow({ mode: 'open' });
  shadowRoot.appendChild(rootIntoShadow);

  // Font styyle
  const fontURL = Browser.runtime.getURL('/assets/');
  const fontStyle = document.createElement('style');
  fontStyle.textContent = fontCss.replaceAll('/assets/', fontURL);
  document.head.appendChild(fontStyle);

  // Inject styles into shadow dom
  const styleElement = document.createElement('style');
  styleElement.innerHTML = injectedStyle;
  shadowRoot.appendChild(styleElement);

  initSelectedStyleEl();

  createApp(App)
    .use(appPlugin, shadowRoot)
    .use(MotionPlugin)
    .mount(rootIntoShadow);

  return true;
}

(() => {
  initApp();

  Browser.runtime.onMessage.addListener((message: { type: string }) => {
    if (message?.type !== 'init') return;

    initApp();
  });
})();
