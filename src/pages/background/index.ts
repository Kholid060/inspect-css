import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import Browser from 'webextension-polyfill';

reloadOnUpdate('pages/background');

async function injectContentScript(tabId: number) {
  try {
    const isInjected = await new Promise<boolean>((resolve) => {
      Browser.tabs
        .sendMessage(tabId, { type: 'init' })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
    if (isInjected) return;

    await Browser.scripting.executeScript({
      target: { tabId },
      files: ['/src/pages/content/index.js'],
    });
  } catch (error) {
    console.error(error);
  }
}

Browser.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  injectContentScript(tab.id);
});

// DEV ONLY
Browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (!changeInfo.status || changeInfo.status !== 'complete') return;

  Browser.tabs.get(tabId).then((tab) => {
    if (!tab.url || !tab.url.includes('localhost')) return;

    injectContentScript(tabId);
  });
});

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */

console.log('background loaded');
