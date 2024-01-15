import { createApp } from 'vue';
import Browser from 'webextension-polyfill';
import App from '@root/src/pages/content/ui/App.vue';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import injectedStyle from './injected.css?inline';
import fontCss from '@assets/style/fonts.css?inline';
import { SELECTED_EL_ATTR_NAME } from '@root/src/utils/constant';

refreshOnUpdate('pages/content');

function initSelectedStyleEl() {
  const selectedElStyle = document.createElement('style');
  selectedElStyle.id = 'inspect-css-style';
  selectedElStyle.textContent = `
    [${SELECTED_EL_ATTR_NAME}] { outline: 1px solid hsl(0deg 90.6% 70.78%) }
    [${SELECTED_EL_ATTR_NAME}="true"] { outline-color: hsl(217.22deg 91.22% 59.8%) }
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

  /** Inject styles into shadow dom */
  const styleElement = document.createElement('style');
  styleElement.innerHTML = injectedStyle;
  shadowRoot.appendChild(styleElement);

  /**
   * https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/pull/174
   *
   * In the firefox environment, the adoptedStyleSheets bug may prevent contentStyle from being applied properly.
   * Please refer to the PR link above and go back to the contentStyle.css implementation, or raise a PR if you have a better way to improve it.
   */

  createApp(App, { shadowRoot }).mount(rootIntoShadow);

  return true;
}

(() => {
  const appInitialized = initApp();
  if (!appInitialized) return;

  initSelectedStyleEl();
})();
