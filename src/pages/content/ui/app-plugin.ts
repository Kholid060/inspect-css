import settingsStorage from '@root/src/storages/settings.storage';
import { ElementAppliedStyleRules } from '@root/src/utils/CSSRulesUtils';
import { EL_IDS } from '@root/src/utils/constant';
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
  tempHide: boolean;
  interactive: boolean;
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
      tempHide: false,
      showGrid: false,
      interactive: true,
    });

    settingsStorage.get().then((settings) => {
      Object.assign(appState, settings);
    });

    function updateState(newState: Partial<AppState>) {
      Object.assign(appState, newState);

      if (
        Object.hasOwn(newState, 'showGrid') ||
        Object.hasOwn(newState, 'interactive')
      ) {
        settingsStorage.set({
          showGrid: appState.showGrid,
          interactive: appState.interactive,
        });
      }
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

      document.getElementById(EL_IDS.customCSS)?.remove();
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
