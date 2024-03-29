export const EL_ATTR_NAME = {
  hover: 'inspect-css-hover',
  selected: 'inspect-css-selected',
  dragging: 'inspect-css-dragging',
  showGrid: 'inspect-css-show-grid',
  customStyle: 'inspect-style-selector',
} as const;

export const CONTENT_ZINDEX = {
  overlay: 999997,
  content: 999998,
  toolbar: 999999,
} as const;

export const EL_IDS = {
  customCSS: 'inspect-css-custom-style',
} as const;

export const IS_MAC_OS = navigator.userAgent.indexOf('Mac OS X') !== -1;

export const SESSION_STORAGE_KEY = {
  elPropsPosition: 'inspect-css-pos',
} as const;

export const IS_FIREFOX = Boolean(VITE_IS_FIREFOX);
