/* eslint-disable import/no-webpack-loader-syntax */
import app, { insertShadowRoot } from './main';
import appCss from '!to-string-loader!css-loader!postcss-loader!../assets/css/content-script/app.css';
import contentCss from '!to-string-loader!css-loader!postcss-loader!../assets/css/content-script/style.css';

function generateCSS() {
  const style = document.createElement('style');
  style.innerText = contentCss;

  document.body.appendChild(style);

  return function () {
    document.body.removeChild(style);
  };
}

function generateContent(container) {
  const content = document.createElement('div');

  const style = document.createElement('style');
  style.innerText = appCss;

  app.mount(content);

  container.shadowRoot.appendChild(content);
  container.shadowRoot.appendChild(style);

  return function () {
    app.unmount();
    document.body.removeChild(container);
  };
}

(() => {
  const isAppExist = document.querySelector('.inspect-css');

  if (isAppExist) return;

  const container = document.createElement('div');

  container.attachShadow({ mode: 'open' });
  container.classList = 'inspect-css';

  insertShadowRoot(container.shadowRoot);

  const content = generateContent(container);
  const css = generateCSS();

  app.config.globalProperties.destoryExtension = () => {
    content();
    css();

    const activeElement = document.querySelector('[active-element]');
    if (activeElement) activeElement.removeAttribute('active-element');

    ['pause', 'display-grid'].forEach((classes) => {
      document.body.classList.remove(classes);
    });
  };

  document.body.appendChild(container);
})();
