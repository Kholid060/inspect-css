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
