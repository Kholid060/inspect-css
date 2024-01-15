import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import Browser from 'webextension-polyfill';

reloadOnUpdate('pages/background');

Browser.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  Browser.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['/src/pages/content/index.js'],
  });
});

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */

console.log('background loaded');
