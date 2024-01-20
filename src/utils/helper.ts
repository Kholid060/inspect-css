import { ClientRectObject } from '@floating-ui/vue';

export const generateBoundingClientRect =
  (x = 0, y = 0) =>
  (): ClientRectObject => ({
    x,
    y,
    top: y,
    left: x,
    width: 0,
    right: x,
    height: 0,
    bottom: y,
  });

export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
) {
  let timeoutId: NodeJS.Timeout;

  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export function wrapInParenthesis(text: string) {
  let wrappedText = text;

  if (!text.startsWith('(')) wrappedText = `(${wrappedText}`;
  if (!text.endsWith(')')) wrappedText = `${wrappedText})`;

  return wrappedText;
}

export function downloadFile(filename: string, blob: Blob | string) {
  const isString = typeof blob === 'string';
  const objectURL = isString ? blob : URL.createObjectURL(blob);

  const anchorEl = document.createElement('a');
  anchorEl.href = objectURL;
  anchorEl.download = filename;

  document.body.appendChild(anchorEl);

  anchorEl.click();
  anchorEl.remove();

  if (!isString) URL.revokeObjectURL(objectURL);
}

export function parseURL(url: string) {
  try {
    return new URL(url);
  } catch (error) {
    return null;
  }
}
