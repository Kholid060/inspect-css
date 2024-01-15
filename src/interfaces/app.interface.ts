export interface AppState {
  paused: boolean;
  showGrid: boolean;
}

export interface AppStateProvider {
  state: AppState;
  shadowRoot: ShadowRoot;
  updateState: (state: Partial<AppState>) => void;
}
