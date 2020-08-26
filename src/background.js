const browser = require('webextension-polyfill');

browser.browserAction.onClicked.addListener(async tab => {
  browser.tabs.executeScript({
    file: 'content.js',
  });
  browser.tabs.insertCSS({
    file: 'content.css',
  });
});
