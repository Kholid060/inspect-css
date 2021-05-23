browser.browserAction.onClicked.addListener(() => {
  browser.tabs.executeScript({
    file: './js/content-script.js',
  });
});

browser.runtime.onMessage.addListener(async ({ type }) => {
  if (type === 'screenshot') {
    const imageUri = await browser.tabs.captureVisibleTab({ quality: 70 });

    return imageUri;
  }
});
