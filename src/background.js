const browser = require('webextension-polyfill');

browser.browserAction.onClicked.addListener(async ({ id }) => {
  await browser.tabs.executeScript({
    file: 'content.js',
  });

  await browser.tabs.insertCSS({
    file: 'content.css',
  });
});
