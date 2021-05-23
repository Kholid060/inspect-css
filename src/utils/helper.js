/* eslint-disable */

export const generateGetBoundingClientRect = (x = 0, y = 0) => () => ({
  width: 0,
  height: 0,
  top: y,
  right: x,
  bottom: y,
  left: x,
});

export function copyToClipboard(text = '') {
  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.style.top = 0;
  textarea.style.left = 0;
  textarea.style.opacity = 0;
  textarea.style.position = 'fixed';

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  document.execCommand('Copy');

  textarea.remove();

  return true;
}

export function debounce(func, wait, immediate) {
  let timeout;

  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}
