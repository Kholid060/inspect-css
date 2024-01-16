import { Plugin, inject, shallowReactive } from 'vue';

const APP_PROVIDER_KEY = Symbol('app-provider');

export interface AppState {
  paused: boolean;
  showGrid: boolean;
}

export interface AppStateProvider {
  state: AppState;
  destroy: () => void;
  shadowRoot: ShadowRoot;
  updateState: (state: Partial<AppState>) => void;
}

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
    function destroy() {
      app.unmount();
      shadowRoot.host.remove();
    }

    app.provide<AppStateProvider>(APP_PROVIDER_KEY, {
      destroy,
      shadowRoot,
      updateState,
      state: appState,
    });
  },
};
