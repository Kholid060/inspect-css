const browser = require('webextension-polyfill');

browser.browserAction.onClicked.addListener(async tab => {
  browser.tabs.executeScript({
    file: 'content.js',
  });
  browser.tabs.insertCSS({
    file: 'content.css',
  });
});

browser.runtime.onMessage.addListener(({ type }) => {
  if (type === 'captureTab') {
    return new Promise(resolve => {
      browser.tabs.captureVisibleTab().then(image => {
        resolve(image);
      });
    });
  }
});
