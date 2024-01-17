import { ElementAppliedStyleRules } from '@root/src/utils/CSSRulesUtils';
import { resetAppliedStyleValue } from '@root/src/utils/generate-element-css';
import { Plugin, inject, shallowReactive } from 'vue';
export interface StyleData {
  index: number;
  items: Record<number, StyleDataItem>;
}
export interface StyleDataItem {
  id: number;
  elSelector: string;
  initialProps: ElementAppliedStyleRules;
}

export interface AppState {
  paused: boolean;
  showGrid: boolean;
}
export interface AppStateProvider {
  state: AppState;
  destroy: () => void;
  styleData: StyleData;
  shadowRoot: ShadowRoot;
  updateState: (state: Partial<AppState>) => void;
  addStyleItem(detail: Omit<StyleDataItem, 'id'>): StyleDataItem;
}

const APP_PROVIDER_KEY = Symbol('app-provider');
const styleData: StyleData = {
  index: 0,
  items: {},
};

export function useAppProvider() {
  const state = inject<AppStateProvider>(APP_PROVIDER_KEY)!;

  return state;
}

export const appPlugin: Plugin = {
  install(app, shadowRoot: ShadowRoot) {
    const appState = shallowReactive<AppState>({
      paused: false,
      showGrid: false,
    });

    function updateState(newState: Partial<AppState>) {
      Object.assign(appState, newState);
    }
    function addStyleItem(detail: Omit<StyleDataItem, 'id'>) {
      const data: StyleDataItem = {
        ...detail,
        id: styleData.index,
        initialProps: resetAppliedStyleValue(detail.initialProps),
      };

      styleData.items[styleData.index] = data;
      styleData.index += 1;

      return data;
    }
    function destroy() {
      app.unmount();
      shadowRoot.host.remove();
    }

    app.provide<AppStateProvider>(APP_PROVIDER_KEY, {
      destroy,
      styleData,
      shadowRoot,
      updateState,
      addStyleItem,
      state: appState,
    });
  },
};
