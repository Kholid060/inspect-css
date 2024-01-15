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
